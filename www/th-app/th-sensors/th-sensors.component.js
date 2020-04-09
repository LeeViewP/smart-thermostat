class ThSensorsComponentController {}
export const thSensorsName = 'thSensors';
export const thSensorsComponent = {
	templateUrl: 'th-app/th-sensors/th-sensors.component.html',
	controller: ThSensorsComponentController,
	bindings:{
		activeSensors:'<'
	}
};