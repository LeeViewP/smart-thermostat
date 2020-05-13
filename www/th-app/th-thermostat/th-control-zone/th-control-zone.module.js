import { thControlZoneName, thControlZoneComponent } from './th-control-zone.component.js';
const internalDependencies = [];
export const thControlZoneModule = angular.module('th-app.thermostat.controlzone', [...internalDependencies]).component(thControlZoneName, thControlZoneComponent).name;