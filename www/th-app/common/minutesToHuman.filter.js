export const thMinutesToHumanisedStringFilterName = 'thMinutesToHumanisedString';
export const thMinutesToHumanisedStringFilter =  [function () {
	return function (min) {
		if (!angular.isNumber(min) || min > 24 * 60) return min;
		let hh = Math.floor(min / 60);
		let mm = min % 60;
		const hours = hh < 10 ? + hh : hh;
		const minutes = mm < 10 ? '0' + mm : mm;
		return hours + ':' + minutes;
	}
}];