import { thToolbarName, thToolbarComponent } from "./th-toolbar.component.js";
const internalDependencies = [];


export const thToolbarModule = angular
.module('th-app.toolbar', [...internalDependencies])
.component(thToolbarName, thToolbarComponent)
.name;