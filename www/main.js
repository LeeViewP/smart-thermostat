

'use strict';
import './th-app/app.module.js';

// (function () {
// 	return;
// 	var app = angular.module('ThermostatApp', ['ngMaterial', 'ngMessages', 'ui.router']);
	

// 	app.filter('thMinutesToHumanisedString', [function () {
// 		return function (min) {
// 			if (!angular.isNumber(min) || min > 24 * 60) return min;
// 			let hh = Math.floor(min / 60);
// 			let mm = min % 60;
// 			const hours = hh < 10 ? + hh : hh;
// 			const minutes = mm < 10 ? '0' + mm : mm;
// 			return hours + ':' + minutes;
// 		}
// 	}])

// 	thZoneController.$inject = ['$http', '$mdDialog', '$state'];
// 	function thZoneController($http, $mdDialog, $state) {
// 		const $ctrl = this;
// 		$ctrl.hasImage = false;
// 		$ctrl.$onInit = function () {
// 			$ctrl.zoneControlId = $ctrl.zoneData.id;
// 			$ctrl.zone = $ctrl.zoneData.zone;
// 			$ctrl.sensor = $ctrl.zone && $ctrl.zone.sensor;
// 			$ctrl.mode = $ctrl.zoneData.mode;
// 			$ctrl.schedule = $ctrl.zoneData.interval;
// 			$ctrl.temperature = $ctrl.zoneData.temperature
// 			$ctrl.zoneImageUrl = undefined;

// 			const customImageUrl = $ctrl.zone && $ctrl.zone.id ? '/img/zones/' + $ctrl.zone.id + '.jpg' : undefined;
// 			if (customImageUrl) $http.get(customImageUrl).then(response => {
// 				if (response.status === 200) $ctrl.zoneImageUrl = customImageUrl;
// 			}, angular.noop).finally(function () {
// 				if ($ctrl.zoneImageUrl === undefined) $ctrl.zoneImageUrl = '/img/zones/$$default.jpg';
// 			});
// 			$ctrl.sensorShouldBeActive = function () {
// 				return $ctrl.mode === 0 ?
// 					($ctrl.sensor.temperature.value < $ctrl.schedule.temperature - $ctrl.temperature.threshold) :
// 					($ctrl.sensor.temperature.value > $ctrl.schedule.temperature + $ctrl.temperature.threshold);
// 			};
// 		};
// 		$ctrl.manualMode = true;
// 		$ctrl.modeIcon = ['heat', 'cool'];
// 		$ctrl.modeStatusIcon = ['radiator', 'ac'];
// 		$ctrl.changeTemperature = function (increment) {
// 			if (!angular.isNumber(increment)) return;
// 			var newTemp =  $ctrl.schedule.temperature+increment;
// 			$ctrl.schedule.temperature =Number(parseFloat(newTemp).toFixed(2));
// 			var postData = {
// 				id: $ctrl.zoneControlId,
// 				zoneId: $ctrl.zone.id,
// 				temperatureOverride: $ctrl.schedule.temperature
// 			}
// 			$http.post('manual', postData).then(() => {
// 				//THIS WILL TRIGGER A FACE RELOAD
// 				$state.reload();
// 			})
// 		}
// 		$ctrl.setManualTemperature = function (ev) {
// 			if (!$ctrl.ENABLE_MANUAL_MODE_FEATURE_TOGGLE) return;
// 			const dialog = $mdDialog.prompt()
// 				.title('What would you name your dog?')
// 				.placeholder('C')
// 				.ariaLabel('Dog name')
// 				.initialValue($ctrl.schedule.temperature)
// 				.targetEvent(ev)
// 				.required(true)
// 				.ok('Set')
// 				.cancel('Cancel');
// 			$mdDialog.show(dialog).then(function (result) {
// 				const newTemp = +result;
// 				if (newTemp === $ctrl.schedule.temperature || !angular.isNumber(newTemp)) return;
// 				else {
// 					var postData = {
// 						id: $ctrl.zoneControlId,
// 						zoneId: $ctrl.zone.id,
// 						temperatureOverride: newTemp
// 					}
// 					$ctrl.schedule.temperature = newTemp;
// 					// console.log($ctrl.zoneData);
// 					$http.post('manual', postData).then(() => this.$state.reload());
// 				}
// 			});
// 		};
// 		$ctrl.ENABLE_MANUAL_MODE_FEATURE_TOGGLE = false;
// 	};

// 	app.component('thZone', {
// 		template: `
// 		<md-card md-whiteframe="3">
// 			<md-card-title>	
// 				<md-card-title-text>
// 					<div class="md-headline" layout="row">
// 						<md-icon flex="10" class="md-primary" md-svg-icon="{{$ctrl.modeIcon[$ctrl.mode]}}"></md-icon> 
// 						<span flex md-truncate>{{::$ctrl.zone.name}}</span>
// 					</div>
// 					<div class="md-subhead" layout="row">
// 						<md-icon flex="10" 
// 								 md-svg-icon="scheduled"
// 								 class="md-hue-2" 
// 								 data-ng-class="{'md-primary': $ctrl.sensorShouldBeActive }"></md-icon> 
// 						<div flex="90">
// 							<span> {{::$ctrl.schedule.start | thMinutesToHumanisedString}} -  {{::$ctrl.schedule.end | thMinutesToHumanisedString}}</span>
// 						</div>
// 					</div>
// 				</md-card-title-text>
// 				<md-card-title-media flex-offset="5">
// 					<div class="md-media-md card-media" style="background: url(); background-size: cover">
// 						<img ng-src="{{::$ctrl.zoneImageUrl}}">
// 					</div>
// 				</md-card-title-media>
// 			</md-card-title>
// 			<md-card-content>
// 				<div class="md-display-1" layout="row">
// 					<div flex="10" layout="row">
// 						<md-icon md-svg-icon="thermometer" layut="row" class="md-primary s34"></md-icon>
// 					</div>
// 					<div flex="40"  layout="row">
// 						{{::$ctrl.sensor.temperature.value}}
// 						{{::$ctrl.sensor.temperature.unit}}
// 					</div>
// 					<div flex="40"  layout="row" layout-align="end center" class="md-title" data-ng-click="$ctrl.setManualTemperature($event)">
// 						{{$ctrl.schedule.temperature}} {{::$ctrl.temperature.unit}}
// 					</div>
// 					<div flex="10"  layout="row">
// 					<md-icon md-svg-icon="{{$ctrl.modeStatusIcon[$ctrl.mode]}}" 
// 							 class="md-hue-2 s20" 
// 							 data-ng-class="{'md-warn': $ctrl.sensorShouldBeActive() }"
// 							 data-ng-style="{'opacity': $ctrl.sensorShouldBeActive() ? 1 : 0.2}"></md-icon> 
// 					</div>
// 				</div>
// 			<md-card-content>
// 			<md-card-actions layout="row" layout-align="end center">
// 				<md-button class="md-whiteframe-3dp" data-ng-click="$ctrl.changeTemperature(0.1)">
// 					<md-icon md-svg-icon="up" layut="row"></md-icon>
// 				</md-button>
// 				<md-button class="md-whiteframe-3dp" data-ng-click="$ctrl.changeTemperature(-0.1)">
// 					<md-icon md-svg-icon="down" layut="row"></md-icon>
// 				</md-button>
// 		  </md-card-actions>
// 		</md-card>
// 		`,
// 		controller: thZoneController,
// 		bindings: {
// 			zoneData: '<zone'
// 		}
// 	});

// 	app.component('thZones', {
// 		template: `
// 		<md-content layout="column" layout-gt-xs="row" layout-padding>
// 		 	<th-settings-thermostat flex></th-settings>
// 		</md-content>
// 		<md-divider></md-divider>
// 		<md-content layout="column" layout-gt-xs="row" layout-padding>
// 			<th-zone flex data-ng-repeat="activeZone in $ctrl.activeZones track by activeZone.zone.id" data-zone="activeZone"></th-zone>
// 			<h2 class="md-flex" data-ng-if="$ctrl.activeZones.length<1">Thermostat is off</h2>
//       	</md-content>
// 		`,
// 		controller: ['$http', function ($http) {
// 			const $ctrl = this;
// 			$http.get('/status').then(result => {
// 				$ctrl.activeZones = result.data;
// 			});
// 		}]
// 	});

// 	function thSettingsThermostatController($http, $mdDialog, $state) {
// 		const $ctrl = this;
// 		$ctrl.$onInit = function () {
// 			$ctrl.changeMode = function () {
// 				if ($ctrl.mode.isOn) return;
// 				var thermostat = { ...$ctrl.thermostat, mode: $ctrl.mode.mode };
// 				// postData.mode = $ctrl.mode.mode;
// 				$http.post('settings', { thermostat }).then(() => {
// 					//THIS WILL TRIGGER A FACE RELOAD
// 					$state.reload();
// 				});
// 			};
// 		};
// 	}
// 	// <md-button class="md-fab" data-ng-class="{'md-primary': $ctrl.mode.isOn }" data-ng-disabled="!$ctrl.mode.isEnabled" aria-label="{{::$ctrl.mode.name}}" data-ng-click="$ctrl.changeMode()">
// 	// <md-icon md-svg-icon="{{$ctrl.mode.icon}}" layut="row"></md-icon>

// 	// </md-button>
// 	app.component('thThermostatMode', {
// 		template: `
// 		<md-button class="md-whiteframe-3dp" data-ng-disabled="!$ctrl.mode.isEnabled" data-ng-class="{'md-primary': $ctrl.mode.isOn }" data-ng-click="$ctrl.changeMode()">
// 		<md-icon md-svg-icon="{{$ctrl.mode.icon}}" layut="row"></md-icon>
// 		{{::$ctrl.mode.name}}
// 		</md-button> `,
// 		controller: thSettingsThermostatController,
// 		bindings: {
// 			mode: '=thermostatMode',
// 			thermostat: '<'
// 		}
// 	});

// 	app.component('thSettingsThermostat', {
// 		template: `<section layout="row" layout-sm="column" layout-align="center center" layout-wrap><th-thermostat-mode data-ng-repeat="thermostatMode in $ctrl.thermostatModes track by thermostatMode.mode" data-thermostat="$ctrl.thermostat" data-thermostat-mode="thermostatMode"></th-thermostat-mode></section>`,
// 		controller: ['$http', function ($http) {
// 			const $ctrl = this;
// 			$ctrl.thermostatModes = [
// 				{ mode: 0, name: "Heat", isEnabled: true, isOn: false, icon: "heat" },
// 				{ mode: 1, name: "Cool", isEnabled: true, isOn: false, icon: "cool" },
// 				{ mode: 2, name: "Auto", isEnabled: true, isOn: false, icon: "scheduled" },
// 				{ mode: -1, name: "Off", isEnabled: true, isOn: false, icon: "off" }
// 			];
// 			$http.get('/settings/thermostat').then(result => {
// 				$ctrl.thermostat = result.data;
// 				$ctrl.thermostatModes.find(mode => mode.mode === $ctrl.thermostat.mode).isOn = true;
// 			});
// 		}],
// 	})

// 	// app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
// 	// 	$urlRouterProvider.when('', '/app');
// 	// 	const rootState = {
// 	// 		name: 'root',
// 	// 		url: '/app',
// 	// 		views: {
// 	// 			'toolbar': 'thNav',
// 	// 			'content': 'thZones',
// 	// 		},
// 	// 	};
// 	// 	$stateProvider.state(rootState);
// 	// }]);

// 	// app.config(['$mdIconProvider', function ($mdIconProvider) {
// 	// 	$mdIconProvider.icon('cool', 'img/icons/snowflake.svg', 24);
// 	// 	$mdIconProvider.icon('heat', 'img/icons/fire.svg', 24);
// 	// 	$mdIconProvider.icon('thermometer', 'img/icons/thermometer.svg', 24);
// 	// 	$mdIconProvider.icon('radiator', 'img/icons/radiator.svg', 24);
// 	// 	$mdIconProvider.icon('ac', 'img/icons/air-conditioner.svg', 24);
// 	// 	$mdIconProvider.icon('scheduled', 'img/icons/clock-outline.svg', 24);
// 	// 	$mdIconProvider.icon('off', 'img/icons/power.svg', 24);
// 	// 	$mdIconProvider.icon('up', 'img/icons/menu-up.svg', 24);
// 	// 	$mdIconProvider.icon('down', 'img/icons/menu-down.svg', 24);
// 	// 	$mdIconProvider.icon('switch', 'img/icons/electric-switch.svg', 24);
// 	// 	$mdIconProvider.icon('rooms', 'img/icons/home-group.svg', 24);
// 	// 	$mdIconProvider.icon('thermostat', 'img/icons/thermostat.svg', 24);
// 	// }]);
// })()