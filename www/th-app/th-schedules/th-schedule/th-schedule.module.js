import { thScheduleName, thScheduleComponent } from './th-schedule.component.js';
const internalDependencies = [];
export const thScheduleModule = angular.module('th-app.schedules.schedule', [...internalDependencies]).component(thScheduleName, thScheduleComponent).name;