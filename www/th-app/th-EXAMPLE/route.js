export const thExampleRoutesConfig = ['$stateProvider', function ($stateProvider) {
	$stateProvider.state({
		name: 'app.example',
		url: '/example',
		component: 'thExample',
		data: {
			name: 'Some Name You Want to Provide', //optional, defaults to state name app.example
			// icon: 'switch', //optional
			// menuPosition: 300 //optional
		}
	});
}];