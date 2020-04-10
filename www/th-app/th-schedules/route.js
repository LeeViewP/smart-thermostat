export const thSchedulesRoutesConfig = ['$stateProvider', function ($stateProvider) {
	$stateProvider.state({
		name: 'app.schedules',
		url: '/schedules',
		component: 'thSchedules',
		data: {
			name: 'Schedules',
			icon: 'scheduled',
			menuPosition: 201
		},
		bindings: {
			activeSchedules: 'activeSchedules'
		},
		resolve: {
			activeSchedules: ['$http', ($http) => $http.get('/schedules').then(r =>r.data)],
			// settingsThermostat: ['$http', ($http) => $http.get('settings/thermostat').then(result => result.data)]
		}
	});
}];