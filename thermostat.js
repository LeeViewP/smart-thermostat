const express = require('express');
const bodyParser = require('body-parser');
// const request = require('request');

const jsonFile = require('./jsonFileHelpers');
const helpers = require('./helpers');

const Shelly1 = require('./shelly1');

const www = require('./www');

const app = express();
app.use(www);
const datafolderPath = './data/'

require("console-stamp")(console, 'mm-dd-yy_HH:MM:ss.l');

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// const port = 8081;

var status = {
    "temperature": {
        "value": 21.5,
        "unit": "C",
        "target": 22.8,
        "threshold": 0.3
    },
    "humidity": {
        "value": 50.14,
        "unit": "%"
    },
    "thermostat": {
        "state": 0, //0-OFF, 1-ON
        "mode": 0, // 0-HEAT, 1-COOL, 2-AUTO
        "activeSchedule": "heat",
    }
}

const convertZoneFactory = (offset) => (zone) => ({
    id: zone.id,
    name: zone.name,
    sensor: sensors.map(sn => {
        let sensorClone = JSON.parse(JSON.stringify({ ...sn }));
        sensorClone.temperature.value = Number(parseFloat(sensorClone.temperature.value + offset.temperature).toFixed(2));
        sensorClone.humidity.value += offset.humidity;
        return sensorClone;
    }).find(s => s.id === zone.sensor.id),
    relays: zone.relays.map(rs => relays.find(r => r._id === rs.id)),
})

// var activeZones = {};
var settings = {};
var schedules = {};
var relays = [];
var sensors = {};
var zones = {};
var overrides = {};

Promise.all(
    [
        Promise.resolve(jsonFile.readJSONFile(`${datafolderPath}/settings.json`)),
        Promise.resolve(jsonFile.readJSONFile(`${datafolderPath}/schedules.json`)),
        Promise.resolve(jsonFile.readJSONFile(`${datafolderPath}/relays.json`)),
        Promise.resolve(jsonFile.readJSONFile(`${datafolderPath}/sensors.json`)),
        Promise.resolve(jsonFile.readJSONFile(`${datafolderPath}/zones.json`)),
        Promise.resolve(jsonFile.readJSONFile(`${datafolderPath}/overrides.json`))
    ]).then(response => {
        settings = response[0];
        schedules = response[1];
        relays = response[2].map(relay => new Shelly1(relay._id, relay._ip));
        sensors = response[3];
        zones = response[4];
        overrides = response[5];
        // Promise.resolve(buildActiveZones())
        //     .then(result => activeZones = result)
        //     .then(() => {
        setInterval(processTemperature, settings.timeProcessors.processTemperature);
        app.listen(settings.server.port, () => {
            console.info(`server is runing on port:${settings.server.port}`)
        })
        processTemperature();
        // });
    }).catch(error => console.error(`Error in promises ${error}`));


app.post(['/relays', '/sensors', '/schedules'], (req, res, next) => {
    if (!req.body.id) return res.status(406).end();
    req.body.updated = Date.now();
    next();
});

app.get('/status', (req, res) => {

    Promise.resolve(buildActiveZones())
        .then(result => res.status(200).send(result)).catch(error => res.status(500).end())
});

app.post('/settings', (req, res) => {
    var obj = req.body;
    if (obj.temperature)
        settings.temperature = { ...settings.temperature, ...obj.temperature }
    if (obj.humidity)
        settings.humidity = { ...settings.humidity, ...obj.humidity }
    if (obj.thermostat)
        settings.thermostat = { ...settings.thermostat, ...obj.thermostat }
    if (obj.timeProcessors)
        settings.timeProcessors = { ...settings.timeProcessors, ...obj.timeProcessors }
    if (obj.server)
        settings.server = { ...settings.server, ...obj.server }

    jsonFile.writeJSONFile(`${datafolderPath}/settings.json`, settings);
    // processActiveZones();
    res.status(200).send(settings);
});

app.get('/settings/*', (req, res) => {
    let final = helpers.findDeepInObjectByArrayOfProperties(settings, req.params[0].split('/').filter(s => s !== undefined && s.trim()));
    if (final !== undefined)
        return res.status(200).json(final);
    else return res.status(404).end();
});

app.post('/manual', (req, res) => {
    req.body.updated = Date.now();
    overrides.push(req.body);
    jsonFile.writeJSONFile(`${datafolderPath}/overrides.json`, overrides);
    console.log(`received manual for active zone:${JSON.stringify(req.body)} `);
    res.status(201).end()
    processTemperature();
});


app.get('/relays', (req, res) => {
    res.status(200).send(relays);
});

app.post('/relays', (req, res) => {
    if (!req.body.id) {
        return res.status(400).send('error');
    } else if (!req.body.ON_url) {
        return res.status(400).send('error');
    } else if (!req.body.OFF_url) {
        return res.status(400).send('error');
    }

    const relay = {
        id: req.body.id,
        ON_url: req.body.ON_url,
        OFF_url: req.body.OFF_url,
        StatusQuery_url: req.body.OFF_url,
        ison: false
    }
    relays.push(relay);
    jsonFile.writeJSONFile(`${datafolderPath}/relays.json`, relays);
    // processActiveZones();
    return res.status(201).send(relay);
});

app.delete('/relays/:id', (req, res) => {
    var foundZone = relays.filter(s => s.id === req.params.id)[0];
    res.status(204).end();
    return;
    if (foundSensor) sensors.splice(sensors.indexOf(foundSensor), 1);
    jsonFile.writeJSONFile(`${datafolderPath}/sensors.json`, sensors);
    res.status(204).end()
});

app.get('/relays/:id', (req, res) => {
    var foundRelay = relays.filter(s => s._id === req.params.id)[0];
    return helpers.responseReturn(req, res, foundRelay);
});

app.get('/sensors', (req, res) => {
    res.status(200).send(sensors);
});

// app.use((res, req) => req.updated ))

app.post('/sensors', (req, res) => {
    var foundSensor = sensors.filter(s => s.id === req.body.id)[0];
    if (!foundSensor) sensors.push({ ...req.body });
    else {
        if (req.body.temperature) {
            req.body.temperature.lastValue = foundSensor.temperature.value;
        }
        sensors.splice(sensors.indexOf(foundSensor), 1, { ...foundSensor, ...req.body });
    }
    jsonFile.writeJSONFile(`${datafolderPath}/sensors.json`, sensors);
    res.status(201).end()
});

app.delete('/sensors/:id', (req, res) => {
    var foundSensor = sensors.filter(s => s.id === req.params.id)[0];
    res.status(204).end();
    return;
    if (foundSensor) sensors.splice(sensors.indexOf(foundSensor), 1);
    jsonFile.writeJSONFile(`${datafolderPath}/sensors.json`, sensors);
    res.status(204).end()
});

app.get('/sensors/:id', (req, res) => {
    var foundSensor = sensors.filter(s => s.id === req.params.id)[0];
    return helpers.responseReturn(req, res, foundSensor);
});

app.get('/schedules', (req, res) => {
    res.status(200).send(schedules);
});

app.get('/schedules/:id', (req, res) => {
    var foundSchedule = schedules.filter(s => s.id === req.params.id)[0];
    return helpers.responseReturn(req, res, foundSchedule);
});

app.get('/zones', (req, res) => { res.status(200).send(zones); });

app.delete('/zones/:id', (req, res) => {
    var foundZone = zones.filter(s => s.id === req.params.id)[0];
    res.status(204).end();
    return;
    if (foundSensor) sensors.splice(sensors.indexOf(foundSensor), 1);
    jsonFile.writeJSONFile(`${datafolderPath}/sensors.json`, sensors);
    res.status(204).end()
});

app.get('/activezones', (req, res) => { res.status(200).send(activeZones); });

// app.listen(port, () => {
//     console.log(`server is runing on port:${port}`)
// })

// function processActiveZones() {
//     Promise.resolve(buildActiveZones())
//         .then(result => activeZones = result).catch(error => console.log(`Error building zones ${error}`));;
// }

function buildActiveZones() {
    //need some better logic to detect the heat or cool modes (will not go toghether to avoid some zones to start heating and other to startcooling in the same time)
    var thMode = settings.thermostat.mode;
    if (settings.thermostat.mode === 2) {
        var date = new Date();
        switch (date.getMonth()) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 10:
            case 11:
                thMode = 0; break;
            default: thMode = 1; break;
        }
    }
    return settings.thermostat.zonecontrol.filter(z => z.mode === thMode && z.isenabled === true).map(controlZone => buildActiveZone(controlZone));
}

function buildActiveZone(controlZone) {
    var date = new Date();
    const currentTime = date.getHours() * 60 + date.getMinutes();
    var activeSchedule = schedules.find(s => s.id === controlZone.schedule).schedule;
    var intervals = activeSchedule[date.getDay()].map((interval, index, array) => ({ from: interval.start, to: ((array[index + 1] && array[index + 1].start) || 1440) - 1, interval: interval }));

    var interval = intervals.find(interval => currentTime >= interval.from && currentTime <= interval.to);
    //building new Object to avoid contamination
    var currentInterval = { start: interval.from, temperature: interval.interval.temperature, end: interval.to };
    overrideFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(currentInterval.start / 60), currentInterval.start % 60);
    overrideTo = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(currentInterval.end / 60), currentInterval.end % 60);
    var override = overrides.filter(override => new Date(override.updated) >= overrideFrom && new Date(override.updated) <= overrideTo && override.id === controlZone.id).sort((a, b) => b.updated - a.updated)[0];
    if (override && override.temperatureOverride) currentInterval.temperature = override.temperatureOverride;

    return {
        id: controlZone.id,
        zone: zones.map(convertZoneFactory(controlZone.offset)).find(z => z.id === controlZone.zoneid),
        mode: controlZone.mode,
        interval: currentInterval,
        temperature: controlZone.temperature || settings.temperature
    }
}

function processTemperature() {
    var tOn = [];
    var tOff = [];
    console.info(`Start processing temperature`);
    buildActiveZones().forEach(activeZone => {
        //Heat Mode
        if (activeZone.mode === 0) {
            let heatIsNeeded = needForHeat(temperatureDiff(activeZone.interval.temperature, activeZone.zone.sensor.temperature.value));
            let heatWasNeeded = needForHeat(temperatureDiff(activeZone.interval.temperature, activeZone.zone.sensor.temperature.lastValue));
            if (heatIsNeeded || heatWasNeeded) {
                activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
            }
            console.info(`Heat Mode set for : ${activeZone.id}-${activeZone.zone.name} Heat is needed: ${heatIsNeeded} and Heat was needed  ${heatWasNeeded} current temperature: ${activeZone.zone.sensor.temperature.value} set Temperature :${activeZone.interval.temperature}`);

            // if (needForHeat(temperatureDiff(activeZone.interval.temperature, activeZone.zone.sensor.temperature.value)))
            //     activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
            // // // var targetTemperature = activeZone.interval.temperature + settings.temperature.threshold; Number(parseFloat(newTemp).toFixed(2));
            // // var minTargetTemperature = Number(parseFloat(activeZone.interval.temperature - settings.temperature.threshold).toFixed(2));
            // // var maxTargetTemperature = Number(parseFloat(activeZone.interval.temperature + settings.temperature.threshold).toFixed(2));
            // // // if (activeZone.zone.sensor.temperature.value > maxTargetTemperature) activeZone.zone.relays.forEach(relay => { if (tOff.indexOf(relay) === -1) tOff.push(relay) });
            // // if (activeZone.zone.sensor.temperature.value < minTargetTemperature) activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
            // // if (activeZone.zone.sensor.temperature.value >= minTargetTemperature && activeZone.zone.sensor.temperature.value < activeZone.interval.temperature) {
            // //     // is between intervals let us see whart we do here 
            // //     activeZone.zone.relays.forEach(relay => { if (relay.isOn) tOn.push(relay); });
            // // }
            // // console.info(`Heat Mode set for : ${activeZone.id}-${activeZone.zone.name} between: ${minTargetTemperature} and ${maxTargetTemperature} current temperature: ${activeZone.zone.sensor.temperature.value}`);
            // // if (activeZone.zone.sensor.temperature.value > targetTemperature) activeZone.zone.relays.forEach(relay => { if (tOff.indexOf(relay) === -1) tOff.push(relay) });
            // // else activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
        }

        //Cool Mode
        if (activeZone.mode === 1) {
            var minTargetTemperature = Number(parseFloat(activeZone.interval.temperature - settings.temperature.threshold).toFixed(2));
            if (activeZone.zone.sensor.temperature.value > minTargetTemperature || activeZone.zone.sensor.temperature.value > activeZone.interval.temperature) activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
            var maxTargetTemperature = Number(parseFloat(activeZone.interval.temperature + settings.temperature.threshold).toFixed(2));
            // if (activeZone.zone.sensor.temperature.value > maxTargetTemperature) activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
            // if (activeZone.zone.sensor.temperature.value < minTargetTemperature) activeZone.zone.relays.forEach(relay => { if (tOff.indexOf(relay) === -1) tOff.push(relay) });

            // var targetTemperature = activeZone.interval.temperature - settings.temperature.threshold;
            console.info(`Cool Mode set for : ${activeZone.id}-${activeZone.zone.name} between: ${minTargetTemperature} and ${maxTargetTemperature} current temperature: ${activeZone.zone.sensor.temperature.value}`);
            // if (activeZone.zone.sensor.temperature.value < targetTemperature) activeZone.zone.relays.forEach(relay => { if (tOff.indexOf(relay) === -1) tOff.push(relay); })
            // else activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
        }
    });
    // tOff.filter(r => tOn.indexOf(r) < 0).forEach(t => t.turnOff());//.filter(r => r.isOn)
    tOn.forEach(t => t.turnOn(10 * 60)); //.filter(r => !r.isOn)
    console.info(`Stop processing temperature`);
}

// function temperatureDiff(targetTemperature, currentTemperature){
//     return Number.parseFloat(Number.parseFloat(targetTemperature).toFixed(2) - Number.parseFloat(currentTemperature).toFixed(2)  ).toFixed(2);
// }
const temperatureDiff = (targetTemperature, currentTemperature) =>
    Number(Number(parseFloat(targetTemperature).toFixed(2)) - Number(parseFloat(currentTemperature).toFixed(2)));

const needForHeat = (temperature) => temperature > settings.temperature.threshold;
const isTemperatureRising = (temperature) => temperatureDiff(temperature.value, temperature.lastValue) > 0;
const isNeedForHeat = (targetTemperature, temperature) => {
    var currentTempDiff = temperatureDiff(targetTemperature, temperature.value);
    var lastTempDiff = temperatureDiff(targetTemperature, temperature.lastValue);
    var currentNeedForHeat = needForHeat(currentTempDiff);
    var lastNeedFOrHeat = needForHeat(lastTempDiff);
    var isRising = isTemperatureRising(temperature)
    return currentNeedForHeat || lastNeedFOrHeat;
    return temperatureDiff(targetTemperature, temperature.value) >= temperatureDiff(targetTemperature, temperature.lastValue)
}