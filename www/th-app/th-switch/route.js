export const thSwitchRoutesConfig = ['$stateProvider', function ($stateProvider) {
	$stateProvider.state({
		name: 'app.switch',
		url: '/switch',
		component: 'thSwitch',
		data: {
			name: 'Switch',
			icon: 'switch',
			menuPosition: 300
		}
	});
}];