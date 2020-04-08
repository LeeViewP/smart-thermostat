import {thSidenavComponentName, thSidenavComponent} from './th-sidenav.component.js';

const internalDependencies = [];

export const thSidenavModule = angular
.module('th-app.sidenav', [...internalDependencies])
.component(thSidenavComponentName, thSidenavComponent)
.name;