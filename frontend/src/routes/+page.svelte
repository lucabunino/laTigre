<script>
// Data
let { data } = $props()
$inspect(data.projects)

// Imports
import { register } from 'swiper/element/bundle';register();
import { urlFor } from '$lib/utils/image';

// Variables
let currentProject = $state(data.projects[0]);
let innerWidth = $state();
let innerHeight = $state();
let mouse = $state([])
let cta = $state()

// Functions
function setCta(text) {
  cta = text
}

// Lifecycle
$effect(() => {
const swiperEl = document.querySelector('swiper-container');
const swiperParams = {
  slidesPerView: "auto",
  centeredSlides: false,
  loop: data.projects.length > 5 ? true : false,
  loopAddBlankSlides: true,
  loopAdditionalSlides: 0,
  mousewheel: {
    forceToAxis: false,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  // autoplay: {
  //   delay: 10000,
  //   disableOnInteraction: true,
  //   waitForTransition: true,
  // },
  speed: 400,
  freeMode: false,
  keyboard: true,
  direction: "horizontal",
  hashNavigation: true,
  breakpoints: {
    600: {
      mousewheel: {
        forceToAxis: false,
        sensitivity: .3,
        thresholdDelta: 10,
      },
    },
  },
};
Object.assign(swiperEl, swiperParams);
swiperEl.initialize();
})
const onRealIndexChange = (e) => {
  const [swiper] = e.detail;
  currentProject = data.projects[swiper.realIndex]
};
function handleMousemove(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}
</script>

<svelte:window bind:innerWidth bind:innerHeight onmousemove={handleMousemove}></svelte:window>

<swiper-container
init="false"
onswiperrealindexchange={onRealIndexChange}
>
  {#each data.projects as project, i}
    <swiper-slide style={i === data.projects.length - 1 && data.projects.length <= 5 ? "width: 100%" : "width: fit-content"}>
      <a class="project"
      onmouseover={() => setCta("View")}
      href="{project.reference._type === "personal" ? "personal" : "archive"}/{project.reference.slug.current}"
      >
      {#if project.desktop}
        <img class="media"
        src={urlFor(project.desktop.asset).height(1920)}
        width={project.desktop.info.metadata.dimensions.width}
        height={project.desktop.info.metadata.dimensions.height}
        alt={project.desktop.info.altText}>
      {:else if project.video}
        <video class="media" muted loop autoplay playsinline
        src={project.video.mp4.asset.url}
        placeholder={project.video.cover ? urlFor(project.video.cover.asset).width(600) : ""}
        ></video>
      {/if}
      </a>
    </swiper-slide>
  {/each}
</swiper-container>
<div class="project-info difference">
  <h2>{currentProject.reference.title}</h2>
  {#if currentProject.reference.tags}
    <p>
      {#each currentProject.reference.tags as tag, i}
        {tag.title}{#if i+1 < currentProject.reference.tags.length}{@html ", "}{/if}
      {/each}
    </p>
  {/if}
</div>
<button class="swiper-button swiper-button-prev" onmouseover={() => setCta("Previous")}></button>
<button class="swiper-button swiper-button-next" onmouseover={() => setCta("Next")}></button>
<p id="cta" class="difference" style={cta === "" ? `-webkit-transform: translateX(${(mouse.x / innerWidth)*-100}%);-ms-transform: translateX(${(mouse.x / innerWidth)*-100}%);transform: translateX(${(mouse.x / innerWidth)*-100}%);left: ${mouse.x}px;top: ${mouse.y}px;` : `-webkit-transform: translateX(${(mouse.x / innerWidth)*-100}%);-ms-transform: translateX(${(mouse.x / innerWidth)*-100}%);transform: translateX(${(mouse.x / innerWidth)*-100}%);left: ${mouse.x}px;top: ${mouse.y}px;`}>{cta}</p>

<style>
swiper-container::part(wrapper) {
  justify-content: flex-start !important;
}
swiper-slide {
  overflow: hidden;
}
.swiper-button {
  background: transparent;
  border: none;
  width: 20vw;
  height: 100vh;
  position: absolute;
  display: block;
  top: 0;
  z-index: 1;
  cursor: pointer;
}
.swiper-button-prev {
  left: 0;
}
.swiper-button-next {
  right: 0;
}
.media {
  height: 100vh;
  width: auto;
  max-width: 100vw;
  object-fit: cover;
}
.project-info {
  position: absolute;
  left: var(--gutter);
  bottom: var(--gutter);
  z-index: 2;
}
#cta {
  z-index: 2;
  position: absolute;
  top: 50%;
  pointer-events: none;
  margin: 1em;
}
</style>