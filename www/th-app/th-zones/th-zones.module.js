import {thZonesName, thZonesComponent} from './th-zones.component.js';
import { thZonesRoutesConfig } from "./route.js";
import { thZoneModule } from './th-zone/th-zone.module.js';
import {thModesModule} from './th-modes/th-modes.module.js';

const internalDependencies = [
	thModesModule,
	thZoneModule
];
export const thZonesModule = angular.module('th-app.zones', [...internalDependencies])
	.config(thZonesRoutesConfig)
	.component(thZonesName, thZonesComponent)
.name;