<script>
// Data
let { data } = $props()

// Imports
import { urlFor } from "$lib/utils/image";
import { getToggles	} from '$lib/stores/toggle.svelte.js';
import Media from "$lib/components/Media.svelte"
import SwiperMobile from '$lib/components/SwiperMobile.svelte';
let toggler = getToggles()

// Variables
let totalmedia = data.works.reduce((sum, work) => sum + (work.media?.length || 0), 0);
let remainingMedia = totalmedia+1;
let index = 1;
let cols = 8;
let colsMobile = 3;
let domLoaded = $state(false);
let innerWidth = $state(0);
let innerHeight = $state(0);
let activeWork = $state(null);
let openWork = $state(false);
let desktopColours = data.colours.desktop
let mobileColours = data.colours.mobile
let body = $state()

// Lifecycle
$effect(() => {
	setTimeout(() => {
		domLoaded = true;
	}, 1500);
	if (openWork === 0 || openWork > 0) {
		body.style.overflow = 'hidden';
	} else {
		body.style.overflow = '';
	}
})

// Functions
function handleMouseover(e) {
	e.target.classList.toggle("on")
	console.log(e.target);
	
}
function handleTap(e, workSlug, index) {
	e.preventDefault()
	if (activeWork !== workSlug) {
		activeWork = workSlug; 
	} else {
		handleOpenWork(index)
	}
}
function handleOpenWork(i) {
	if (openWork === i) {
		openWork = false
	} else {
		openWork = i
	}
}
function closeOpenWork() {
	openWork = false
}
</script>

<svelte:window bind:innerWidth bind:innerHeight></svelte:window>
<svelte:body bind:this={body}/>

<section class="folio-14"
style="--mobileColour0: {mobileColours[0]?.hex}; --mobileColour1: {mobileColours[1]?.hex}"
>
	{#each data.works as work, i}
		{#each work.media as media, j}
		{@const localIndex = index}
		{@const col = (localIndex - 1) % cols}
		{@const colMobile = (localIndex - 1) % colsMobile}
		{@const row = Math.floor((localIndex - 1) / cols)}
		{@const rowMobile = Math.floor((localIndex - 1) / colsMobile)}
			<a class="work"
			href="/works/{work.slug.current}"
			data-index={localIndex}
			data-work={work.slug.current}
			onmouseenter={(e) => {if (innerWidth > 820) {
				handleMouseover(e)}
			}}
			onclick={(e) => {if (innerWidth > 820) {
				toggler.toggleWork(e, work.slug.current)
			} else {
				handleTap(e, work.slug.current, i)	
			}}} data-sveltekit-preload-data
			class:active={activeWork === work.slug.current}
			class:loading={!domLoaded}
			class:on={(row % 2 === 0 && col % 2 !== 0) || (row % 2 !== 0 && col % 2 === 0)}
			class:onMobile={(rowMobile % 2 === 0 && colMobile % 2 !== 0) || (rowMobile % 2 !== 0 && colMobile % 2 === 0)}
			style="--desktopColour: {desktopColours[localIndex % desktopColours.length].hex}; --mobileColour: {mobileColours[localIndex % mobileColours.length].hex}"
			>
			{#if media.asset}
				<Media media={media} className="works-media" resolution={600} delay={1500 + localIndex*10} style="--transition-delay:{localIndex*30}ms"/>
			{:else if media.mp4}
				<Media media={media} className="works-media" resolution={600} delay={1500 + localIndex*10} style="--transition-delay:{localIndex*30}ms" video={true}/>
			{/if}
				<div class="work-info-container">
					<div class="work-info difference"
					class:work-info-mobile={j == 0}
					>
						<h2>{work.title}</h2>
						{#if work.tags}
							<p>
								{#each work.tags as tag, i}
									{tag.title}{#if i+1 < work.tags.length}{@html ", "}{/if}
								{/each}
							</p>
						{/if}
					</div>
					<p class="index difference">{(remainingMedia -= 1).toString().padStart(3, '0')}</p>
				</div>
			</a>
			{(() => {index++})()}
		{/each}
		{#if innerWidth <= 820 && openWork === i}
			<div class="swiper-container">
				<SwiperMobile media={work.media}/>
				<button class="close-btn difference"
				onclick={(e) => {closeOpenWork()}}
				>Close</button>
			</div>
			<!-- {#if thing.moreInfo}
				<p class="moreInfo folio-18">{thing.moreInfo}</p>
			{/if} -->
		{/if}
	{/each}
</section>

<style>
section {
	display: -ms-grid;
	display: grid;
	width: 100vw;
	-webkit-box-align: start;
	    -ms-flex-align: start;
	        align-items: start;
	-ms-grid-columns: (1fr)[8];
	grid-template-columns: repeat(8, 1fr);
}
.work {
	position: relative;
	width: 100%;
	height: auto;
	aspect-ratio: 2/3;
	overflow: hidden;
}
.work-info-container {
	position: absolute;
	bottom: 0;
	padding: calc(var(--gutter)/2);
	-webkit-box-align: end;
	    -ms-flex-align: end;
	        align-items: flex-end;
	-webkit-box-pack: end;
	    -ms-flex-pack: end;
	        justify-content: flex-end;
	gap: calc(var(--gutter)/2);
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	width: 100%;
}
.work .work-info {
	opacity: 0;
	width: 100%;
}
.swiper-container {
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	    -ms-flex-align: center;
	        align-items: center;
	background-color: var(--black);
	z-index: 99;
}
.close-btn {
	position: fixed;
	right: var(--gutter);
	top: var(--gutter);
	z-index: 100;
	font-size: 1rem;
}

/* Shared styles for touch/mobile/tablet */
@media (pointer: coarse) and (hover: none), (max-width: 600px) {
	section {
		-ms-grid-columns: (1fr)[3];
		grid-template-columns: repeat(3, 1fr);
	}
}
/* Tablet vertical */
@media (pointer: coarse) and (hover: none) and (min-width: 768px) and (orientation: portrait) {
	section {
		-ms-grid-columns: (1fr)[3];
		grid-template-columns: repeat(3, 1fr);
	}
}
/* Tablet horizontal */
@media (pointer: coarse) and (hover: none) and (min-width: 768px) and (orientation: landscape) {
	section {
		-ms-grid-columns: (1fr)[8];
		grid-template-columns: repeat(8, 1fr);
	}
}
/* Hover styles for non-touch devices (desktops) */
@media (max-width: 820px) {
	.work {
		background-color: var(--mobileColour0);
		-webkit-transition: var(--transition);
		-o-transition: var(--transition);
		transition: var(--transition);
	}
	.work.onMobile {
		background-color: var(--mobileColour1);
	}
	.work:not(.loading) {
		background-color: var(--white);
	}
	.index, .work-info {
		opacity: 1;
	}
	.work.active .index {
		opacity: 0;
	}
	.work-info.work-info-mobile {
		opacity: 1;
	}
	.work.active .work-info.work-info-mobile {
		opacity: 0;
	}
	.work.active .work-info {
		opacity: 0;
	}
	.work.active:first-of-type .work-info {
		opacity: 0;
	}
}
/* Hover styles for non-touch devices (desktops) */
@media (min-width: 821px) {
	.work:hover .work-info {
		opacity: 1;
	}
	.work.on {
		background-color: var(--desktopColour);
	}
	.work.on .index {
		opacity: 0;
	}
}
</style>