class ThScheduleController {
	static $inject = ['$http', '$mdDialog', '$state'];


	constructor($http, $mdDialog, $state) {
		this.$http = $http,
			this.$mdDialog = $mdDialog,
			this.$state = $state

	}
	$onInit() {

		this.id = this.scheduleData.id;
		this.schedules = this.scheduleData.schedule;		
	}
	delete = function (ev) {
		const dialog = this.$mdDialog.confirm()
			.title('Do you want to delete the schedule?')
			.textContent('All of the banks have agreed to forgive you your debts.')
			.targetEvent(ev)
			.ok('Delete')
			.cancel('Cancel');
		const http = this.$http;
		const id=this.id;
		const $state= this.$state;
		this.$mdDialog
			.show(dialog)
			.then(function (result) {
				http.delete(`schedules/${id}`).then(() => {
					//THIS WILL TRIGGER A FACE RELOAD
					$state.reload();
				}).catch(error=>console.log(error))

			});
	}
	getDayOfWeek=function (day){
		var date = new Date();
		var currentDayOfWeek = date.getDay();
		var neededDayOfWeek = +day;

		date.setDate(date.getDate() - currentDayOfWeek + neededDayOfWeek);
		return date.toLocaleDateString('en-US', { weekday: 'long' });   
	}
}


export const thScheduleName = 'thSchedule';
export const thScheduleComponent = {
	templateUrl: 'th-app/th-schedules/th-schedule/th-schedule.component.html',
	controller: ThScheduleController,
	bindings: {
		scheduleData: '<schedule'
	}
};