class ThSidenavComponentController {
	static $inject = ['$state', '$mdSidenav'];
	constructor($state, $mdSidenav) {
		this.$state = $state;
		this.$mdSidenav = $mdSidenav;
		this.menuItems = this.$state.get()
							.filter(state => state.name.split('.').length === 2)
							.map(this.createMenuItem)
							.filter(menuItem => menuItem !== undefined)
							.sort((menuItemA, menuItemB) => menuItemA.position - menuItemB.position);
	}
	get navId() { return 'th-sidenav-id'; }
	$onInit() {
		
	}
	createMenuItem(state, defaultPosition) {
		if(!state) return undefined;
		else return {
			state: state.name,
			name: state.data?.name || state.name.toUpperCase(),
			icon: state.data?.icon,
			position: state.data?.menuPosition || defaultPosition
		}
	}
	close() {
		this.$mdSidenav(this.navId).close();
	}
}
export const thSidenavComponentName = "thSidenav";
export const thSidenavComponent = {
	templateUrl: 'th-app/th-sidenav/th-sidenav.component.html',
	controller: ThSidenavComponentController
}