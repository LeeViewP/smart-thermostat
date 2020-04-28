export const thRoomsRoutesConfig = ['$stateProvider', function ($stateProvider) {
	$stateProvider.state({
		name: 'app.rooms',
		url: '/rooms',
		component: 'thRooms',
		data: {
			name: 'Rooms',
			icon: 'rooms',
			menuPosition: 300,
			buttons:[
				{
					name:"Add",
					sref:"app.rooms.room({roomid:'new', room: {name:'', sensors:[], relays:[]}})" 
				}
			]
		},
		bindings: {
			activeRooms: 'activeRooms'
		},
		resolve: {
			activeRooms: ['$http', ($http) => $http.get('/zones').then(r => r.data)],
			// settingsThermostat: ['$http', ($http) => $http.get('settings/thermostat').then(result => result.data)]
		}
	});
	$stateProvider.state({
		name: 'app.rooms.room',
		url: '/room/:roomid',
		// controllerAs: "$ctrl",
		// controller: ["$state", function ($state) {
		// 	const $ctrl = this;
		// 	$ctrl.state = $state;
		// 	console.log($ctrl.state.params);
		// 	Object.defineProperties($ctrl, {
		// 		roomId: { get: () => $ctrl.state.params.roomid },
		// 		room: { get: () => $ctrl.state.params.room },
		// 		sensors: { get: () => $ctrl.state.params.sensors }
		// 	});
		// }],
		// component: 'thRoom',
		// 	template: `<md-content >
		// 	<h1 style="color:red;">I am the bloody ROOM State TEMPLATE! Piss off! {{$ctrl.roomId}}</h1>
		// 	<pre>{{$ctrl.room}}</pre>
		// 	<md-button ui-sref='^'>take me back to the hell</md-button>
		// </md-content> `,
		component: 'thRoomEdit',
		// templateUrl: 'th-app/th-rooms/th-room-edit/th-room-edit.component.html',
		params: { roomid: undefined, room: undefined },
		data: {
			name: 'Room',
			icon: 'rooms',
			buttons:undefined,
			// buttons:[
			// 	{
			// 		name:"Save",
			// 		// sref:"^" ,
			// 		click:"$ctrl.save()"
			// 	}
			// ],
			menuPosition: 200
		}
		,
		bindings: {
			sensorsData: 'sensorsData',
			relaysData: 'relaysData',
		},
		resolve: {
			sensorsData: ['$http', ($http) => $http.get('/sensors').then(r => r.data)],
			relaysData: ['$http', ($http) => $http.get('/relays').then(result => result.data)]
		}
	});
}];