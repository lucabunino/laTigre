<script>
let { media } = $props()

// Imports
import { register } from 'swiper/element/bundle';register();
import { urlFor } from '$lib/utils/image';
import Media from "$lib/components/Media.svelte"

// Variables
let domLoaded = $state(false)

// Lifecycle
let swiperEl = $state()
$effect(() => {
const swiperParams = {
	slidesPerView: 1.2,
	loop: media.length > 2 ? false : false,
	speed: 400,
	freeMode: false,
	direction: "horizontal",
};
Object.assign(swiperEl, swiperParams);
swiperEl.initialize();
domLoaded = true;
})
</script>

<svelte:window onwheel|nonpassive={(e) => {e.preventDefault()}}/>

<swiper-container
init="false"
bind:this={swiperEl}
>
	{#each media as media, i}
		<swiper-slide>
			{#if media.mp4}
			<Media media={media}
			className="swiper-mobile-media"
			resolution={1920}
			video={true}
			/>
			{:else}
			<Media media={media}
			className="swiper-mobile-media"
			resolution={1920}
			/>
			{/if}
		</swiper-slide>
	{/each}
</swiper-container>

<style>
swiper-container {
	width: 100%;
}
swiper-slide {
	overflow: hidden;
	display: flex;
}
</style>