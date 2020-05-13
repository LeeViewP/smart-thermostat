export const thSwitchesRoutesConfig = ['$stateProvider', function ($stateProvider) {
	$stateProvider.state({
		name: 'app.switches',
		url: '/switches',
		component: 'thSwitches',
		data: {
			name: 'Switches',
			icon: 'switch',
			menuPosition: 300,
			buttons:[
				{
					name:"Add",
					// sref:"app.switches.switch({switchid:'new', switch: {name:'', _ip:''}})" 
				}
			]
		},
		bindings: {
			relays: 'relays'
		},
		resolve: {
			relays: ['$http', ($http) => $http.get('/relays').then(r =>r.data)],
			// settingsThermostat: ['$http', ($http) => $http.get('settings/thermostat').then(result => result.data)]
		}
	});
}];