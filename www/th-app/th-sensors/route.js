export const thSensorsRoutesConfig = ['$stateProvider', function ($stateProvider) {
	$stateProvider.state({
		name: 'app.sensors',
		url: '//sensors',
		component: 'thSensors',
		data: {
			name: 'Sensors', //optional, defaults to state name app.example
			 icon: 'thermometer', //optional
			 menuPosition: 200 //optional
		},
		bindings: {
			activeSensors: 'activeSensors'
		},
		resolve: {
			activeSensors: ['$http', ($http) => $http.get('/sensors').then(r =>r.data)],
			// settingsThermostat: ['$http', ($http) => $http.get('settings/thermostat').then(result => result.data)]
		}
	});
}];