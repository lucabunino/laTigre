<script>
let { data } = $props()

// Imports
import { register } from 'swiper/element/bundle';register();
import { urlFor } from '$lib/utils/image';
import { goto } from '$app/navigation';
import { getToggles  } from '$lib/stores/toggle.svelte.js';
let toggler = getToggles()
import { getCta  } from '$lib/stores/cta.svelte.js';
let ctaer = getCta()
import { getSlide  } from '$lib/stores/slide.svelte.js';
let slider = getSlide()

// Variables
let cta = $state()

// Functions
function onRealIndexChange(e) {
  const [swiper] = e.detail;
  slider.setSlide(swiper.realIndex)
}

// Lifecycle
$effect(() => {
const swiperEl = document.querySelector("." + data.work[0].slug.current);
const swiperParams = {
  slidesPerView: 1,
  centeredSlides: true,
  loop: false,
  mousewheel: {
    forceToAxis: false,
  },
  navigation: {
    nextEl: '.swiper-single-button-next',
    prevEl: '.swiper-single-button-prev',
  },
  speed: 400,
  freeMode: false,
  keyboard: true,
  direction: "horizontal",
  hashNavigation: true,
};
Object.assign(swiperEl, swiperParams);
swiperEl.initialize();

if (swiperEl && swiperEl.swiper && typeof slider.slide === 'number') {
  swiperEl.swiper.slideTo(slider.slide, 0);
}
})
</script>

<swiper-container
class={data.work[0].slug.current}
init="false"
onswiperrealindexchange={onRealIndexChange}
>
  {#each data.work[0].media as media, i}
    <swiper-slide>
      {#if media.mp4}
        <video class="media" muted loop autoplay playsinline
        src={media.mp4.asset.url}
        placeholder={media.cover ? urlFor(media.cover).height(2200) : ""}
        ></video>
      {:else}
        <img class="media"
        src={urlFor(media).height(2200)}
        width={media.info.metadata.dimensions.width}
        height={media.info.metadata.dimensions.height}
        alt={media.info.altText}>
      {/if}
    </swiper-slide>
  {/each}
</swiper-container>

<button
class="swiper-single-button swiper-single-button-prev"
onmouseover={() => ctaer.setCta("Previous")}></button>
<button
class="swiper-single-button swiper-single-button-next"
onmouseover={() => ctaer.setCta("Next")}></button>

{#if data.work[0].prev && slider.slide == 0}
  <a
  class="project-link project-link-prev"
  href="/archive/{data.work[0].prev.slug.current}"
  data-sveltekit-preload-data="false"
  onclick={(e) => {toggler.changeSingle(e, data.work[0].prev.slug.current, data.work[0].prev.media?.length)}}
  onmouseover={() => ctaer.setCta("Go to: " + data.work[0].prev.title)}></a>
{/if}
{#if data.work[0].next && slider.slide == data.work[0].media?.length-1}
  <a
  class="project-link project-link-next"
  href="/archive/{data.work[0].next.slug.current}"
  data-sveltekit-preload-data="false"
  onclick={(e) => {toggler.changeSingle(e, data.work[0].next.slug.current, 0)}}
  onmouseover={() => ctaer.setCta("Go to: " + data.work[0].next.title)}></a>
{/if}

<style>
swiper-container::part(wrapper) {
  justify-content: flex-start !important;
}
swiper-slide {
  overflow: hidden;
  display: flex;
  justify-content: center;
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
  height: 100vh;
  width: auto;
  max-width: 100vw;
  object-fit: cover;
}
</style>