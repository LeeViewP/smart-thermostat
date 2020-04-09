import { thRoomsName, thRoomsComponent } from './th-rooms.component.js';
import { thRoomsRoutesConfig } from "./route.js";

const internalDependencies = [];
export const thRoomsModule = angular.module('th-app.rooms', [...internalDependencies])
	.config(thRoomsRoutesConfig)
	.component(thRoomsName, thRoomsComponent)
.name;