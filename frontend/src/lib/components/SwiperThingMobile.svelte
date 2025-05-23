<script>
let { media } = $props()

// Imports
import { register } from 'swiper/element/bundle';register();
import { urlFor } from '$lib/utils/image';
import { goto } from '$app/navigation';

// Variables
let domLoaded = $state(false)

// Lifecycle
let swiperEl = $state()
$effect(() => {
const swiperParams = {
  slidesPerView: 1,
  loop: true,
  speed: 400,
  freeMode: false,
  direction: "horizontal",
  hashNavigation: true,
  navigation: {
    nextEl: '.swiper-single-button-next',
    prevEl: '.swiper-single-button-prev',
  },
};
Object.assign(swiperEl, swiperParams);
swiperEl.initialize();
setTimeout(() => {
  domLoaded = true;
}, 500);
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
        <video class="media" muted loop autoplay playsinline
        src={media.mp4.asset.url}
        placeholder={media.cover ? urlFor(media.cover).height(1920) : ""}
        ></video>
      {:else}
        <img class="media"
        src={urlFor(media).height(1920)}
        width={media.info.metadata.dimensions.width}
        height={media.info.metadata.dimensions.height}
        alt={media.info.altText}>
      {/if}
    </swiper-slide>
  {/each}
</swiper-container>

<button
class="swiper-single-button swiper-single-button-prev no-cursor"
onmouseover={() => ctaer.setCta("Previous")} onfocus={() => ctaer.setCta("Previous")} aria-label="Previous"
></button>
<button
class="swiper-single-button swiper-single-button-next no-cursor"
onmouseover={() => ctaer.setCta("Next")} onfocus={() => ctaer.setCta("Next")} aria-label="Next"
></button>

<style>
swiper-slide {
  overflow: hidden;
  display: flex;
}
:global(.swiper-button-disabled) {
  display: none !important;
}
.swiper-single-button,
.project-link {
  background: transparent;
  border: none;
  width: 50vw;
  height: 100%;
  position: absolute;
  display: block;
  top: 0;
  z-index: 2;
  cursor: pointer;
}
.project-link {
  z-index: 3;
}
.swiper-single-button,
.project-link {
  background: transparent;
  border: none;
  width: 50vw;
  height: 100vh;
  position: absolute;
  display: block;
  top: 0;
  z-index: 2;
  cursor: pointer;
}
.project-link {
  z-index: 3;
}
.swiper-single-button-prev,
.project-link-prev {
  left: 0;
}
.swiper-single-button-next,
.project-link-next {
  right: 0;
}
.media {
  width: 100%;
  height: auto;
  aspect-ratio: 2/3;
  max-width: 100vw;
  object-fit: cover;
}
</style>