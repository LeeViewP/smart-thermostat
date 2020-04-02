const Relay = require("./relay");
class Shelly1 extends Relay {
    constructor(id, ip) {
        super(id, ip, 1);
    }

    turnOn() {
        var index = 0;
        super.turnOn(index);
        var queryParams = '?turn=on';
        var url = this.url + `/relay/${index}/${queryParams}`;
        this.callUri(url);
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
        var response = this.callUri(url);
        if (response !== undefined) {
            var info = JSON.parse(response);
            if (info.relays) {
                if (info.relays.length > 0) {
                    for (var i = 0; i++; i < info.relays.length) {
                        this._channels[i] === { ...info.relays[i] };
                    }
                }
            }
        }

    }
    get isOn() { return this.channels[0].ison };
};

module.exports = Shelly1;