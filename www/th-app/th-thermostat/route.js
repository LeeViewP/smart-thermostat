export const thThermostatRoutesConfig = ['$stateProvider', function ($stateProvider) {
	$stateProvider.state({
		name: 'app.Thermostat',
		url: '/thermostat',
		component: 'thThermostat',
		data: {
			name: 'Thermostat',
			icon: 'thermostat',
			menuPosition: 110
		},
		bindings: {
			thermostat: 'thermostat',
			// settingsModes:'settingsModes'
		},
		resolve: {
			thermostat: ['$http', ($http) => $http.get('/thermostat').then(t => t.data)],
			settingsModes: ['$http', ($http) => $http.get('/settings/modes').then(r =>r.data)],
			schedules: ['$http', ($http) => $http.get('/schedules').then(r =>r.data)],
			rooms: ['$http', ($http) => $http.get('/zones').then(r => r.data)],
		}
	});
}];