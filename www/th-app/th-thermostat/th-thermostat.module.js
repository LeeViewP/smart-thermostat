import { thThermostatName, thThermostatComponent } from './th-thermostat.component.js';
import { thThermostatRoutesConfig } from "./route.js";
import { thThermostatModesModule } from './th-modes/th-thermostat-modes.module.js';
import { thControlZoneModule } from './th-control-zone/th-control-zone.module.js';

const internalDependencies = [thThermostatModesModule,thControlZoneModule];
export const thThermostatModule = angular.module('th-app.thermostat', [...internalDependencies])
	.config(thThermostatRoutesConfig)
	.component(thThermostatName, thThermostatComponent)
	.name;