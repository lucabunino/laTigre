let slide = $state(0);

export function getSlide() {
	
	function setSlide(s) {
		slide = s
	}

	return {
		get slide() {
			return slide;
		},
		setSlide,
	};
}