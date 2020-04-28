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
	}
	delete = function (ev) {
		const dialog = this.$mdDialog.confirm()
			.title('Do you want to delete the sensor?')
			.textContent('All of the banks have agreed to forgive you your debts.')
			.targetEvent(ev)
			.ok('Delete')
			.cancel('Cancel');
		const http = this.$http;
		const id=this.sensor._id;
		const $state= this.$state;
		this.$mdDialog
			.show(dialog)
			.then(function (result) {
				http.delete(`sensors/${id}`).then(() => {
					//THIS WILL TRIGGER A FACE RELOAD
					$state.reload();
				}).catch(error=>console.log(error))

			});
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