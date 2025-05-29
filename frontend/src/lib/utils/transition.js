// Easing
import { quadInOut } from 'svelte/easing'

export function modalInOut(node, { delay, duration }) {
  return {
    delay,
    duration,
    css: (t) => {
      const eased = quadInOut(t);
      return `
	  	-webkit-transform: translateY(${(1 - eased) * 100}vh);
		-ms-transform: translateY(${(1 - eased) * 100}vh);
        	transform: translateX(${(1 - eased) * 100}vh);
      `;
    }
  };
}

export function singleIn(node, { delay, duration }) {
  return {
    delay,
    duration,
    css: (t) => {
      const eased = quadInOut(t);
      return `
	  	-webkit-transform: translateY(${(1 - eased) * 100}vh);
		-ms-transform: translateY(${(1 - eased) * 100}vh);
        	transform: translateY(${(1 - eased) * 100}vh);
      `;
    }
  };
}
export function singleOut(node, { delay, duration }) {
  return {
    delay,
    duration,
    css: (t) => {
      const eased = quadInOut(t);
      return `
		-webkit-transform: translateY(-${(1 - eased) * 100}vh);
		-ms-transform: translateY(-${(1 - eased) * 100}vh);
			transform: translateY(-${(1 - eased) * 100}vh);
      `;
    }
  };
}

export function headerInOut(node, { delay, duration }) {
  return {
    delay,
    duration,
    css: (t) => {
      const eased = quadInOut(t);
      return `
        opacity: ${(eased)};
      `;
    }
  };
}

export function backgroundInOut(node, { delay, duration }) {
  return {
    delay,
    duration,
    css: (t) => {
      const eased = quadInOut(t);
      return `
        opacity: ${(eased)};
      `;
    }
  };
}

export function listInOut(node, { delay, duration }) {
  return {
    delay,
    duration,
    css: (t) => {
      const eased = quadInOut(t);
      return `
        opacity: ${(eased)};
      `;
    }
  };
}