import { thSchedulesName, thSchedulesComponent } from './th-schedules.component.js';
import { thSchedulesRoutesConfig } from "./route.js";
import { thScheduleModule } from './th-schedule/th-schedule.module.js';

const internalDependencies = [thScheduleModule];
export const thSchedulesModule = angular.module('th-app.schedules', [...internalDependencies])
	.config(thSchedulesRoutesConfig)
	.component(thSchedulesName, thSchedulesComponent)
.name;