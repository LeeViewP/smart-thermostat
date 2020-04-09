class ThSensorController {
	static $inject = ['$http', '$mdDialog', '$state'];
	

	constructor($http, $mdDialog, $state) {
		this.$http = $http, 
		this.$mdDialog = $mdDialog, 
		this.$state = $state
		
	}
	$onInit() {
		
		this.sensor = this.sensorData;
		this.lastUpdated = new Date(this.sensor.updated);
		console.info(this.sensor);
	}
}


export const thSensorName = 'thSensor';
export const thSensorComponent = {
	templateUrl: 'th-app/th-sensors/th-sensor/th-sensor.component.html',
	controller: ThSensorController,
	bindings: {
		sensorData: '<sensor'
	}
};