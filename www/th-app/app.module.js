'use strict';

import { iconsConfig } from './icons.js';
import { routesConfig } from "./route.js";

import { thToolbarModule } from './th-toolbar/th-toolbar.module.js';
import { thZonesModule } from './th-zones/th-zones.module.js';
import { commonModule } from './common/common.module.js';
import { thSidenavModule } from './th-sidenav/th-sidenav.module.js';
import { thRoomsModule } from './th-rooms/th-rooms.module.js';
import { thSwitchModule } from './th-switch/th-switch.module.js';
import { thExampleModule } from './th-example/th-example.module.js';

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
	thSwitchModule
	,thExampleModule
];

angular
	.module('th-app', [...externalDependencies, ...internalDependencies ])
		.config(routesConfig)
		.config(iconsConfig);

