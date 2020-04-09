export const thRoomsRoutesConfig = ['$stateProvider', function ($stateProvider) {
	$stateProvider.state({
		name: 'app.rooms',
		url: '/rooms',
		component: 'thRooms',
		data: {
			name: 'Rooms',
			icon: 'rooms',
			menuPosition: 300
		},
		bindings: {
			activeRooms: 'activeRooms'
		},
		resolve: {
			activeRooms: ['$http', ($http) => $http.get('/zones').then(r =>r.data)],
			// settingsThermostat: ['$http', ($http) => $http.get('settings/thermostat').then(result => result.data)]
		}
	});
	$stateProvider.state({
		name: 'app.rooms.room',
		url: '/room/:roomid',
		controllerAs:"$ctrl",
		controller: ["$state", function ($state) {
			const $ctrl = this; 
			$ctrl.state = $state; 
			console.log($ctrl.state.params); 
			Object.defineProperties($ctrl, {
				roomId: { get: () => $ctrl.state.params.roomid },
				room:{get: () => $ctrl.state.params.room }
			});
		}],
		// component: 'thRoom',
		template: `<md-content >
		<h1 style="color:red;">I am the bloody ROOM State TEMPLATE! Piss off! {{$ctrl.roomId}}</h1>
		<pre>{{$ctrl.room}}</pre>
		<md-button ui-sref='^'>take me back to the hell</md-button>
	</md-content> `,
		params: { roomid: undefined, room:undefined },

		data: {
			name: 'Room',
			icon: 'rooms',
			menuPosition: 200
		}
	});
}];