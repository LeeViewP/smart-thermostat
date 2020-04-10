import { thSwitchesName, thSwitchesComponent } from './th-switches.component.js';
import { thSwitchesRoutesConfig } from "./route.js";

const internalDependencies = [];
export const thSwitchesModule = angular.module('th-app.switches', [...internalDependencies])
	.config(thSwitchesRoutesConfig)
	.component(thSwitchesName, thSwitchesComponent)
.name;