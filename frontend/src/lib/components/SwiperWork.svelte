<script>
let { data } = $props()

// Imports
import { register } from 'swiper/element/bundle';register();
import { urlFor } from '$lib/utils/image';
import { goto } from '$app/navigation';
import Media from "$lib/components/Media.svelte"

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
class="{data.work[0].slug.current} no-cursor"
init="false"
onswiperrealindexchange={onRealIndexChange}
>
  {#each data.work[0].media as media, i}
    <swiper-slide>
      {#if media.mp4}
		<Media media={media}
		className="swiper-media"
		resolution={2200}
		video={true}
		/>
      {:else}
	  	<Media media={media}
		className="swiper-media"
		resolution={2200}
		/>
      {/if}
    </swiper-slide>
  {/each}
</swiper-container>

<button
class="swiper-single-button swiper-single-button-prev no-cursor"
onmouseover={() => ctaer.setCta("Previous")} onfocus={() => ctaer.setCta("Previous")}
aria-label="Previous"
></button>
<button
class="swiper-single-button swiper-single-button-next no-cursor"
onmouseover={() => ctaer.setCta("Next")} onfocus={() => ctaer.setCta("Next")} aria-label="Next"
></button>


{#if domLoaded && !data.work[0].prev || slider.slide == 0 && toggler.last == "home"}
  <button
  class="project-link project-link-prev no-cursor"
  onclick={(e) => {toggler.closeModal(true, false, e); slider.setSlide(0)}}
  onmouseover={() => ctaer.setCta("Close")} onfocus={() => ctaer.setCta("Close")} aria-label="Close"
  onmouseleave={() => ctaer.setCta("")}
  ></button>
{:else if domLoaded && data.work[0].prev && slider.slide == 0}
  <a
  class="project-link project-link-prev no-cursor"
  href="/works/{data.work[0].prev.slug.current}"
  data-sveltekit-preload-data="false"
  onclick={(e) => {toggler.changeWork(e, data.work[0].prev.slug.current, data.work[0].prev.media?.length > 1 ? data.work[0].prev.media?.length : 0)}}
  onmouseover={() => ctaer.setCta("Previous project")} onfocus={() => ctaer.setCta("Previous project")} aria-label="Previous project"
  ></a>
{/if}
{#if domLoaded && !data.work[0].next && slider.slide == data.work[0].media?.length-1 || slider.slide == data.work[0].media?.length-1 && toggler.last == "home"}
  <button
  class="project-link project-link-next no-cursor"
  onclick={(e) => {toggler.closeModal(true, false, e); slider.setSlide(0)}}
  onmouseover={() => ctaer.setCta("Close")} onfocus={() => ctaer.setCta("Close")} onmouseleave={() => ctaer.setCta("")}
  aria-label="Close"
  ></button>
{:else if domLoaded && data.work[0].next && slider.slide == data.work[0].media?.length-1}
  <a
  class="project-link project-link-next no-cursor"
  href="/works/{data.work[0].next.slug.current}"
  data-sveltekit-preload-data="false"
  onclick={(e) => {toggler.changeWork(e, data.work[0].next.slug.current, 0)}}
  onmouseover={() => ctaer.setCta("Next project")} onfocus={() => ctaer.setCta("Next project")} aria-label="Next project"
  ></a>
{/if}

<style>
swiper-container::part(wrapper) {
  -webkit-box-pack: start !important;
      -ms-flex-pack: start !important;
          justify-content: flex-start !important;
}
swiper-slide {
  overflow: hidden;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
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

/* Tablet horizontal */
@media (pointer: coarse) and (hover: none) and (min-width: 768px) and (orientation: landscape) {
	.swiper-single-button,
	.project-link {
		background: var(--white);
		width: 50px;
		height: 50px;
		border-radius: 99px;
		top: 50%;
		transform: translateY(-50%);
	}
	.swiper-single-button-prev,
	.project-link-prev {
		left: var(--gutter);
	}
	.swiper-single-button-next,
	.project-link-next {
		right: var(--gutter);
	}
}
</style>