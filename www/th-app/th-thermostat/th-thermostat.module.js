import { thThermostatName, thThermostatComponent } from './th-thermostat.component.js';
import { thThermostatRoutesConfig } from "./route.js";
import { thThermostatModesModule } from './th-modes/th-thermostat-modes.module.js';

const internalDependencies = [thThermostatModesModule];
export const thThermostatModule = angular.module('th-app.thermostat', [...internalDependencies])
	.config(thThermostatRoutesConfig)
	.component(thThermostatName, thThermostatComponent)
	.name;