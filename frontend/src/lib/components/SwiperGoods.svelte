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
let domLoaded = $state(false)

// Functions
function onRealIndexChange(e) {
  const [swiper] = e.detail;
  slider.setSlide(swiper.realIndex)
}

// Lifecycle
$effect(() => {
const swiperEl = document.querySelector("." + data.good[0].slug.current);
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
setTimeout(() => {
  domLoaded = true;
}, 500);

if (swiperEl && swiperEl.swiper && typeof slider.slide === 'number') {
  swiperEl.swiper.slideTo(slider.slide, 0);
}
})
</script>

<svelte:window onwheel|nonpassive={(e) => {e.preventDefault()}}/>

<swiper-container
class="{data.good[0].slug.current} no-cursor"
init="false"
onswiperrealindexchange={onRealIndexChange}
>
  {#each data.good[0].media as media, i}
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
class="swiper-single-button swiper-single-button-prev no-cursor"
onmouseover={() => ctaer.setCta("Previous")} onfocus={() => ctaer.setCta("Previous")} aria-label="Previous"
></button>
<button
class="swiper-single-button swiper-single-button-next no-cursor"
onmouseover={() => ctaer.setCta("Next")} onfocus={() => ctaer.setCta("Next")} aria-label="Next"
></button>

{#if domLoaded && !data.good[0].prev || slider.slide == 0 && toggler.last == "home"}
  <button
  class="project-link project-link-prev no-cursor"
  onclick={(e) => {toggler.closeModal(true, false, e); slider.setSlide(0)}}
  onmouseover={() => ctaer.setCta("Close")} onfocus={() => ctaer.setCta("Close")} aria-label="Close"
  onmouseleave={() => ctaer.setCta("")}
  ></button>
{:else if domLoaded && data.good[0].prev && slider.slide == 0}
  <a
  class="project-link project-link-prev no-cursor"
  href="/goods/{data.good[0].prev.slug.current}"
  data-sveltekit-preload-data
  onclick={(e) => {toggler.changeGood(e, data.good[0].prev.slug.current, data.good[0].prev.media?.length > 1 ? data.good[0].prev.media?.length : 0)}}
  onmouseover={() => ctaer.setCta("Previous good")} onfocus={() => ctaer.setCta("Previous good")} aria-label="Previous good"
  onmouseleave={() => ctaer.setCta("")}
  ></a>
{/if}
{#if domLoaded && !data.good[0].next && slider.slide == data.good[0].media?.length-1 || slider.slide == data.good[0].media?.length-1 && toggler.last == "home"}
  <button
  class="project-link project-link-next no-cursor"
  onclick={(e) => {toggler.closeModal(true, false, e); slider.setSlide(0)}}
  onmouseover={() => ctaer.setCta("Close")}
  onfocus={() => ctaer.setCta("Close")}
  onmouseleave={() => ctaer.setCta("")}
  aria-label="Close"
  ></button>
{:else if domLoaded && data.good[0].next && slider.slide == data.good[0].media?.length-1}
  <a
  class="project-link project-link-next no-cursor"
  href="/goods/{data.good[0].next.slug.current}"
  data-sveltekit-preload-data="false"
  onclick={(e) => {toggler.changeGood(e, data.good[0].next.slug.current, 0)}}
  onmouseover={() => ctaer.setCta("Next good")} onfocus={() => ctaer.setCta("Next good")} aria-label="Next good"
  onmouseleave={() => ctaer.setCta("")}
  ></a>
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
:global(.swiper-button-disabled) {
  display: none !important;
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