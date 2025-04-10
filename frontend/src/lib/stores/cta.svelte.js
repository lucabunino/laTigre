let cta = $state(null);

export function getCta() {
	
	function setCta(c) {
		cta = c
	}

	return {
		get cta() {
			return cta;
		},
		setCta,
	};
}