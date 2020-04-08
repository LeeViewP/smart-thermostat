import {thModesComponentName, thModesComponent} from './th-modes.component.js';

export const thModesModule = angular
.module('th-app.zones.modes', [])
.component(thModesComponentName, thModesComponent)
.name;