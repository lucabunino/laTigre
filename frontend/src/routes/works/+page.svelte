<script>
// Data
let { data } = $props()

// Imports
import { urlFor } from "$lib/utils/image";
import { getToggles	} from '$lib/stores/toggle.svelte.js';
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
let desktopColours = data.colours.desktop
let mobileColours = data.colours.mobile

// Functions
function handleMouseover(e) {
	e.target.classList.toggle("on")
}
function handleTap(e, workSlug) {
	e.preventDefault()
	if (activeWork !== workSlug) {
		activeWork = workSlug; 
	} else {
		activeWork = null
	}
}

// Lifecycle
$effect(() => {
	setTimeout(() => {
		domLoaded = true;
	}, 1500);
})
</script>

<svelte:window bind:innerWidth bind:innerHeight></svelte:window>

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
			onmouseenter={(e) => {if (innerWidth > 700) {
				handleMouseover(e)}
			}}
			onclick={(e) => {if (innerWidth > 700) {
				toggler.toggleWork(e, work.slug.current)
			} else {
				handleTap(e, work.slug.current)				
			}}} data-sveltekit-preload-data
			class:active={activeWork === work.slug.current}
			class:loading={!domLoaded}
			class:on={(row % 2 === 0 && col % 2 !== 0) || (row % 2 !== 0 && col % 2 === 0)}
			class:onMobile={(rowMobile % 2 === 0 && colMobile % 2 !== 0) || (rowMobile % 2 !== 0 && colMobile % 2 === 0)}
			style="--desktopColour: {desktopColours[localIndex % desktopColours.length].hex}; --mobileColour: {mobileColours[localIndex % mobileColours.length].hex}"
			>
			{#if media.asset}
				<img class="media"
				style="--transition-delay:{localIndex*30}ms"
				src={urlFor(media).width(600)} alt="">
			{:else if media.mp4}
				<video class="media" muted loop autoplay playsinline
				style="--transition-delay:{localIndex*30}ms"
				src={media.mp4.asset.url}
				placeholder={media.cover ? urlFor(media.cover.asset).width(600) : ""}></video>
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
	{/each}
</section>

<style>
section {
	display: grid;
	width: 100vw;
	align-items: start;
	grid-template-columns: repeat(8, 1fr);
}
.work {
	position: relative;
	width: 100%;
	height: auto;
	aspect-ratio: 2/3;
	overflow: hidden;
}
.work .media {
	width: 100%;
	height: 100%;
	object-fit: cover;
	opacity: 0;
}
.work-info-container {
	position: absolute;
	bottom: 0;
	padding: calc(var(--gutter)/2);
	align-items: flex-end;
	justify-content: flex-end;
	gap: calc(var(--gutter)/2);
	display: flex;
	width: 100%;
}
.work .work-info {
	opacity: 0;
	width: 100%;
}
@media screen and (min-width: 701px) {
	.work:hover .work-info {
		opacity: 1;
	}
	.work.on {
	background-color: var(--desktopColour);
	}
	.work.on:not(.loading) .media {
	opacity: 1;
	}
	.work.on .index {
	opacity: 0;
	}
}
@media screen and (max-width: 700px) {
	section {
		grid-template-columns: repeat(3, 1fr);
	}
	.work {
		background-color: var(--mobileColour0);
	}
	.work.onMobile {
		background-color: var(--mobileColour1);
	}
	.work:not(.loading) {
		background-color: var(--white);
	}
	/* .work.on {
	background-color: var(--white);
	} */
	.work.on:not(.loading) .media, .work:not(.loading) .media {
		opacity: 1;
	}
	.work.active {
		/* background-color: var(--white); */
	}
	.work .media {
		opacity: 0 !important;
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
	.work.active .media {
		opacity: 1 !important;
	}
	.work.active:first-of-type .work-info {
		opacity: 0;
	}
}
</style>