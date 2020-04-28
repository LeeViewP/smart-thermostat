class ThRoomController {
	static $inject = ['$http', '$mdDialog', '$state'];
	

	constructor($http, $mdDialog, $state) {
		this.$http = $http, 
		this.$mdDialog = $mdDialog, 
		this.$state = $state
		
	}
	$onInit() {
		
		this.room = this.roomData;
		// console.info(this.room);
	}
	delete = function (ev) {
		const dialog = this.$mdDialog.confirm()
			.title('Do you want to delete the room?')
			.textContent('All of the banks have agreed to forgive you your debts.')
			.targetEvent(ev)
			.ok('Delete')
			.cancel('Cancel');
		const http = this.$http;
		const id=this.room._id;
		const $state= this.$state;
		this.$mdDialog
			.show(dialog)
			.then(function (result) {
				http.delete(`zones/${id}`).then(() => {
					//THIS WILL TRIGGER A FACE RELOAD
					$state.reload();
				}).catch(error=>console.log(error))

			});
	}
}


export const thRoomName = 'thRoom';
export const thRoomComponent = {
	templateUrl: 'th-app/th-rooms/th-room/th-room.component.html',
	controller: ThRoomController,
	bindings: {
		roomData: '<room'
	}
};