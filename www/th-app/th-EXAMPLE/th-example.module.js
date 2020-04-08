import { thExampleComponentName, thExampleComponent } from './th-example.component.js';
import { thExampleRoutesConfig } from "./route.js";

const internalDependencies = [];
export const thExampleModule = angular.module('th-app.example', [...internalDependencies])
	.config(thExampleRoutesConfig)
	.component(thExampleComponentName, thExampleComponent)
.name;