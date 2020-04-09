import { thSchedulesName, thSchedulesComponent } from './th-schedules.component.js';
import { thSchedulesRoutesConfig } from "./route.js";

const internalDependencies = [];
export const thSchedulesModule = angular.module('th-app.schedules', [...internalDependencies])
	.config(thSchedulesRoutesConfig)
	.component(thSchedulesName, thSchedulesComponent)
.name;