import {thThermostatModesComponentName, thThermostatModesComponent} from './th-thermostat-modes.component.js';

export const thThermostatModesModule = angular
.module('th-app.thermostat.modes', [])
.component(thThermostatModesComponentName, thThermostatModesComponent)
.name;