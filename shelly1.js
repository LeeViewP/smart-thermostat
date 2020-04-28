const Relay = require("./relay");
const request = require('request-promise-native');
class Shelly1 extends Relay {
    constructor(id, ip) {
        super(id, ip, 1);
        // this.getStatus();
    }

    turnOn(delay) {
        var index = 0;
        super.turnOn(index);
        var queryParams = '?turn=on';
        if (delay && !isNaN(delay))
            queryParams = `${queryParams}&timer=${delay}`
        var url = this.url + `/relay/${index}/${queryParams}`;
        super.callUri(url);
        // this.getStatus();
    }
    turnOff() {
        var index = 0;
        super.turnOff(index);
        var queryParams = '?turn=off';
        var url = this.url + `/relay/${index}/${queryParams}`;
        this.callUri(url);
        // this.getStatus();
    }
    async getStatus() {
        super.getStatus();
        var url = this.url + "/status/";
        let re = await this.callUri(url);//.then(response=> this._status = response);

        await request({ uri: url, json: true })
            .then(response => {
                // console.info(`response for relay id:${this._id} url:" ${url}" ${JSON.stringify(response)} `);
                this.channels[0] = { ison : response.relays[0].ison };
                this._status = response
                console.info(`chanels for relay id:${this._id} url:" ${url}" ${JSON.stringify(this.channels)} `);
            })
            .catch(err => console.error(`Error calling relay id:${this._id} url:" ${url}" ${err}.`));

        // await  Promise.resolve(this.callUri(url)).then
        // (result=> 
        //     this._status = result );
        // let result = await promise; 
        // let promise = new Promise((res, rej) => {
        //     res(super.callUri(url));
        // });
        // let result = await promise;
        // this._status = await promise;
        // this._status = super.callUri(url);

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
    get isOn() {
        // await this.getStatus();
        return this.channels[0].ison
    };
};

module.exports = Shelly1;