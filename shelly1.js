const Relay = require("./relay");
class Shelly1 extends Relay {
    constructor(id, ip) {
        super(id, ip, 1);
    }

    turnOn(delay) {
        var index = 0;
        super.turnOn(index);
        var queryParams = '?turn=on';
        if (delay && !isNaN(delay))
            queryParams = `${queryParams}&timer=${delay}`
        var url = this.url + `/relay/${index}/${queryParams}`;
        super.callUri(url);
        this.getStatus();
    }
    turnOff() {
        var index = 0;
        super.turnOff(index);
        var queryParams = '?turn=off';
        var url = this.url + `/relay/${index}/${queryParams}`;
        this.callUri(url);
        this.getStatus();
    }
    getStatus() {
        super.getStatus();
        var url = this.url + "/status/";
        this._status = super.callUri(url);

        // Promise.resolve(this.callUri(url)).then(
        //     response => {
        //         if (response !== undefined) {
        //             var info = JSON.parse(response);
        //             if (info.relays) {
        //                 if (info.relays.length > 0) {
        //                     for (var i = 0; i++; i < info.relays.length) {
        //                         this._channels[i] === { ...info.relays[i] };
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // ).catch(error => console.log(`Get status for relay with id:${this._id} using url:"${url}" failed with ${error}.`))
        // var response = this.callUri(url);
        // if (response !== undefined) {
        //     var info = JSON.parse(response);
        //     if (info.relays) {
        //         if (info.relays.length > 0) {
        //             for (var i = 0; i++; i < info.relays.length) {
        //                 this._channels[i] === { ...info.relays[i] };
        //             }
        //         }
        //     }
        // }

    }
    get isOn() { this.getStatus(); return this.channels[0].ison };
};

module.exports = Shelly1;