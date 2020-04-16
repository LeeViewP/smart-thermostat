const express = require('express');
const bodyParser = require('body-parser');
const www = require('./www');

require("console-stamp")(console, 'mm-dd-yy_HH:MM:ss.l');

const Datastore = require('nedb');  //https://github.com/louischatriot/nedb
const nconf = require('nconf');     //https://github.com/indexzero/nconf
const path = require('path');

//Local classes
const jsonFile = require('./jsonFileHelpers');
const helpers = require('./helpers');
const Shelly1 = require('./shelly1');

// Other variables
const datafolderPath = './data/'
const dbDir = 'data/db';

const app = express();
app.use(www);
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



const convertZoneFactory = (offset, sensors, relays) => (zone) => ({
    id: zone._id,
    name: zone.name,
    sensor: zone.sensors.map(zs => sensors.map(sn => {
        let sensorClone = JSON.parse(JSON.stringify({ ...sn, type: undefined }));
        if (sensorClone.temperature) sensorClone.temperature.value = Number(parseFloat(sensorClone.temperature.value + offset.temperature).toFixed(2));
        if (sensorClone.humidity) sensorClone.humidity.value += offset.humidity;
        return sensorClone;
    }
    ).find(s => s._id === zs._id))
        .reduce((rZone, minZone) => rZone.temperature.value < minZone.temperature.value ? rZone : minZone),
    relays: zone.relays.map(zr => relays.find(r => r._id === zr._id)),
})




nconf.argv().file({ file: path.resolve(__dirname, datafolderPath, 'settings.json') });
settings = nconf.get('settings');
thermostatS = nconf.get('thermostat');

db = new Datastore({ filename: path.join(__dirname, dbDir, settings.database.name.value), autoload: true });       //used to keep all data
db.persistence.setAutocompactionInterval(settings.database.compactDBInterval.value); //compact the database every 24hrs

var dbCompacted = Date.now();

var schedules = {};
var relays = [];
var sensors = {};
var zones = {};
var overrides = {};

Promise.all(
    [
        Promise.resolve(jsonFile.readJSONFile(`${datafolderPath}/schedules.json`)),
        Promise.resolve(jsonFile.readJSONFile(`${datafolderPath}/relays.json`)),
        Promise.resolve(jsonFile.readJSONFile(`${datafolderPath}/sensors.json`)),
        Promise.resolve(jsonFile.readJSONFile(`${datafolderPath}/zones.json`)),
        Promise.resolve(jsonFile.readJSONFile(`${datafolderPath}/overrides.json`))
    ]).then(response => {
        schedules = response[1];
        relays = response[2].map(relay => new Shelly1(relay._id, relay._ip));
        sensors = response[3];
        zones = response[4];
        overrides = response[5];
        // Build the new database if there is none
        db.find({ type: 'sensor' }, (err, elements) => {
            if (elements.length === 0) db.insert(sensors.map(element => ({ ...{ type: 'sensor', externalId: element.id }, ...element, ...{ id: undefined } })), (err) => { if (err) console.log(`error adding sensors ${err}`) })

        });

        db.find({ type: 'relay' }, (err, elements) => {
            if (elements.length === 0) db.insert(relays.map(element => ({ ...{ type: 'relay', externalId: element.id }, ...element, ...{ id: undefined, _id: undefined } })), (err) => { if (err) console.log(`error adding relays ${err}`) })

        });

        setTimeout(() => { }, 8000)

        db.find({ type: 'zone' }, (err, elements) => {
            if (elements.length === 0) {
                db.find({ type: { $in: ['sensor', 'relay'] } }, (err, elements) => {
                    var dbSensors = elements.filter(e => e.type === 'sensor');
                    var dbRelays = elements.filter(e => e.type === 'relay');
                    var mapzones = zones.map(zone => (
                        {
                            ...zone,
                            ...{ sensors: [dbSensors.map(m => ({ _id: m._id, externalId: m.externalId })).find(s => s.externalId === zone.sensor.id)] },
                            ...{ relays: dbRelays.map(m => ({ _id: m._id, externalId: m.externalId })).filter(drs => { return zone.relays.filter(zr => drs.externalId === zr.id).length > 0 }) }
                        })
                    )
                    var secondMap = mapzones.map(zone => ({
                        ...{ type: 'zone', _id: zone.id },
                        ...zone,
                        ...{ sensors: zone.sensors.map(s => ({ _id: s._id })) },
                        ...{ relays: zone.relays.map(r => ({ _id: r._id })) },
                        ...{ id: undefined, sensor: undefined }
                    }))
                    db.insert(secondMap, (err) => console.log(`error adding zones ${err}`))
                    // db.insert(zones.map(element => ({ ...{ type: 'zone', _id: element.id }, ...element, ...{ id: undefined } })), (err) => console.log(`error adding zones ${err}`))
                })
            }

        });

        db.find({ type: 'schedule' }, (err, elements) => {
            if (elements.length === 0) db.insert(schedules.map(element => ({ ...{ type: 'schedule', name: element.id }, ...element, ...{ id: undefined } })), (err) => console.log(`error adding schedules ${err}`))

        });
        db.find({ type: 'override' }, (err, elements) => {
            // var oldThing = undefined;
            // var newThing = {_id:234};
            // var mergedThing = {...oldThing, ...newThing};
            if (elements.length === 0) db.insert(overrides.map(element => ({ ...{ type: 'override' }, ...element })), (err) => console.log(`error adding overrides ${err}`))

        });

        db.find({ type: 'thermostat' }, (err, elements) => {
            if (elements.length === 0) {
                db.find({ type: 'schedule' }, (err, schedules) => {

                    var mapDefinitions = thermostatS.zonecontrol.map(ctrl => ({ ...ctrl, schedule: schedules.map(s => ({ schedule: s._id, id: s.name })).find(sch => sch.id === ctrl.schedule) }))
                    var secondMap = mapDefinitions.map(z => ({ ...z, schedule: z.schedule.schedule }))
                    var th = { type: 'thermostat', mode: settings.modes.find(m => m.mode === thermostatS.mode), controlzones: secondMap };
                    db.insert(th, (err) => console.log(`error adding definitions ${err}`));
                })

            }
        });

        setInterval(processTemperature, settings.timeProcessors.processTemperature);
        app.listen(settings.server.port, () => {
            console.info(`server is runing on port:${settings.server.port}`)
        })
        processTemperature();
    }).catch(error => console.error(`Error in promises ${error}`));


app.post(['/relays', '/sensors', '/schedules', '/manual'], (req, res, next) => {
    if (!req.body.id) return res.status(400).end();
    req.body.updated = Date.now();
    next();
});

//#region Status

app.get('/status', async (req, res) => processActiveZones().then(result => res.status(200).send(result)).catch(error => { console.error(`Error in GET status ${error}`); res.status(500).end(); }));

//#endregion

//#region Settings

app.post('/settings', (req, res) => {
    var obj = req.body;
    var settings = nconf.get('settings');

    if (obj.temperature)
        settings.temperature = { ...settings.temperature, ...obj.temperature }
    if (obj.humidity)
        settings.humidity = { ...settings.humidity, ...obj.humidity }
    if (obj.database)
        settings.database = { ...settings.database, ...obj.database }
    if (obj.timeProcessors)
        settings.timeProcessors = { ...settings.timeProcessors, ...obj.timeProcessors }
    if (obj.server)
        settings.server = { ...settings.server, ...obj.server }

    global.settings = settings;
    nconf.save(function (err) {
        if (err) {
            console.error(`Failed saving settings: ${err}`);
            res.status(500).end();
        }
        else {
            console.info('Succesfully saved settings');
            res.status(201).end();
            // io.sockets.emit('SETTINGSDEF', settings);
        }
    });



    // jsonFile.writeJSONFile(`${datafolderPath}/settings.json`, settings);
    // // processActiveZones();
    // res.status(200).send(settings);
});

app.get('/settings/*', (req, res) => {
    let final = helpers.findDeepInObjectByArrayOfProperties(settings, req.params[0].split('/').filter(s => s !== undefined && s.trim()));
    if (final !== undefined)
        return res.status(200).json(final);
    else return res.status(404).end();
});
//#endregion

//#region Thermostat

app.get('/thermostat', (req, res) => dbFindOne(db, { type: 'thermostat' }).then(document => res.status(200).send({ ...document, type: undefined, _id: undefined })).catch(error => { console.error(`Error in GET thermostat ${error}`); res.status(500).end(); }));

app.post('/thermostat', (req, res) => {
    var thermostat = { ...req.body, type: 'thermostat' };
    dbFindOne(db, { type: thermostat.type }).then(document => {
        if (document == null) {
            db.insert(thermostat);
            res.status(201).end();
        }
        else {
            db.update({ _id: document._id, type: thermostat.type }, { $set: { ...document, ...thermostat } }, {}, function (err, numReplaced) { console.info('   [' + document._id + '] DB-Updates:' + numReplaced); });
            res.status(201).end();
        }
        processTemperature();
    }).catch(error => { console.error(`Error in POST thermostat ${error}`); res.status(500).end(); });
});

//#endregion

//#region  Overrides

app.post('/manual', (req, res) => {
    var ovveride = { ...req.body, _id: req.body.id, id: undefined, type: 'override' };
    dbFindOne(db, { type: ovveride.type, _id: ovveride._id }).then(document => {
        if (document == null) {
            db.insert(ovveride);
            res.status(201).end();
        }
        else {
            db.update({ _id: document._id, type: ovveride.type }, { $set: { ...document, ...ovveride } }, {}, function (err, numReplaced) { console.info('   [' + document._id + '] DB-Updates:' + numReplaced); });
            res.status(201).end();
        }
        processTemperature();
    }).catch(error => { console.error(`Error in POST manual override ${error}`); res.status(500).end(); });
});

//#endregion

//#region Relays
app.get('/relays', (req, res) => dbFind(db, { type: 'relay' }).then(docs => res.status(200).send(docs.map(doc => ({ ...doc, type: undefined })))).catch(error => { console.error(`Error in GET relays ${error}`); res.status(500).end(); }));

app.post('/relays', (req, res) => {
    if (!(req.body.ip || req.body._ip))
        return res.status(400).send('Missing ip ');
    var relay = { ...req.body, externalId: req.body.id, id: undefined, type: 'relay', _ip: req.body.ip || req.body._ip, ip: undefined, _url: req.body._url || `http://${req.body.ip || req.body._ip}` };
    dbFindOne(db, { type: relay.type, externalId: relay.externalId }).then(document => {
        if (document == null) {
            db.insert(relay);
            res.status(201).end();
        }
        else {
            db.update({ _id: document._id, type: relay.type }, { $set: { ...document, ...relay } }, {}, function (err, numReplaced) { console.info('   [' + document._id + '] DB-Updates:' + numReplaced); });
            res.status(201).end();
        }
    }).catch(error => { console.error(`Error in POST relays ${error}`); res.status(500).end(); });
});

app.delete('/relays/:id', (req, res) => {
    dbFindOne(db, { type: 'relay', _id: req.params.id }).then(document => {
        if (document)
            dbDelete(db, { _id: document._id, type: 'relay' },{})
                .then(numDeleted => { console.info(`[${document._id}] DB-Removed: ${numDeleted}`); res.status(202).end(); })
        else res.status(404).end();
    });
});

//#endregion

//#region Sensors

app.get('/sensors', (req, res) => dbFind(db, { type: 'sensor' }).then(docs => res.status(200).send(docs.map(doc => ({ ...doc, type: undefined })))).catch(error => { console.error(`Error in GET sensors ${error}`); res.status(500).end(); }));


app.post('/sensors', (req, res) => {
    var sensor = { ...req.body, externalId: req.body.id, id: undefined, type: 'sensor' };
    dbFindOne(db, { type: sensor.type, externalId: sensor.externalId }).then(document => {
        if (document == null) {
            db.insert(sensor);
            res.status(201).end();
        }
        else {
            sensor.temperature.lastValue = document.temperature.value;
            db.update({ _id: document._id, type: sensor.type }, { $set: { ...document, ...sensor } }, {}, function (err, numReplaced) { console.info('   [' + document._id + '] DB-Updates:' + numReplaced); });
            res.status(201).end();
        }
    }).catch(error => { console.error(`Error in POST sensors ${error}`); res.status(500).end(); });
});

app.delete('/sensors/:id', (req, res) => {
    dbFindOne(db, { type: 'sensor', _id: req.params.id }).then(document => {
        if (document)
            dbDelete(db, { _id: document._id, type: 'sensor' },{})
                .then(numDeleted => { console.info(`[${document._id}] DB-Removed: ${numDeleted}`); res.status(202).end(); });
        else res.status(404).end();
    });
});

app.get('/sensors/:id', (req, res) => {
    var foundSensor = sensors.filter(s => s.id === req.params.id)[0];
    return helpers.responseReturn(req, res, foundSensor);
});

//#endregion

//#region Schedules

app.get('/schedules', (req, res) => dbFind(db, { type: 'schedule' }).then(docs => res.status(200).send(docs.map(doc => ({ ...doc, type: undefined })))).catch(error => { console.error(`Error in GET schedules ${error}`); res.status(500).end(); }));

app.get('/schedules/:id', (req, res) => {
    var foundSchedule = schedules.filter(s => s.id === req.params.id)[0];
    return helpers.responseReturn(req, res, foundSchedule);
});

//#endregion

//#region Zones
app.get('/zones', (req, res) => {
    db.find({ type: 'zone' }, function (err, docs) {
        res.status(200).send(docs.map(doc => ({ ...doc, type: undefined, })));
    })
});

//{"type":"zone","_id":"35C1EC41-6462-47A2-8ED6-14F488831D5F","name":"zone 1","relays":[{"_id":"tp3WJPthdHUYnnlv"}],"sensors":[{"_id":"0QxDDBtfKkuy1lpk"}]}
app.post('/zones', (req, res) => {
    var zone = { ...req.body, type: 'zone' }
    dbFindOne(db, { type: zone.type, _id: zone._id }).then(document => {
        if (document == null) {
            dbInsert(zone)
                .then(dc => { console.info(`[${document._id}] DB-Inserted: ${dc}`); res.status(201).end(); });
        }
        else {
            dbUpdate({ _id: document._id, type: zone.type }, { $set: { ...document, ...zone } }, {})
                .then(nr => { console.info(`[${document._id}] DB-Updates: ${nr}`); res.status(201).end(); })
        }
    }).catch(error => { console.error(`Error in POST zones ${error}`); res.status(500).end(); });
});

app.delete('/zones/:id', (req, res) => {
    dbFindOne(db, { type: 'zone', _id: req.params.id }).then(document => {
        if (document)
            dbDelete(db, { _id: document._id, type: 'zone' },{})
                .then(numDeleted => { console.info(`[${document._id}] DB-Removed: ${numDeleted}`); res.status(202).end(); })
        else res.status(404).end();
    });
});

//#endregion

// app.use((res, req) => req.updated ))

// app.listen(port, () => {
//     console.log(`server is runing on port:${port}`)
// })

//#region  Core functions
const detectThermostatMode = (mode) => {
    if (mode === 2) {
        var date = new Date();
        switch (date.getMonth()) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 10:
            case 11:
                mode = 0; break;
            default: mode = 1; break;
        }
    }
    return mode;
}

buildActiveZones = () =>
    new Promise((resolve, reject) =>
        dbFindOne(db, { type: 'thermostat' }).then(doc => Promise.all(
            doc.controlzones.filter(z => z.mode === detectThermostatMode(doc.mode.mode) && z.isenabled === true).map(zone => buildActiveZone(zone))
        ).then(zones => resolve(zones))));


// db.find({ $or: [{ planet: 'Earth' }, { planet: 'Mars' }] }, function (err, docs) {
//     // docs contains Earth and Mars
//   });
// // Using $in. $nin is used in the same way
// db.find({ planet: { $in: ['Earth', 'Jupiter'] }}, function (err, docs) {
//   // docs contains Earth and Jupiter
// });

buildActiveZone = (controlZone) =>
    new Promise((resolve, reject) =>
        dbFind(db, { type: { $in: ['schedule', 'override', 'sensor', 'relay', 'zone'] } }).then(elements => {
            var date = new Date();
            const currentTime = date.getHours() * 60 + date.getMinutes();
            var activeSchedule = elements.filter(s => s.type === 'schedule').find(s => s._id === controlZone.schedule).schedule; //! if is missing schedule
            var intervals = activeSchedule[date.getDay()].map((interval, index, array) => ({ from: interval.start, to: ((array[index + 1] && array[index + 1].start) || 1440) - 1, interval: interval }));
            var interval = intervals.find(interval => currentTime >= interval.from && currentTime <= interval.to);
            //building new Object to avoid contamination
            var currentInterval = { start: interval.from, temperature: interval.interval.temperature, end: interval.to };
            overrideFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(currentInterval.start / 60), currentInterval.start % 60);
            overrideTo = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(currentInterval.end / 60), currentInterval.end % 60);
            var override = elements.filter(s => s.type == 'override').filter(override => new Date(override.updated) >= overrideFrom && new Date(override.updated) <= overrideTo && override._id === controlZone.id).sort((a, b) => b.updated - a.updated)[0];
            if (override && override.temperatureOverride) currentInterval.temperature = override.temperatureOverride;
            let activeZone =
            {
                id: controlZone.id,
                zone: elements.filter(s => s.type === 'zone').map(
                    convertZoneFactory(
                        controlZone.offset,
                        elements.filter(s => s.type === 'sensor'),
                        elements.filter(s => s.type === 'relay').map(relay => new Shelly1(relay._id, relay._ip))
                    )).find(z => z.id === controlZone.zoneid),
                mode: controlZone.mode,
                interval: currentInterval,
                temperature: controlZone.temperature || settings.temperature
            }
            resolve(activeZone);
        })
    );

processActiveZones = async () => await Promise.resolve(buildActiveZones()).then(activeZones => activeZones);

processTemperature = () =>
    processActiveZones().then(activezones => {
        var tOn = [];
        console.info(`Start processing temperature`);
        activezones.forEach(activeZone => {
            //Heat Mode
            if (activeZone.mode === 0) {
                let heatIsNeeded = needForHeat(temperatureDiff(activeZone.interval.temperature, activeZone.zone.sensor.temperature.value));
                let heatWasNeeded = needForHeat(temperatureDiff(activeZone.interval.temperature, activeZone.zone.sensor.temperature.lastValue));
                if (heatIsNeeded || heatWasNeeded) {
                    activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
                }
                console.info(`Heat Mode set for : ${activeZone.id}-${activeZone.zone.name} Heat is needed: ${heatIsNeeded} and Heat was needed  ${heatWasNeeded} current temperature: ${activeZone.zone.sensor.temperature.value} set Temperature :${activeZone.interval.temperature}`);
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
        tOn.forEach(t => t.turnOn(10 * 60)); //.filter(r => !r.isOn)
        console.info(`Stop processing temperature`);
    }
    ).catch(err => console.error(`Process temperature failed :${err}`));
//#endregion

//#region  Unneeded Comments will be removed when all works fine 


//     db.findOne({ type: 'thermostat' }, (err, doc) => {
//         if (err) {
//             reject(err)
//         }
//         else {
//             Promise.all(
//                 doc.controlzones.filter(z => z.mode === detectThermostatMode(doc.mode.mode) && z.isenabled === true).map(zone => buildActiveZone(zone))
//             ).then(zones => resolve(zones));
//         }
//     });
// });

// db.find({ type: { $in: ['schedule', 'override', 'sensor', 'relay', 'zone'] } }, (err, elements) => {
//     if (err) {
//         reject(err)
//     } else {
//         var date = new Date();
//         const currentTime = date.getHours() * 60 + date.getMinutes();
//         var activeSchedule = elements.filter(s => s.type === 'schedule').find(s => s._id === controlZone.schedule).schedule;
//         var intervals = activeSchedule[date.getDay()].map((interval, index, array) => ({ from: interval.start, to: ((array[index + 1] && array[index + 1].start) || 1440) - 1, interval: interval }));
//         var interval = intervals.find(interval => currentTime >= interval.from && currentTime <= interval.to);
//         //building new Object to avoid contamination
//         var currentInterval = { start: interval.from, temperature: interval.interval.temperature, end: interval.to };
//         overrideFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(currentInterval.start / 60), currentInterval.start % 60);
//         overrideTo = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(currentInterval.end / 60), currentInterval.end % 60);
//         var override = elements.filter(s => s.type == 'override').filter(override => new Date(override.updated) >= overrideFrom && new Date(override.updated) <= overrideTo && override.id === controlZone.id).sort((a, b) => b.updated - a.updated)[0];
//         if (override && override.temperatureOverride) currentInterval.temperature = override.temperatureOverride;
//         // var sensors = elements.filter(s => s.type === 'sensor');
//         // var relays = elements.filter(s => s.type === 'relay').map(relay => new Shelly1(relay._id, relay._ip));
//         // var zones = elements.filter(s => s.type === 'zone');
//         // var mappedZones = elements.filter(s => s.type === 'zone').map(convertZoneFactory(controlZone.offset, elements.filter(s => s.type === 'sensor'), elements.filter(s => s.type === 'relay').map(relay => new Shelly1(relay._id, relay._ip))));
//         // var zone = elements.filter(s => s.type === 'zone').map(
//         //     convertZoneFactory(
//         //         controlZone.offset,
//         //         elements.filter(s => s.type === 'sensor'),
//         //         elements.filter(s => s.type === 'relay').map(relay => new Shelly1(relay._id, relay._ip))
//         //     )).find(z => z.id === controlZone.zoneid);
//         let activeZone =
//         {
//             id: controlZone.id,
//             zone: elements.filter(s => s.type === 'zone').map(
//                 convertZoneFactory(
//                     controlZone.offset,
//                     elements.filter(s => s.type === 'sensor'),
//                     elements.filter(s => s.type === 'relay').map(relay => new Shelly1(relay._id, relay._ip))
//                 )).find(z => z.id === controlZone.zoneid),
//             mode: controlZone.mode,
//             interval: currentInterval,
//             temperature: controlZone.temperature || settings.temperature
//         }
//         resolve(activeZone);
//     }
// })


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


// activezones.forEach(activeZone => {
//     //Heat Mode
//     if (activeZone.mode === 0) {
//         let heatIsNeeded = needForHeat(temperatureDiff(activeZone.interval.temperature, activeZone.zone.sensor.temperature.value));
//         let heatWasNeeded = needForHeat(temperatureDiff(activeZone.interval.temperature, activeZone.zone.sensor.temperature.lastValue));
//         if (heatIsNeeded || heatWasNeeded) {
//             activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
//         }
//         console.info(`Heat Mode set for : ${activeZone.id}-${activeZone.zone.name} Heat is needed: ${heatIsNeeded} and Heat was needed  ${heatWasNeeded} current temperature: ${activeZone.zone.sensor.temperature.value} set Temperature :${activeZone.interval.temperature}`);

//         // if (needForHeat(temperatureDiff(activeZone.interval.temperature, activeZone.zone.sensor.temperature.value)))
//         //     activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
//         // // // var targetTemperature = activeZone.interval.temperature + settings.temperature.threshold; Number(parseFloat(newTemp).toFixed(2));
//         // // var minTargetTemperature = Number(parseFloat(activeZone.interval.temperature - settings.temperature.threshold).toFixed(2));
//         // // var maxTargetTemperature = Number(parseFloat(activeZone.interval.temperature + settings.temperature.threshold).toFixed(2));
//         // // // if (activeZone.zone.sensor.temperature.value > maxTargetTemperature) activeZone.zone.relays.forEach(relay => { if (tOff.indexOf(relay) === -1) tOff.push(relay) });
//         // // if (activeZone.zone.sensor.temperature.value < minTargetTemperature) activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
//         // // if (activeZone.zone.sensor.temperature.value >= minTargetTemperature && activeZone.zone.sensor.temperature.value < activeZone.interval.temperature) {
//         // //     // is between intervals let us see whart we do here 
//         // //     activeZone.zone.relays.forEach(relay => { if (relay.isOn) tOn.push(relay); });
//         // // }
//         // // console.info(`Heat Mode set for : ${activeZone.id}-${activeZone.zone.name} between: ${minTargetTemperature} and ${maxTargetTemperature} current temperature: ${activeZone.zone.sensor.temperature.value}`);
//         // // if (activeZone.zone.sensor.temperature.value > targetTemperature) activeZone.zone.relays.forEach(relay => { if (tOff.indexOf(relay) === -1) tOff.push(relay) });
//         // // else activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
//     }

//     //Cool Mode
//     if (activeZone.mode === 1) {
//         var minTargetTemperature = Number(parseFloat(activeZone.interval.temperature - settings.temperature.threshold).toFixed(2));
//         if (activeZone.zone.sensor.temperature.value > minTargetTemperature || activeZone.zone.sensor.temperature.value > activeZone.interval.temperature) activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
//         var maxTargetTemperature = Number(parseFloat(activeZone.interval.temperature + settings.temperature.threshold).toFixed(2));
//         // if (activeZone.zone.sensor.temperature.value > maxTargetTemperature) activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
//         // if (activeZone.zone.sensor.temperature.value < minTargetTemperature) activeZone.zone.relays.forEach(relay => { if (tOff.indexOf(relay) === -1) tOff.push(relay) });

//         // var targetTemperature = activeZone.interval.temperature - settings.temperature.threshold;
//         console.info(`Cool Mode set for : ${activeZone.id}-${activeZone.zone.name} between: ${minTargetTemperature} and ${maxTargetTemperature} current temperature: ${activeZone.zone.sensor.temperature.value}`);
//         // if (activeZone.zone.sensor.temperature.value < targetTemperature) activeZone.zone.relays.forEach(relay => { if (tOff.indexOf(relay) === -1) tOff.push(relay); })
//         // else activeZone.zone.relays.forEach(relay => { if (tOn.indexOf(relay) === -1) tOn.push(relay); });
//     }
// });
// // tOff.filter(r => tOn.indexOf(r) < 0).forEach(t => t.turnOff());//.filter(r => r.isOn)
// tOn.forEach(t => t.turnOn(10 * 60)); //.filter(r => !r.isOn)
// console.info(`Stop processing temperature`);


// function temperatureDiff(targetTemperature, currentTemperature){
//     return Number.parseFloat(Number.parseFloat(targetTemperature).toFixed(2) - Number.parseFloat(currentTemperature).toFixed(2)  ).toFixed(2);
// }

//#endregion

//#region Processing temperature constants
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
//#endregion

//#region Database functions as promises

dbFindOne = (database, query) =>
    new Promise((resolve, reject) =>
        database.findOne(query, (error, document) => {
            if (error) {
                reject(err)
            } else {
                resolve(document)
            }
        })
    )

dbFind = (database, query) =>
    new Promise((resolve, reject) =>
        database.find(query, (error, documents) => {
            if (error) {
                reject(error)
            } else {
                resolve(documents)
            }
        })
    );
dbUpdate = (database, query, value, options) =>
    new Promise((resolve, reject) =>
        database.update(query, { $set: value }, options, (error, numReplaced) => {
            if (error) {
                reject(error)
            } else {
                resolve(numReplaced)
            }
        }));
dbDelete = (database, query, options) => new Promise((resolve, reject) =>
    database.remove(query, options, (error, numRemoved) => {
        if (error) {
            reject(error)
        } else {
            resolve(numRemoved)
        }
    }));
dbInsert = (database, value) => new Promise((resolve, reject) => database.insert(value, (error, inserted) => error ? reject(error) : resolve(inserted)));

//#endregion
