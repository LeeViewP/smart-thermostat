import { thSensorName, thSensorComponent } from './th-sensor.component.js';
const internalDependencies = [];
export const thSensorModule = angular.module('th-app.sensors.sensor', [...internalDependencies]).component(thSensorName, thSensorComponent).name;