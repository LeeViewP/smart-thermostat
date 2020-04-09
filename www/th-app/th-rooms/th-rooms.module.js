import { thRoomsName, thRoomsComponent } from './th-rooms.component.js';
import { thRoomsRoutesConfig } from "./route.js";
import { thRoomModule } from './th-room/th-room.module.js';

const internalDependencies = [thRoomModule];
export const thRoomsModule = angular.module('th-app.rooms', [...internalDependencies])
	.config(thRoomsRoutesConfig)
	.component(thRoomsName, thRoomsComponent)
.name;