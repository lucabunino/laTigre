let colors = $state(null);
let index = $state(0);

export function getColors() {
	
	function setColors(c) {
		colors = c
	}
	function increaseIndex() {
		index++
	}

	return {
		get colors() {
			return colors;
		},
		setColors,
		get index() {
			return index;
		},
		increaseIndex,
	};
}