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

function getActiveZonesNow() {
    var date = new Date();
    const currentTime = date.getHours() * 60 + date.getMinutes();

    return settings.thermostat.zonecontrol.filter(z => z.mode === settings.thermostat.mode && z.isenabled === true).map(activeZone => {
        var activeSchedule = schedules.find(s => s.id === activeZone.schedule).schedule;
        var intervals = activeSchedule[date.getDay()].map((interval, index, array) => ({ from: interval.start, to: ((array[index + 1] && array[index + 1].start) || 1440) - 1, interval: interval }));
        const { interval } = intervals.find(interval => currentTime >= interval.from && currentTime <= interval.to);
        return ({
            zone: zones.map(convertZoneFactory(activeZone.offset)).find(z => z.id === activeZone.zoneid),
            mode: activeZone.mode,
            interval: interval,
            temperature: activeZone.temperature || settings.temperature
        })
    });
}
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