const request = require('request');
module.exports = class Relay {
    constructor(id, ip, channelsNo) {
        this._id = id;
        this._ip = ip;
        this._url = `http://${ip}`;
        this._channels = [];
        for (var i = 0; i < channelsNo; i++) {
            var channel = {};
            this._channels.push(channel)
        }
    }

    getStatus() {
        console.log(`Get status for relay with id:${this._id} using url:"${this._url}".`);
    }

    turnOn(index) {
        console.log(`Turning on relay id:${this._id} channel:${index} using url:"${this._url}".`);
    }

    turnOff(index) {
        console.log(`Turning off relay id:${this._id} channel:${index} using url:"${this._url}".`);
    }

    callUri(uri) {
        request(uri, { json: true }, (err, res, body) => {
            if (err) { return console.log(`Error calling relay id:${this._id} url:" ${uri}".`) }
            if (res.statusCode === 200) {
                console.log(`Successfull called relay id:${this._id} url:" ${uri}".`);
                return body;
            }
        });
    }

    get id() { return this._id; }
    get ip() { return this._ip; }
    get channels() { return this._channels; }
    get url() { return this._url; }
}
