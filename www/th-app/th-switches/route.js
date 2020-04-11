export const thSwitchesRoutesConfig = ['$stateProvider', function ($stateProvider) {
	$stateProvider.state({
		name: 'app.switches',
		url: '/switches',
		component: 'thSwitches',
		data: {
			name: 'Switches',
			icon: 'switch',
			menuPosition: 300
		}
	});
}];