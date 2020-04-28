class ThToolbarController {
	static $inject = ['$state', '$mdSidenav'];
	constructor($state, $mdSidenav) {
		this.$state = $state;
		this.$mdSidenav = $mdSidenav;
	}
	get Name() {
		return this.$state.current.data?.name || this.$state.current.name.toUpperCase();
	}
	get icon() {
		return this.$state.current.data?.icon || undefined;
	}
	openMenu() {
		this.$mdSidenav('th-sidenav-id').toggle();
	}
	get buttons() { 
		return this.$state.current.data?.buttons || undefined; 
	}
};

export const thToolbarName = 'thToolbar';
export const thToolbarComponent = {
	controller: ThToolbarController,
	templateUrl: 'th-app/th-toolbar/th-toolbar.component.html'
};