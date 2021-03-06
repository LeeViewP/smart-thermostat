'use strict';

import { iconsConfig } from './icons.js';
import { routesConfig } from "./route.js";

import { thToolbarModule } from './th-toolbar/th-toolbar.module.js';
import { thZonesModule } from './th-zones/th-zones.module.js';
import { commonModule } from './common/common.module.js';
import { thSidenavModule } from './th-sidenav/th-sidenav.module.js';
import { thRoomsModule } from './th-rooms/th-rooms.module.js';
import { thSwitchesModule } from './th-switches/th-switches.module.js';
import { thSensorsModule } from './th-sensors/th-sensors.module.js';//
import { thSchedulesModule } from './th-schedules/th-schedules.module.js';
import { thThermostatModule } from './th-thermostat/th-thermostat.module.js';
// import { thExampleModule } from './th-example/th-example.module.js';

const externalDependencies = [
	'ngMaterial',
	'ngAnimate',
	'ngMessages',
	'ui.router',
];
const internalDependencies = [
	commonModule,
	thSidenavModule,
	thToolbarModule,
	thZonesModule,
	thRoomsModule,
	thSwitchesModule,
	thSensorsModule,
	thSchedulesModule,
	thThermostatModule
];

angular
	.module('th-app', [...externalDependencies, ...internalDependencies ])
		.config(routesConfig)
		.config(iconsConfig);

