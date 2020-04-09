export const thRoomsRoutesConfig = ['$stateProvider', function ($stateProvider) {
	$stateProvider.state({
		name: 'app.rooms',
		url: '/rooms',
		component: 'thRooms',
		data: {
			name: 'Rooms',
			icon: 'rooms',
			menuPosition: 300
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
				roomId: { get: () => $ctrl.state.params.roomid }
			});
		}],
		// component: 'thRoom',
		template: `<md-content >
		<h1 style="color:red;">I am the bloody ROOM State TEMPLATE! Piss off! {{$ctrl.roomId}}</h1>
		<md-button ui-sref='^'>take me back to the hell</md-button>
	</md-content> `,
		params: { roomid: undefined },
		data: {
			name: 'Room',
			icon: 'rooms',
			menuPosition: 200
		}
	});
}];