<script>
let {
	media,
	className,
	video = false,
	width,
	height,
	resolution = 2000,
	style = ""
} = $props()
import { urlFor } from '$lib/utils/image';

// Variables
const observerOptions = {
	root: null,
	rootMargin: "-50px",
	threshold: 0.1,
};

let imgSrc = $state();
let high = $state();
if (!video) {
	imgSrc = media.asset ? urlFor(media.asset).height(100) : "";
	high = media.asset ? urlFor(media.asset).height(resolution) : "";
} else {
	imgSrc = media.cover ? urlFor(media.cover.asset).height(100) : "";
	high = media.cover ? urlFor(media.cover.asset).height(resolution) : "";
}
let blurred = $state(true);
let loaded = $state(false);
let observer;
let img;

// Lifecycle
$effect(() => {
	const highImg = new Image();
	highImg.src = high;
	highImg.onload = () => {
		imgSrc = high;
		loaded = true;
		if (isInViewport(img)) blurred = false;
	};
	return () => observer?.disconnect();
});
// Functions
function isInViewport(el) {
	if (!el) return false;
	const rect = el.getBoundingClientRect();
	return rect.top <= window.innerHeight - 200 && rect.bottom >= 100;
}
function entersViewport(e) {
	img = e;
	if (loaded && isInViewport(img)) {
		blurred = false;
	}
	observer = new IntersectionObserver(entries => {
		if (entries[0].isIntersecting && loaded) {
			blurred = false;
		}
	}, observerOptions);
	observer.observe(img);
}
</script>

{#if video}
	<video class={className} muted loop autoplay playsinline
	use:entersViewport
	class:blurred={blurred}
	src={media.mp4.asset.url}
	placeholder={media.cover ? urlFor(media.cover.asset).height(resolution) : ""}
	width={width}
	height={height}
	style={style}
	resolution={resolution}
	></video>
{:else}
	<img class={className}
	use:entersViewport
	class:blurred={blurred}
	src={imgSrc}
	width={media.info.metadata.dimensions.width}
	height={media.info.metadata.dimensions.height}
	alt={media.info.altText}
	style={style}
	resolution={resolution}
	>
{/if}

<style>
img, video {
	-webkit-transition: var(--transition);
    -o-transition: var(--transition);
    transition: var(--transition);
	transition-property: filter;
}
.media-container {
	overflow: hidden;
}
/* General */
.blurred {
	filter: blur(10px);
}
.blurred::before {
	content: '';
	position: absolute;
	inset: 0;
	background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><filter id='n' x='0%' y='0%' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='1' numOctaves='1' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
	opacity: 0.2;
	pointer-events: none;
}
/* Home */
.home-mobile-media {
	width: 100%;
	height: 85vh;
	object-fit: cover;
}
.embla-media {
	display: block;
	height: 100vh;
	width: auto;
	max-width: 100vw;
	object-fit: cover;
}
/* Works */
.works-media {
	width: 100%;
	height: 100%;
	object-fit: cover;
	opacity: 0;
}
@media screen and (min-width: 701px) {
	:global(.work.on:not(.loading) .works-media) {
		opacity: 1;
	}
}
@media screen and (max-width: 700px) {
	:global(.work.on:not(.loading) .works-media), :global(.work:not(.loading) .works-media) {
		opacity: 1;
	}
	:global(.work.active .works-media) {
		opacity: 1 !important;
	}
}
.list-works-media {
	position: fixed;
	left: 0;
	top: 0;
	width: 25%;
	height: auto;
	display: none;
}
:global(a:hover .list-works-media) {
	display: block;
}
/* Things */
.things-media {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: none;
}
:global(.thing:not(.loading) .things-media) {
	display: block;
}

/* Swipers */
.swiper-media {
	height: 100vh;
	width: auto;
	max-width: 100vw;
	object-fit: cover;
}
.swiper-thing-mobile-media {
	width: 100%;
	height: auto;
	aspect-ratio: 2/3;
	max-width: 100vw;
	object-fit: cover;
}
</style>