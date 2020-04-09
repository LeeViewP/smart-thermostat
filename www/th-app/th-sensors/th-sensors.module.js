import { thSensorsName, thSensorsComponent } from './th-sensors.component.js';
import { thSensorsRoutesConfig } from "./route.js";
import { thSensorModule } from './th-sensor/th-sensor.module.js';

const internalDependencies = [
	thSensorModule
];
export const thSensorsModule = angular.module('th-app.sensors', [...internalDependencies])
	.config(thSensorsRoutesConfig)
	.component(thSensorsName, thSensorsComponent)
.name;