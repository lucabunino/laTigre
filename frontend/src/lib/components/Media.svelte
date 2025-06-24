<script>
import { urlFor } from '$lib/utils/image';
let {
	media,
	className,
	video = false,
	width,
	height,
	resolution = 2000,
	style = "",
	delay = 0
} = $props()

// Variables
const observerOptions = {
	root: null,
	rootMargin: "-10px",
	threshold: 0.05,
};

let imgSrc = $state();
let high = $state();

if (!video) {
	imgSrc = media.asset ? media.info.metadata.lqip : "";
	high = media.asset ? urlFor(media.asset).height(resolution) : "";
} else {
	$inspect(media.cover)
	imgSrc = media.cover ? media.cover.info.metadata.lqip : "";
	high = media.cover ? urlFor(media.cover.asset).height(resolution) : "";
}
let blurred = $state(true);
let loaded = $state(false);
let domLoaded = $state(false);
let observer;
let img;

// Lifecycle
$effect(() => {
	setTimeout(() => {
		domLoaded = true
	}, delay);
	const highImg = new Image();
	highImg.src = high;
	highImg.onload = () => {
		imgSrc = high;
		loaded = true;
		if (isInViewport(img)) blurred = false;
	};
	if (video && domLoaded) blurred = false;
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
	class:invisible={delay > 0 && !domLoaded}
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
	class:invisible={delay > 0 && !domLoaded}
	src={imgSrc}
	width={media.info.metadata.dimensions.width}
	height={media.info.metadata.dimensions.height}
	alt={media.info.altText}
	style={style}
	resolution={resolution}
	>
{/if}

<style>
/* General */
img, video {
	-webkit-transition: var(--transition);
    -o-transition: var(--transition);
    transition: var(--transition);
	-webkit-transition-property: -webkit-filter;
	transition-property: -webkit-filter;
	-o-transition-property: filter;
	transition-property: filter;
	transition-property: filter, -webkit-filter;
}
.blurred {
	-webkit-filter: blur(20px);
	        filter: blur(20px);
}
.invisible {
	-webkit-filter: blur(20px) opacity(0);
	        filter: blur(20px) opacity(0);
}
/* Home */
.home-mobile-media {
	width: 100%;
	height: 85vh;
	-o-object-fit: cover;
	   object-fit: cover;
}
.embla-media {
	display: block;
	height: 100vh;
	width: auto;
	max-width: 100vw;
	-o-object-fit: cover;
	   object-fit: cover;
}
/* Works */
.works-media {
	width: 100%;
	height: 100%;
	-o-object-fit: cover;
	   object-fit: cover;
	opacity: 0;
}

/* Tablet horizontal */
@media (pointer: coarse) and (hover: none) and (orientation: landscape) {
	.embla-media {
		max-width: 90vw;
	}
}
@media (pointer: fine) and (min-width: 601px) {
	:global(.work.on:not(.loading) .works-media) {
		opacity: 1;
	}
}
@media (pointer: fine) and (max-width: 1000px) {
	:global(.work.on:not(.loading) .works-media) {
		opacity: 0;
	}
	:global(.work.onTablet:not(.loading) .works-media) {
		opacity: 1;
	}
}
@media (pointer: fine) and (max-width: 600px) {
	:global(.work.onTablet:not(.loading) .works-media) {
		opacity: 0;
	}
}
@media (pointer: coarse) and (hover: none), (max-width: 600px) {
	:global(.work.on:not(.loading) .works-media), :global(.work:not(.loading) .works-media) {
		opacity: 0;
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
	-o-object-fit: cover;
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
	-o-object-fit: cover;
	   object-fit: cover;
}
.swiper-mobile-media {
	background-color: var(--white);
	width: 100%;
	height: auto;
	max-width: 100vw;
}
</style>