const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const jsonFile = require("./helpers");

const Shelly1 = require('./shelly1');

const app = express();
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 8081;

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
        sensorClone.temperature.value += offset.temperature;
        sensorClone.humidity.value += offset.humidity;
        return sensorClone;
    }).find(s => s.id === zone.sensor.id),
    relays: zone.relays.map(rs => relays.find(r => r._id === rs.id)),
})
var activeZones = {};
var settings = {};
var schedules = {};
var relays = [];
var sensors = {};
var zones = {};
var promises = [];
promises.push(Promise.resolve(jsonFile.readJSONFile("./data/settings.json")).then(result => settings = result));
promises.push(Promise.resolve(jsonFile.readJSONFile("./data/schedules.json")).then(result => schedules = result));
promises.push(Promise.resolve(jsonFile.readJSONFile("./data/relays.json")).then(result => result.forEach(relay => relays.push(new Shelly1(relay._id, relay._ip)))));
promises.push(Promise.resolve(jsonFile.readJSONFile("./data/sensors.json")).then(result => sensors = result));
promises.push(Promise.resolve(jsonFile.readJSONFile("./data/zones.json")).then(result => zones = result));

Promise.all(promises).then(response => {
    processActiveZones();
    setInterval(processActiveZones, settings.timeProcessors.processActiveZones);
    setInterval(processTemperature, settings.timeProcessors.processTemperature);
}
)
// activeZones = getActiveZonesNow();
// jsonFile.readJSONFile("./data/settings.json").then(result => {
//     settings = result;
//     jsonFile.readJSONFile("./data/schedules.json").then( schedulesResult=>{
//         schedules = schedulesResult;
//     }

//     )
//     activeZones = getActiveZonesNow();
// });
// var settings = {
//     "temperature": {
//         "unit": "C",
//         "threshold": 0.3
//     },
//     "humidity": {
//         "unit": "%"
//     },
//     "thermostat": {
//         "mode": 0, // 0-HEAT, 1-COOL, 2-AUTO
//         "zonecontrol": [
//             {
//                 "zoneid": "1",
//                 "mode": 0,
//                 "schedule": "heat",
//                 "offset": {
//                     "temperature": 0.00,
//                     "humidity": 0.00
//                 }
//             },
//             {
//                 "zoneid": "2",
//                 "mode": 0,
//                 "schedule": "heat",
//                 "offset": {
//                     "temperature": -0.40,
//                     "humidity": 0.00
//                 }
//             },
//             {
//                 "zoneid": "1",
//                 "mode": 1,
//                 "schedule": "cool",
//                 "offset": {
//                     "temperature": 0.00,
//                     "humidity": 0.00
//                 }
//             },
//             {
//                 "zoneid": "2",
//                 "mode": 1,
//                 "schedule": "heat",
//                 "offset": {
//                     "temperature": 0.00,
//                     "humidity": 0.00
//                 }
//             }
//         ]
//     }
// }
// var relays = [
//     new Shelly1("41", "192.168.1.41"),
//     new Shelly1("42", "192.168.1.42"),
// ]

// var sensors = [{ "id": "1", "temperature": { "value": 21.5, "unit": "C", }, "humidity": { "value": 50.14, "unit": "%" }, "updated": 1508087210577 }, { "id": "2", "temperature": { "value": 20.5, "unit": "C", }, "humidity": { "value": 50.14, "unit": "%" }, "updated": 1508087210577 }]

// var schedules = [
//     {
//         "id": "cool",
//         "schedule": {
//             "0": [{ "start": 0, "temperature": 20.0 }, { "start": 480, "temperature": 22.8 }, { "start": 1380, "temperature": 20.0 }],
//             "1": [{ "start": 0, "temperature": 20.0 }, { "start": 330, "temperature": 22.8 }, { "start": 480, "temperature": 20.0 }, { "start": 930, "temperature": 22.8 }, { "start": 1380, "temperature": 20.0 }],
//             "2": [{ "start": 0, "temperature": 20.0 }, { "start": 330, "temperature": 22.8 }, { "start": 480, "temperature": 20.0 }, { "start": 930, "temperature": 22.8 }, { "start": 1380, "temperature": 20.0 }],
//             "3": [{ "start": 0, "temperature": 20.0 }, { "start": 330, "temperature": 22.8 }, { "start": 480, "temperature": 20.0 }, { "start": 930, "temperature": 22.8 }, { "start": 1380, "temperature": 20.0 }],
//             "4": [{ "start": 0, "temperature": 20.0 }, { "start": 330, "temperature": 22.8 }, { "start": 480, "temperature": 20.0 }, { "start": 930, "temperature": 22.8 }, { "start": 1380, "temperature": 20.0 }],
//             "5": [{ "start": 0, "temperature": 20.0 }, { "start": 330, "temperature": 22.8 }, { "start": 480, "temperature": 20.0 }, { "start": 930, "temperature": 22.8 }, { "start": 1380, "temperature": 20.0 }],
//             "6": [{ "start": 0, "temperature": 20.0 }, { "start": 480, "temperature": 22.8 }, { "start": 1380, "temperature": 20.0 }]
//         }
//     },
//     {
//         "id": "heat",
//         "schedule": {
//             "0": [{ "start": 0, "temperature": 20.0 }, { "start": 480, "temperature": 22.8 }, { "start": 1380, "temperature": 20.0 }],
//             "1": [{ "start": 0, "temperature": 20.0 }, { "start": 330, "temperature": 22.8 }, { "start": 480, "temperature": 20.0 }, { "start": 930, "temperature": 22.8 }, { "start": 1380, "temperature": 20.0 }],
//             "2": [{ "start": 0, "temperature": 20.0 }, { "start": 330, "temperature": 22.8 }, { "start": 480, "temperature": 20.0 }, { "start": 930, "temperature": 22.8 }, { "start": 1380, "temperature": 20.0 }],
//             "3": [{ "start": 0, "temperature": 20.0 }, { "start": 330, "temperature": 22.8 }, { "start": 480, "temperature": 20.0 }, { "start": 930, "temperature": 22.8 }, { "start": 1380, "temperature": 20.0 }],
//             "4": [{ "start": 0, "temperature": 20.0 }, { "start": 330, "temperature": 22.8 }, { "start": 480, "temperature": 20.0 }, { "start": 930, "temperature": 22.8 }, { "start": 1380, "temperature": 20.0 }],
//             "5": [{ "start": 0, "temperature": 20.0 }, { "start": 330, "temperature": 22.8 }, { "start": 480, "temperature": 20.0 }, { "start": 930, "temperature": 22.8 }, { "start": 1380, "temperature": 20.0 }],
//             "6": [{ "start": 0, "temperature": 20.0 }, { "start": 480, "temperature": 22.8 }, { "start": 1380, "temperature": 20.0 }]
//         }
//     },
//     {
//         "id": "away",
//         "schedule": {
//             "0": [{ "start": 0, "target_temperature": 18.0 }],
//             "1": [{ "start": 0, "target_temperature": 18.0 }],
//             "2": [{ "start": 0, "target_temperature": 18.0 }],
//             "3": [{ "start": 0, "target_temperature": 18.0 }],
//             "4": [{ "start": 0, "target_temperature": 18.0 }],
//             "5": [{ "start": 0, "target_temperature": 18.0 }],
//             "6": [{ "start": 0, "target_temperature": 18.0 }],
//         }
//     }
// ]

// var zones = [
//     {
//         "id": "1",
//         "name": "zone 1",
//         "sensor": { "id": "1" },
//         "relays": [{ "id": "41" }],
//     },
//     {
//         "id": "2",
//         "name": "zone 2",
//         "sensor": { "id": "2" },
//         "relays": [{ "id": "41" }],
//     },
// ]



// getActiveZonesNow().then(result => activeZones = result);

app.post(['/relays', '/sensors', '/schedules'], (req, res, next) => {
    if (!req.body.id) return res.status(406).end();
    req.body.updated = Date.now();
    next();
});

app.get('/status', (req, res) => {

    // Json.writeJSONFile('./data/settings.json', settings);
    // Json.writeJSONFile('./data/relays.json', relays);
    // Json.writeJSONFile('./data/sensors.json', sensors);
    // Json.writeJSONFile('./data/schedules.json', schedules);
    // Json.writeJSONFile('./data/zones.json', zones);

    // processTemperature();
    // res.status(200).send(status);
    res.status(200).send(activeZones);
});

// app.get('/settings', (req, res) => {
//     res.status(200).send(settings);
// });
app.post('/settings', (req, res) => {
    // const {temperature, threshold} = obj.temeprature;
    // if(temperature) settings.temperature = temperature;
    // if(threshold) settings.threshold = threshold;
    var obj = req.body;
    if (obj.temperature)
        settings.temperature = { ...settings.temperature, ...obj.temperature }
    if (obj.humidity)
        settings.humidity = { ...settings.humidity, ...obj.humidity }
    if (obj.thermostat)
        settings.thermostat = { ...settings.thermostat, ...obj.thermostat }
    jsonFile.writeJSONFile('./data/settings.json', settings);

    res.status(200).send(settings);
});

app.get('/settings/*', (req, res) => {
    let final = findDeepInObjectByArrayOfProperties(settings, req.params[0].split('/').filter(s => s !== undefined && s.trim()));
    if (final !== undefined)
        return res.status(200).json(final);
    else return res.status(404).end();

});
function findDeepInObjectByArrayOfProperties(obj, arrayOfPropertyes) {
    if (!obj) return;
    if (arrayOfPropertyes.length < 1) return obj;
    const [property] = arrayOfPropertyes;
    const restOfProperties = [...arrayOfPropertyes].slice(1);
    if (restOfProperties.length > 0) return findDeepInObjectByArrayOfProperties(obj[property], restOfProperties);
    else return obj[property];
}

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
    jsonFile.writeJSONFile('.data/relays.json', relays);

    return res.status(201).send(relay);
});
app.get('/relays/:id', (req, res) => {
    var foundRelay = relays.filter(s => s._id === req.params.id)[0];
    return responseReturn(req, res, foundRelay);
});

app.get('/sensors', (req, res) => {
    res.status(200).send(sensors);
});

// app.use((res, req) => req.updated ))


app.post('/sensors', (req, res) => {
    var foundSensor = sensors.filter(s => s.id === req.body.id)[0];
    if (!foundSensor) sensors.push({ ...req.body });
    else sensors.splice(sensors.indexOf(foundSensor), 1, { ...foundSensor, ...req.body });
    jsonFile.writeJSONFile('.data/sensors.json', sensors);
    res.status(201).end()
});

app.get('/sensors/:id', (req, res) => {
    var foundSensor = sensors.filter(s => s.id === req.params.id)[0];
    return responseReturn(req, res, foundSensor);
});


app.get('/schedules', (req, res) => {
    res.status(200).send(schedules);
});
app.get('/schedules/:id', (req, res) => {
    var foundSchedule = schedules.filter(s => s.id === req.params.id)[0];
    return responseReturn(req, res, foundSchedule);
});

app.get('/zones', (req, res) => { res.status(200).send(zones); });
app.get('/activezones', (req, res) => { res.status(200).send(activeZones); });

app.listen(port, () => {
    console.log(`server is runing on port:${port}`)
})

function responseReturn(req, res, item) {
    return res.status(item ? 200 : 404).send(item ? item : `Sorry, cant find that id: ${req.params.id}`);
}

function getActiveZonesNow() {
    var date = new Date();
    const currentTime = date.getHours() * 60 + date.getMinutes();

    return settings.thermostat.zonecontrol.filter(z => z.mode === settings.thermostat.mode && z.isenabled === true).map(activeZone => {
        var activeSchedule = schedules.find(s => s.id === activeZone.schedule).schedule;
        var intervals = activeSchedule[date.getDay()].map((interval, index, array) => ({ from: interval.start, to: ((array[index + 1] && array[index + 1].start) || 1440) - 1, interval: interval }));
        const { interval } = intervals.find(interval => currentTime >= interval.from && currentTime <= interval.to);
        return ({
            zone: zones.map(convertZoneFactory(activeZone.offset)).find(z => z.id === activeZone.zoneid),
            // schedule: schedules.find(s => s.id === activeZone.schedule).schedule,
            mode: activeZone.mode,
            interval: interval,
            temperature: activeZone.temperature || settings.temperature
            // offset: activeZone.offset,

        })
    });


}
function buildActiveZones() {
    return settings.thermostat.zonecontrol.filter(z => z.mode === settings.thermostat.mode && z.isenabled === true).map(activeZone => buildActiveZone(activeZone));
}
function buildActiveZone(activeZone) {
    var date = new Date();
    const currentTime = date.getHours() * 60 + date.getMinutes();
    var activeSchedule = schedules.find(s => s.id === activeZone.schedule).schedule;
    var intervals = activeSchedule[date.getDay()].map((interval, index, array) => ({ from: interval.start, to: ((array[index + 1] && array[index + 1].start) || 1440) - 1, interval: interval }));
    const { interval } = intervals.find(interval => currentTime >= interval.from && currentTime <= interval.to);
    return ({
        zone: zones.map(convertZoneFactory(activeZone.offset)).find(z => z.id === activeZone.zoneid),
        // schedule: schedules.find(s => s.id === activeZone.schedule).schedule,
        mode: activeZone.mode,
        interval: interval,
        temperature: activeZone.temperature || settings.temperature
        // offset: activeZone.offset,

    })

}
function processActiveZones() {
    // activeZones = getActiveZonesNow();
    activeZones = buildActiveZones();
}
function startIntervalPooling(activeZone){

}
function processTemperature() {

    var tOn = [];
    var tOff = [];
    activeZones.forEach(activeZone => {
        //Heat Mode
        if (activeZone.mode === 0) {
            var targetTemperature = activeZone.interval.temperature + settings.temperature.threshold;
            if (activeZone.zone.sensor.temperature.value > targetTemperature) activeZone.zone.relays.forEach(relay => { if (tOff.indexOf(relay) === -1) tOff.push(relay) });
            else activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
        }

        //Cool Mode
        if (activeZone.mode === 1) {
            var targetTemperature = activeZone.interval.temperature - settings.temperature.threshold;
            if (activeZone.zone.sensor.temperature.value < targetLow) activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); })
            else activeZone.zone.relays.forEach(relay => { if (tOff.indexOf(relay) === -1) tOff.push(relay); });
        }
    });
    tOff.filter(r => tOn.indexOf(r) < 0).filter(r => r.isOn).forEach(t => t.turnOff());
    tOn.filter(r => !r.isOn).forEach(t => t.turnOn());


    // Detect hourly interval
    // var intervals = activeZone.schedule[date.getDay()].map((interval, index, array) => ({ from: interval.start, to: ((array[index + 1] && array[index + 1].start) || 1440) - 1, interval: interval }));
    // const { interval } = intervals.find(interval => currentTime >= interval.from && currentTime <= interval.to);
    // settings.thermostat.zonecontrol.filter(z => z.mode === settings.thermostat.mode).map(activeZone => {
    //     var activeSchedule = schedules.find(s => s.id === activeZone.schedule).schedule;
    //     var intervals = activeSchedule[date.getDay()].map((interval, index, array) => ({ from: interval.start, to: ((array[index + 1] && array[index + 1].start) || 1440) - 1, interval: interval }));
    //     const { interval } = intervals.find(interval => currentTime >= interval.from && currentTime <= interval.to);
    //     return ({
    //     zone: zones.map(convertZoneFactory(activeZone.offset)).find(z => z.id === activeZone.zoneid),
    //     // schedule: schedules.find(s => s.id === activeZone.schedule).schedule,
    //     mode: activeZone.mode,
    //     interval: interval
    //     // offset: activeZone.offset,

    // })});

    // const fullZones = zones.map(zone => ({
    //     id: zone.id,
    //     name: zone.name,
    //     sensor: sensors.find(s => s.id === zone.sensor.id),
    //     relays: zone.relays.map(rs => relays.find(r => r.id === rs.id)),
    // }));
    // const convertZoneFactory = (offset) => (zone) => ({
    //     id: zone.id,
    //     name: zone.name,
    //     sensor: sensors.map(sn => { let sensor = { ...sn }; sensor.temperature.value += offset.temperature; sensor.humidity.value += offset.humidity; return sensor; }).find(s => s.id === zone.sensor.id),
    //     relays: zone.relays.map(rs => relays.find(r => r.id === rs.id)),
    // })
    // const activeZones = settings.thermostat.zonecontrol.filter(z => z.mode === settings.thermostat.mode).map(activeZone => ({
    //     zone: zones.map(convertZoneFactory(activeZone.offset)).find(z => z.id === activeZone.zoneid),
    //     schedule: schedules.find(s => s.id === activeZone.schedule),
    //     mode: activeZone.mode,
    //     offset: activeZone.offset,

    // }));
    // const activeSchedule = schedules.find(s => s.id == settings.thermostat.activeSchedule);
    // var date = new Date();
    // const currentTime = date.getHours() * 60 + date.getMinutes();
    // var intervals = activeSchedule.schedule[date.getDay()].map((interval, index, array) => ({ from: interval.start, to: ((array[index + 1] && array[index + 1].start) || 1440) - 1, interval: interval }));
    // const { interval } = intervals.find(interval => currentTime >= interval.from && currentTime <= interval.to);
    // const controls = settings
    //     .thermostat
    //     .controls
    //     .filter(c => c.mode == settings.thermostat.mode)
    //     .map(control => ({
    //         sensor: sensors.find(s => s.id === control.sensor.id),
    //         relays: control.relays.map(rs => relays.find(r => r.id === rs.id)),
    //         ismain: control.ismain,
    //         mode: control.mode
    //     }));
    // var targetLow = interval.temperature - settings.temperature.threshold
    // var targetHigh = interval.temperature + settings.temperature.threshold
    // var tOn = [];
    // var tOff = [];
    // controls.forEach(control => {
    //     //HEAT MODE
    //     if (control.mode === 0)
    //         if (control.sensor.temperature.value > targetHigh) control.relays.forEach(relay => { if (tOff.indexOf(relay) === -1) tOff.push(relay) });
    //         else control.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });

    //     //COOL MODE
    //     if (control.mode === 1)
    //         if (control.sensor.temperature.value < targetLow) control.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); })
    //         else control.relays.forEach(relay => { if (tOff.indexOf(relay) === -1) tOff.push(relay); });
    // });

    // tOff.filter(r => tOn.indexOf(r) < 0).filter(r => r.ison).forEach(t => callRelay(t.OFF_url));
    // tOn.filter(r => !r.ison).forEach(t => callRelay(t.ON_url));


    // const currentTemps = sensors.map(sensor => sensor.temperature.value);
    // const shouldStartCentrala = currentTemps.some(currentTemp => currentTemp < (targetTemperature - thresholdTemperature));
}






Object.prototype.deepCopy = function deepCopy() {
    if (Array.isArray(this)) this.map(item => item.deepCopy());

    const clone = { ...this };
    const keysToBeCopied = Object.prototype.keys
}