import { thRoomName, thRoomComponent } from './th-room.component.js';
const internalDependencies = [];
export const thRoomModule = angular.module('th-app.rooms.room', [...internalDependencies]).component(thRoomName, thRoomComponent).name;