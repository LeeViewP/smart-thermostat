export const thRoomsRoutesConfig = ['$stateProvider', function ($stateProvider) {
	$stateProvider.state({
		name: 'app.rooms',
		url: '/rooms',
		component: 'thRooms',
		data: {
			name: 'Rooms',
			icon: 'rooms',
			menuPosition: 200
		}
	});
}];