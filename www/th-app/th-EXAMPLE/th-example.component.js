class ThZonesComponentController {
	static $inject = ['$state']
	constructor($state) {
		this.$state = $state;
	}
	someFunctionality() {
		this.$state.go('app');
	}
}
export const thExampleComponentName = 'thExample';
export const thExampleComponent = {
	templateUrl: 'th-app/th-example/th-example.component.html',
	controller: ThZonesComponentController,
};