export const routesConfig = [
	'$stateProvider', 
	'$urlRouterProvider','$locationProvider',
	function ($stateProvider, $urlRouterProvider,$locationProvider) {
		// $locationProvider.html5Mode({
		// 	enabled: true,
		// 	requireBase: false
		//   });
		// $locationProvider.hashPrefix('');
		$urlRouterProvider.when('', '/app');
		$stateProvider.state({
			astract: true,
			name: 'app',
			url: '/app',
			redirectTo: 'app.zones',
			templateUrl: `th-app/app.html`
		});
}];