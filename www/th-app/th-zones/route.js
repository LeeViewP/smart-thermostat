export const thZonesRoutesConfig = ['$stateProvider', function ($stateProvider) {
	$stateProvider.state({
		name: 'app.zones',
		url: '/zones',
		component: 'thZones',
		data: {
			name: 'Dashboard',
			icon: 'dashboard',
			menuPosition: 100
		},
		bindings: {
			activeZones: 'activeZones'
		},
		resolve: {
			activeZones: ['$http', ($http) => $http.get('/status').then(r =>r.data)],
			thermostat: ['$http', ($http) => $http.get('/thermostat').then(result => result.data)],
			settingsModes: ['$http', ($http) => $http.get('/settings/modes').then(r =>r.data)],
		}
	});
}];