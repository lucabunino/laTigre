<script>
// Imports & setup
import emblaCarouselSvelte from 'embla-carousel-svelte';
import Media from "$lib/components/Media.svelte"
import { urlFor } from '$lib/utils/image';
import { getToggles } from '$lib/stores/toggle.svelte.js';
let toggler = getToggles();
import { getCta } from '$lib/stores/cta.svelte.js';
let ctaer = getCta();

// Variables
let { data } = $props();
let currentProject = $state(data.projects[0]);
let emblaApi;
let options = { loop: true, align: 'start', duration: 15, dragFree: false, skipSnaps: false };
let activeIndex = $state(0);

// Functions
function onInit(event) {
	emblaApi = event.detail;
	emblaApi.on('select', () => {
	const index = emblaApi.selectedScrollSnap();
	activeIndex = index
	currentProject = data.projects[index];
	});
}
function scrollNext() {
	emblaApi?.scrollNext();
}
function scrollPrev() {
	emblaApi?.scrollPrev();
}
</script>

<div class="embla">
	<div
		class="embla__viewport"
		use:emblaCarouselSvelte={{options}}
		onemblaInit={onInit}
	>
		<div class="embla__container">
			{#each data.projects as project, i}
				<div class="embla__slide">
					<a
						class="project no-cursor"
						onmouseover={() => ctaer.setCta('View')} onfocus={() => ctaer.setCta("View")} aria-label="View"
						onclick={(e) => {project.reference._type === 'thing' ? toggler.toggleThing(e, project.reference.slug.current, true) : toggler.toggleWork(e, project.reference.slug.current, true)}}
						data-sveltekit-preload-data
						href="{project.reference._type === 'thing' ? '/things' : '/works'}/{project.reference.slug.current}"
					>
						{#if project.desktop}
							<Media media={project.desktop}
							className="embla-media"
							resolution={2200}
							width={innerHeight * project.desktop.info.metadata.dimensions.width / project.desktop.info.metadata.dimensions.height}
							height={innerHeight}
							/>
						{:else if project.video}
							<Media media={project.video}
							className="embla-media"
							resolution={2200}
							video={true}
							width={"auto"}
							height={innerHeight}
							/>
						{/if}
					</a>
				</div>
			{/each}
		</div>
	</div>
	<button
		class="embla__button embla__prev no-cursor"
		onclick={scrollPrev}
		onmouseover={() => ctaer.setCta('Previous')} onfocus={() => ctaer.setCta("Previous")} aria-label="Previous"
	></button>
	<button
		class="embla__button embla__next no-cursor"
		onclick={scrollNext}
		onmouseover={() => ctaer.setCta('Next')} onfocus={() => ctaer.setCta("Next")} aria-label="Next"
	></button>
</div>

<div class="project-info difference"
onmouseover={() => ctaer.setCta("")} onfocus={() => ctaer.setCta("")} aria-label="Project info"
role="button" tabindex="0"
>
	<p class="counter">{(activeIndex+1).toString().padStart(3, '0')}/{(data.projects.length).toString().padStart(3, '0')}</p>
	<h2>{currentProject.reference.title}</h2>
	{#if currentProject.reference.description}
		<p>{currentProject.reference.description}</p>
	{/if}
</div>

<style>
.embla {
	overflow: hidden;
	position: relative;
}
.embla__viewport {
	overflow: hidden;
	width: 100%;
}
.embla__container {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
}
.embla__slide {
	-webkit-box-flex: 0;
	    -ms-flex: 0 0 auto;
	        flex: 0 0 auto;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-pack: center;
	    -ms-flex-pack: center;
	        justify-content: center;
	-webkit-box-align: center;
	    -ms-flex-align: center;
	        align-items: center;
}
.embla__button {
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
.embla__prev {
	left: 0;
}
.embla__next {
	right: 0;
}
.project-info {
	position: absolute;
	left: var(--gutter);
	bottom: var(--gutter);
	z-index: 2;
}

/* Tablet horizontal */
@media (pointer: coarse) and (hover: none) and (orientation: landscape) {
	.embla__button {
		display: none;
	}
}
</style>
