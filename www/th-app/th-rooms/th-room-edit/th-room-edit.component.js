class ThRoomEditController {
    static $inject = ['$http', '$state'];


    constructor($http, $state) {
        // const $ctrl = this;
        this.$http = $http,
            this.$state = $state
        console.log(this.$state.params);
        Object.defineProperties(this, {
            // roomId: { get: () => this.$state.params.roomid },
            room: { get: () => this.$state.params.room, set: (value) => this.$state.params.room = value },
        });
    }
    $onInit() {
        this.sensors = this.sensorsData.map(sensor => ({ ...sensor, isThere: this.room.sensors.find(rs => rs._id === sensor._id) ? true : false }));
        this.relays = this.relaysData.map(relay => ({ ...relay, isThere: this.room.relays.find(rr => rr._id === relay._id) ? true : false }));
    }
    save() {
        this.room.sensors = this.sensors.filter(s => s.isThere).map(sensor => ({ _id: sensor._id }))
        this.room.relays = this.relays.filter(r => r.isThere).map(relay => ({ _id: relay._id }))
        console.log(`SAVED!!!!!! ${JSON.stringify(this.room)}`);
        this.$http.post('zones', this.room).then(() => this.$state.reload());
    }
    back() {
        this.$http.get(`zones/${this.room._id}`).then(r => { this.room = r.data; this.$state.reload(); })
    }
}

export const thRoomEditName = 'thRoomEdit';
export const thRoomEditComponent = {
    templateUrl: 'th-app/th-rooms/th-room-edit/th-room-edit.component.html',
    controller: ThRoomEditController,
    bindings: {
        sensorsData: '<',
        relaysData: '<',
    }
};