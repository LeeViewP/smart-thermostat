import { thZoneName, thZoneComponent } from './th-zone.component.js';
const internalDependencies = [];
export const thZoneModule = angular.module('th-app.zones.zone', [...internalDependencies]).component(thZoneName, thZoneComponent).name;