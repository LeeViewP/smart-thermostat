export const thZonesRoutesConfig = ['$stateProvider', function ($stateProvider) {
	$stateProvider.state({
		name: 'app.zones',
		url: '/zones',
		component: 'thZones',
		data: {
			name: 'Dashboard',
			icon: 'thermostat',
			menuPosition: 100
		},
		bindings: {
			activeZones: 'activeZones'
		},
		resolve: {
			activeZones: ['$http', ($http) => $http.get('/status').then(r =>r.data)],
			settingsThermostat: ['$http', ($http) => $http.get('settings/thermostat').then(result => result.data)]
		}
	});
}];