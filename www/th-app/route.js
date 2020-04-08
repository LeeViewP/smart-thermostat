export const routesConfig = [
	'$stateProvider', 
	'$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.when('', '/app');
		$stateProvider.state({
			astract: true,
			name: 'app',
			url: '/app',
			redirectTo: 'app.zones',
			templateUrl: `th-app/app.html`
		});
}];