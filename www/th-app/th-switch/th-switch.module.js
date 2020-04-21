import { thSwitchName, thSwitchComponent } from './th-switch.component.js';
import { thSwitchRoutesConfig } from "./route.js";

const internalDependencies = [];
export const thSwitchModule = angular.module('th-app.switch', [...internalDependencies])
	.config(thSwitchRoutesConfig)
	.component(thSwitchName, thSwitchComponent)
.name;