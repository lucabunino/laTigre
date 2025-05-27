<script>
let { data } = $props()

// Imports
import { register } from 'swiper/element/bundle';register();
import { urlFor } from '$lib/utils/image';
import { getToggles	} from '$lib/stores/toggle.svelte.js';
let toggler = getToggles()
import { getCta	} from '$lib/stores/cta.svelte.js';
let ctaer = getCta()

// Variables
let currentProject = $state(data.projects[0]);

// Lifecycle
let swiperEl = $state()
$effect(() => {
const swiperParams = {
	slidesPerView: 1,
	spaceBetween: 0,
	centeredSlides: false,
	loop: data.projects.length > 5 ? false : false,
	normalizeSlideIndex: true,
	mousewheel: {
		forceToAxis: false,
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	speed: 500,
	freeMode: false,
	keyboard: true,
	direction: "horizontal",
	cssMode: false,
	effect: "creative",
	// creativeEffect: {
	// 	perspective: false,
	// 	prev: {
	// 		translate: [0, 0, -100],
    //     },
    //     next: {
	// 		translate: ["100%", 0, 100],
    //     },
	// },
	creativeEffect: {
        prev: {
          translate: [0, 0, -1],
		//   opacity: 0,
		  origin: "center",
        },
        next: {
          translate: [innerWidth, 0, 0],
        },
      },
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

let currentSlide = $state(0)
const onRealIndexChange = (e) => {
	const [swiper] = e.detail;
	currentSlide = swiper.realIndex
	currentProject = data.projects[swiper.realIndex]
};
</script>	 

<swiper-container
class="swiper"
init="false"
onswiperrealindexchange={onRealIndexChange}
bind:this={swiperEl}
>
	{#each data.projects as project, i}
		<swiper-slide style={i === data.projects.length - 1 && data.projects.length <= 5 ? "width: 100%" : ""}
		class:swiper-slide-past={i < currentSlide}
		loading="lazy"
		>
			<div class="swiper-slide-transform">
				<a
					class="project no-cursor"
					onmouseover={() => ctaer.setCta('View')} onfocus={() => ctaer.setCta("View")} aria-label="View"
					onclick={(e) => {project.reference._type === 'good' ? toggler.toggleGood(e, project.reference.slug.current, true) : toggler.toggleWork(e, project.reference.slug.current, true)}}
					data-sveltekit-preload-data
					href="{project.reference._type === 'good' ? '/goods' : '/works'}/{project.reference.slug.current}"
				>
					{#if project.desktop}
						<img
							class="media"
							src={urlFor(project.desktop.asset).height(2200)}
							alt={project.desktop.info.altText}
							width={innerHeight * project.desktop.info.metadata.dimensions.width / project.desktop.info.metadata.dimensions.height}
							height={innerHeight}
						/>
					{:else if project.video}
						<video
							class="media"
							muted
							loop
							autoplay
							playsinline
							src={project.video.mp4.asset.url}
							placeholder={project.video.cover ? urlFor(project.video.cover.asset).height(2200) : ''}
						></video>
					{/if}
					<div class="filter noise"></div>
				</a>
			</div>
		</swiper-slide>
	{/each}
</swiper-container>

<button class="swiper-button swiper-button-prev no-cursor"
onmouseover={() => ctaer.setCta("Previous")}
onfocus={() => ctaer.setCta("Previous")}
aria-label="Previous"
></button>
<button class="swiper-button swiper-button-next no-cursor"
onmouseover={() => ctaer.setCta("Next")}
onfocus={() => ctaer.setCta("Next")}
aria-label="Next"
></button>

<div class="project-info difference"
onmouseover={() => ctaer.setCta("")} onfocus={() => ctaer.setCta("")} aria-label="Project info"
role="button" tabindex="0"
>
	<p class="counter">{(currentSlide+1).toString().padStart(3, '0')}/{(data.projects.length).toString().padStart(3, '0')}</p>
	<h2>{currentProject.reference.title}</h2>
	{#if currentProject.reference.description}
		<p>{currentProject.reference.description}</p>
	{/if}
	<!-- {#if currentProject.reference.tags}
		<p>
			{#each currentProject.reference.tags as tag, i}
				{tag.title}{#if i + 1 < data.projects[0].reference.tags?.length}, {/if}
			{/each}
		</p>
	{/if} -->
</div>

<style>
swiper-container::part(wrapper) {
	justify-content: flex-start !important;
}
swiper-slide {
	overflow: visible;
	display: block;
	width: auto;
	transition: var(--transition)
}
.filter {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	transition: var(--transition);
	opacity: 0;
}
:global(swiper-slide.swiper-slide-prev) .filter, .swiper-slide-past .filter {
	backdrop-filter: blur(30px);
	opacity: 1;
}
/* :global(swiper-slide.swiper-slide-prev), .swiper-slide-past {
	filter: blur(30px);
} */
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
	display: block;
	height: 100vh;
	width: auto;
	max-width: 100vw;
	object-fit: cover;
	/* justify-self: center; */
}
.project-info {
	position: absolute;
	left: var(--gutter);
	bottom: var(--gutter);
	z-index: 2;
}
</style>