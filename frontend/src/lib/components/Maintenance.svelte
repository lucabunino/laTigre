<script>
let { maintenance } = $props()
import { onMount } from "svelte";
let container = $state()
let svg = $state()
let paths = $state()
const NUM_PHOTOS = 300;

onMount(() => {
	for (let i = 1; i <= NUM_PHOTOS; i++) {
		const img = document.createElement("img");
		img.id = `foto${i}`;
		img.className = "foto";
		img.src = `maintenance/foto${i}.webp`;
		img.alt = `Foto ${i}`;
		img.style.width = `${10 + Math.random() * 10}px`;
		container.appendChild(img);

		const hoverCopy = img.cloneNode(true);
		hoverCopy.classList.add("hover-copy");
		container.appendChild(hoverCopy);
	}
	handleResize()
})
function positionImages() {
	if (!paths) return;
	const svgRect = svg.getBoundingClientRect();
	const viewBox = svg.viewBox.baseVal;
	const scaleX = svgRect.width / viewBox.width;
	const scaleY = svgRect.height / viewBox.height;

	const length = paths.getTotalLength?.() || 0;
	if (!length) return;

	for (let i = 0; i < NUM_PHOTOS; i++) {
		const position = (length / (NUM_PHOTOS - 1)) * i;
		const point = paths.getPointAtLength(position);

		const img = document.getElementById(`foto${i + 1}`);
		if (!img) continue;

		let x = point.x * scaleX + svgRect.left;
		let y = point.y * scaleY + svgRect.top;
		
		img.style.left = `${x}px`;
		img.style.top = `${y}px`;
		setTimeout(() => {
			img.style.opacity = "1";
		}, i * 10);
	}
}

function isMobileOrTablet() {
	return window.matchMedia("(max-width: 1024px)").matches;
}

let interval = null;

function startImageRotation() {
	const images = document.querySelectorAll(".mobile-images .foto-m");
	let currentIndex = 0;

	if (!images.length) return null;

	images[currentIndex].classList.add("active");
	return setInterval(() => {
		images.forEach((img) => img.classList.remove("active"));
		currentIndex = (currentIndex + 1) % images.length;
		images[currentIndex].classList.add("active");
	}, 500);
}

function handleResize() {
	const images = document.querySelectorAll(".mobile-images .foto-m");
	positionImages();
	if (isMobileOrTablet()) {
		if (!interval) interval = startImageRotation();
	} else {
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
		images.forEach((img) => img.classList.remove("active"));
	}
}
</script>

<svelte:window onresize={handleResize}/>
<div class="text">
	{#if maintenance.message}
		<p style="margin-bottom:1rem">{maintenance.message}</p>
	{/if}
	<p>For inquiries: <a href="mailto:info@latigre.net">info@latigre.net</a></p>
	<p>Instagram: <a href="https://instagram.com/latigremilano" target="_blank">@latigremilano</a></p>
</div>
<div bind:this={container} bind:this={container}>
	<svg bind:this={svg} width="3761" height="1304" viewBox="0 0 3761 1304" fill="none">
		<path bind:this={paths} d="M426.634 195.091C342.634 225.758 194.234 317.891 272.634 441.091C370.634 595.091 500.635 575.091 650.635 517.091C800.635 459.091 1042.63 259.091 1062.63 173.091C1082.63 87.091 1008.63 11.091 784.635 173.091C560.635 335.091 584.635 527.09 408.635 669.09C232.635 811.09 104.635 831.09 36.6349 797.09C-31.3651 763.09 -9.36505 689.09 166.635 729.09C342.635 769.09 584.633 865.09 716.633 759.09M1176.63 517.091C1176.63 453.757 1125.43 370.29 920.633 543.09C664.633 759.09 870.633 857.09 1042.63 679.09C1180.23 536.69 1227.97 495.757 1234.63 493.09C1131.3 613.09 959.433 839.89 1098.63 787.09C1237.83 734.29 1315.3 631.757 1336.63 587.09M2112 297C2064 349.637 1956 428.928 1908 325C1848 195.091 1956 117 2112 85.0005C2268 53.0005 2344 141 2480 113C2616 85.0005 2736 41 2784 1M2396 195.091C2338.67 232.424 2201.6 344.29 2112 493.09C2000 679.09 1948 753.181 1824 787.09C1700 821 1660 771.09 1616 679.09M2436 441.091C2332 538.454 2148.8 743.963 2248 787.09C2372 841 2605.36 522.281 2676 473C2762 413 2918 447.091 2846 551M2600 587.09C2536 685.12 2457.6 856.763 2656 759.09C2854.4 661.418 2920 527.667 2928 473M2784 709C2676 937 2633.71 1129 2510 1259C2426 1347.27 2242.07 1297.43 2276 1165C2348 884 2628 1023 2868 787.09C3002.44 654.937 3100 505.182 3112 441.091C3129.33 465.121 3180.8 509.163 3248 493.09C3136 581.757 2958.4 759.09 3144 759.09C3376 759.09 3660 545.09 3676 493.09C3692 441.091 3636 397.182 3460 517.091C3284 637 3336 807.09 3480 797.09C3624 787.09 3732 657.09 3760 587.09M2539 316C2528 312.667 2505.8 311.8 2505 335C2504 364 2565 355 2539 316Z" stroke=""/>
	</svg>
</div>
<div class="mobile-images">
    <img src="maintenance/foto01.webp" class="foto-m" />
    <img src="maintenance/foto02.webp" class="foto-m" />
    <img src="maintenance/foto03.webp" class="foto-m" />
    <img src="maintenance/foto04.webp" class="foto-m" />
    <img src="maintenance/foto05.webp" class="foto-m" />
    <img src="maintenance/foto06.webp" class="foto-m" />
    <img src="maintenance/foto07.webp" class="foto-m" />
    <img src="maintenance/foto08.webp" class="foto-m" />
    <img src="maintenance/foto09.webp" class="foto-m" />
    <img src="maintenance/foto197.webp" class="foto-m" />
    <img src="maintenance/foto217.webp" class="foto-m" />
    <img src="maintenance/foto259.webp" class="foto-m" />
    <img src="maintenance/foto302.webp" class="foto-m" />
    <img src="maintenance/foto474.webp" class="foto-m" />
    <img src="maintenance/foto510.webp" class="foto-m" />
    <img src="maintenance/foto455.webp" class="foto-m" />
    <img src="maintenance/foto70.webp" class="foto-m" />
    <img src="maintenance/foto94.webp" class="foto-m" />
    <img src="maintenance/foto104.webp" class="foto-m" />
    <img src="maintenance/foto159.webp" class="foto-m" />
    <img src="maintenance/foto277.webp" class="foto-m" />
</div>
<style>
.container {
    position: relative;
    width: 100vw;
    height: 100vh;
    padding: 20px;
    box-sizing: border-box;
}

svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100vw - 12rem);
    height: calc(100vh - 12rem);
}
:global(.foto) {
    position: absolute;
    height: auto;
    transform: translate(-50%, -50%);
    opacity: 0; /* Anfangs unsichtbar */
    transition: opacity 0.5s ease, transform 0.3s ease; /* Fade-in und Zoom-Effekt */
}
:global(.foto:hover) {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 1;
}
:global(.foto.hover-copy) {
    position: fixed; /* Stelle sicher, dass es unabhängig vom Rest der Seite bleibt */
    top: 50%;
    left: 50%;
    z-index: 10;
    opacity: 0;
    transform: scale(1);
    transition: opacity 0s ease, transform 0s ease;
    pointer-events: none;
}
:global(.foto:hover + .foto.hover-copy) {
    opacity: 1;
    transform: scale(20);
}
.text {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
    color: black;
    text-align: center;
    width: 100%;
    opacity: 1;
    z-index: 1000;
	max-width: 400px;
	padding: var(--gutter);
}
a:hover {
    color: gray;
}
:global(.mobile-images) {
	display: none;
}
@media (max-width: 768px) {
    :global(.foto) {
        display: none;
        width: auto;
        height: auto;
        max-width: 30vw;
        max-height: 30vh;
        object-fit: contain;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.5s ease;
    }

    :global(.foto-m) {
        display: none;
        width: auto;
        height: auto;
        max-width: 30vw;
        max-height: 30vh;
        object-fit: contain;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    :global(.foto.hover-copy) {
        display: none;
    }
    :global(.mobile-images) {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        overflow: hidden;
		display: block;
    }
    :global(.foto-m.active) {
        display: block;
        opacity: 1;
    }
}
</style>