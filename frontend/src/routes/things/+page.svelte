<script>
import { urlFor } from "$lib/utils/image";
import { getToggles	} from '$lib/stores/toggle.svelte.js';
import SwiperThingMobile from '$lib/components/SwiperThingMobile.svelte';
let toggler = getToggles()

let { data } = $props()

let cols = 4;
let totalItems = data.things.length;
let totalSlots = totalItems * 2;
let rows = Math.ceil(totalSlots / cols);

var index = 0;
let domLoaded = $state(false);

let activeThings = $state([])
let openThing = $state(false)
$inspect(activeThings)
$inspect(openThing)

$effect(() => {
	setTimeout(() => {
		domLoaded = true;
	}, 1500);
});

function handleTap(i) {
	if (openThing != i || !openThing) {
		if (activeThings.includes(i)) {
			const index = activeThings.indexOf(i);
			if (index !== -1) {
				activeThings.splice(index, 1); // Remove the index if it exists in the array
			}
		} else {
			activeThings = [];
			activeThings.push(i)
			openThing = false
		}	
	}
}
function handleOpenThing(i) {
	if (openThing === i) {
		openThing = false
	} else {
		openThing = i
	}
}

let threshold = 1;
function handleScroll() {
	const thingEls = document.querySelectorAll(".thing");
	for (let i = 0; i < thingEls.length; i++) {
		const rect = thingEls[i].getBoundingClientRect();
		
		// Only push the element index if it's not already in the activeThings array
		if (rect.top <= threshold && rect.bottom >= threshold && !activeThings.includes(i)) {
			activeThings.push(i);
		}
		
		// Remove the element index if it's out of the viewport (check it is currently in activeThings)
		else if (rect.top > threshold) {
			const index = activeThings.indexOf(i);
			if (index !== -1) {
				activeThings.splice(index, 1); // Remove the index if it exists in the array
			}
		}
	}
}
</script>

<!-- <svelte:window onscroll={() => handleScroll()}></svelte:window> -->

<section class="folio-14 chess-board" style="--cols: {cols};">
	{#each Array(rows) as _, row}
		{#each Array(cols) as _, col}
			{#if (row + col) % 2 === 0}
				{#if index < data.things.length}
					{@const i = index}
					{@const thing = data.things[index]}
						<div
						class="thing"
						class:last={i === data.things.length-1 && i === openThing && thing.moreInfo}
						class:loading={!domLoaded}
						class:active={activeThings.includes(i)}
						class:open={openThing === i}
						ontouchend={(e) => {handleTap(i)}}
						style="--desktopColour: {data.colours.desktop[index % data.colours.desktop.length].hex}; --mobileColour: {data.colours.mobile[index % data.colours.mobile.length].hex}"
						>
							{#if thing.media[0]?.asset}
								<img class="media"
								src={urlFor(thing.media[0].asset).height(1920)}
								width={thing.media[0].info.metadata.dimensions.width}
								height={thing.media[0].info.metadata.dimensions.height}
								alt={thing.media[0].info.altText}>
							{:else}
								<video class="media" muted loop autoplay playsinline
								src={thing.media[0].mp4.asset.url}
								placeholder={thing.media[0].cover ? urlFor(thing.media[0].cover.asset).width(600) : ""}
								></video>
							{/if}
							<div class="thing-info-container difference">
								<div class="thing-info">
									<h2>{thing.title}</h2>
									{#if thing.description}<p>{thing.description}</p>{/if}
								</div>
								<div class="thing-cta">
									{#if thing.priceInfo}
									<p>
										{#if thing.linkPayPalUrl && thing.payPalUrl}
											<a class="buy-btn" href={thing.payPalUrl} target="_blank" rel="noopener noreferrer">{thing.priceInfo}</a>
										{:else}
											<span class="buy-btn">{thing.priceInfo}</span>
										{/if}
										{#if thing.showShipping}
											<span>+ shipping</span>
										{/if}
									</p>
									{/if}
									{#if innerWidth > 700}
										<a
										href="/things/{thing.slug.current}"
										onclick={(e) => toggler.toggleThing(e, thing.slug.current)} data-sveltekit-preload-data
										>More info</a>
									{:else if thing.moreInfo || thing.media.length > 1}
										<button ontouchstart={(e) => handleOpenThing(i)}>More info</button>
									{/if}
								</div>
							</div>
							{#if innerWidth < 700 && openThing === i && activeThings.includes(i)}
								<div class="swiper-container">
									<SwiperThingMobile media={thing.media}/>
								</div>
								{#if thing.moreInfo}
									<p class="moreInfo folio-18">{thing.moreInfo}</p>
								{/if}
							{/if}
						</div>
					{@html (() => { index++ })()}
				{/if}
			{:else}
				<div class="spacer"></div>
			{/if}
		{/each}
	{/each}
</section>

<style>
section {
	display: grid;
	width: 100vw;
	align-items: start;
	grid-template-columns: repeat(4, 1fr);
}
.thing {
	position: relative;
	width: 100%;
	height: auto;
	aspect-ratio: 2/3;
	overflow: hidden;
	background-color: var(--desktopColour);
	transition: var(--transition);
}
.thing .media {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: none;
}
.thing:not(.loading) .media {
	display: block;
}
.thing-info-container {
	position: absolute;
	top: 0;
	padding: var(--gutter);
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-end;
	gap: calc(var(--gutter)/2);
	display: none;
	width: 100%;
	height: 100%;
	backdrop-filter: blur(20px);
}
.thing-cta {
	width: 100%;
	display: flex;
	justify-content: space-between;
	mix-blend-mode: difference;
}
.buy-btn {
	color: var(--black);
	background-color: var(--white);
	padding: .1em .3em .2em;
	border-radius: .2em;
}
.swiper-container {
	position: absolute;
	top: 0;
	width: 100vw;
	/* aspect-ratio: 2/3; */
}
/* @media screen and (min-width: 1025px) {
	section {
		grid-template-columns: repeat(4, 1fr);
	}
}
@media screen and (min-width: 1281px) {
	section {
		grid-template-columns: repeat(5, 1fr);
	}
}
@media screen and (min-width: 1601px) {
	section {
		grid-template-columns: repeat(6, 1fr);
	}
} */
@media screen and (min-width: 701px) {
	.thing:hover .thing-info-container {
		display: flex;
	}
}
@media screen and (max-width: 700px) {
	section {
		grid-template-columns: repeat(1, 1fr);
	}
	.thing.open {
		overflow: visible;
		z-index: 2;
	}
	.thing.open .thing-info-container {
		height: calc(100% + 50vh);
	}
	.thing.open .thing-info, .thing.open .thing-cta {
		opacity: 0;
	}
	.thing.active .thing-info-container {
		display: flex;
	}
	.thing.last {
		margin-bottom: 50vh;
	}
	.moreInfo {
		position: absolute;
		bottom: 0;
		display: block;
		height: 50vh;
		width: 100%;
		transform: translateY(100%);
		padding: var(--gutter);
		backdrop-filter: blur(30px);
	}
}
</style>