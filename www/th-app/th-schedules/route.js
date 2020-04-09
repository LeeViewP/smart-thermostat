export const thSchedulesRoutesConfig = ['$stateProvider', function ($stateProvider) {
	$stateProvider.state({
		name: 'app.schedules',
		url: '/schedules',
		component: 'thSchedules',
		data: {
			name: 'Schedules',
			icon: 'scheduled',
			menuPosition: 201
		}
	});
}];