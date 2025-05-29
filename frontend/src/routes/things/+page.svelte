<script>
import { urlFor } from "$lib/utils/image";
import SwiperMobile from '$lib/components/SwiperMobile.svelte';
import Media from "$lib/components/Media.svelte"
import { getToggles	} from '$lib/stores/toggle.svelte.js';
let toggler = getToggles()
import { getCta	} from '$lib/stores/cta.svelte.js';
let ctaer = getCta()

let { data } = $props()

let cols = 4;
let totalItems = data.things.length;
let totalSlots = totalItems * 2;
let rows = Math.ceil(totalSlots / cols);

var index = 0;
let domLoaded = $state(false);

let activeThings = $state([])
$inspect(activeThings)
let openThing = $state(false)
$inspect(openThing)

let body = $state()

$effect(() => {
	setTimeout(() => {
		domLoaded = true;
	}, 1500);
	if (openThing === 0 || openThing > 0) {
		body.style.overflow = 'hidden';
	} else {
		body.style.overflow = '';
	}
});

function handleTap(i) {
	if (innerWidth < 700 && !activeThings.includes(i)) {
		// if (openThing != i || !openThing) {
			// if (activeThings.includes(i)) {
			// 	const index = activeThings.indexOf(i);
			// 	if (index !== -1) {
			// 		activeThings.splice(index, 1); // Remove the index if it exists in the array
			// 	}
			// } else {
				activeThings = [];
				activeThings.push(i)
				openThing = false
			// }	
		// }	
	}
}
function handleOpenThing(i, e) {
	if (e) {
		e.preventDefault()
	}
	if (openThing === i) {
		openThing = false
	} else {
		openThing = i
	}
}
function closeOpenThing() {
	openThing = false
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

<svelte:body bind:this={body}/>

<section class="folio-14 chess-board" style="--cols: {cols};">
	{#each Array(rows) as _, row}
		{#each Array(cols) as _, col}
			{#if (row + col) % 2 === 0}
				{#if index < data.things.length}
					{@const i = index}
					{@const thing = data.things[index]}
						<div
						class="thing"
						class:last={i === data.things.length-1 && i === openThing}
						class:loading={!domLoaded}
						class:active={activeThings.includes(i)}
						class:open={openThing === i}
						onclick={(e) => {handleTap(i)}}
						style="--desktopColour: {data.colours.desktop[index % data.colours.desktop.length].hex}; --mobileColour: {data.colours.mobile[index % data.colours.mobile.length].hex}"
						>
							<a
							class="thing-link"
							href="/things/{thing.slug.current}"
							onclick={(e) => {innerWidth > 700 ? toggler.toggleThing(e, thing.slug.current) : handleOpenThing(i, e);}} data-sveltekit-preload-data
							onmouseover={() => ctaer.setCta('More info')} onfocus={() => ctaer.setCta("More info")} aria-label="More info"
							onmouseleave={() => ctaer.setCta('')}
							>
								{#if thing.media[0]?.asset}
									<Media media={thing.media[0]}
									className="things-media"
									resolution={1920}
									width={thing.media[0].info?.metadata.dimensions.width}
									height={thing.media[0].info?.metadata.dimensions.height}
									delay={1500 + i*30}
									/>
								{:else}
									<Media media={thing.media[0]}
									className="things-media"
									resolution={1920}
									width={thing.media[0].info?.metadata.dimensions.width}
									height={thing.media[0].info?.metadata.dimensions.height}
									video={true}
									delay={1500 + i*30}
									/>
								{/if}
							</a>
							<div class="thing-info-container noise">
								<div class="thing-info">
									<h2>{thing.title}</h2>
									{#if thing.description}<p>{thing.description}</p>{/if}
								</div>
								<div class="thing-cta">
									{#if thing.priceInfo}
									<p>
										{#if thing.linkExternalUrl && thing.externalUrl}
											<a class="buy-btn" href={thing.externalUrl} target="_blank" rel="noopener noreferrer">{thing.priceInfo}</a>
										{:else}
											<span class="buy-btn">{thing.priceInfo}</span>
										{/if}
										{#if thing.showShipping}
											<span>+ shipping</span>
										{/if}
									</p>
									{/if}
									{#if innerWidth <= 700 && thing.media.length > 1}
										<span>More images</span>
									{/if}
								</div>
							</div>
						</div>
						{#if innerWidth < 700 && openThing === i && activeThings.includes(i)}
							<div class="swiper-container">
								<SwiperMobile media={thing.media}/>
								<button class="close-btn difference"
								onclick={(e) => {closeOpenThing()}}
								>Close</button>
							</div>
						{/if}
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
	display: -ms-grid;
	display: grid;
	width: 100vw;
	-webkit-box-align: start;
	    -ms-flex-align: start;
	        align-items: start;
	-ms-grid-columns: (1fr)[4];
	grid-template-columns: repeat(4, 1fr);
}
.thing {
	position: relative;
	width: 100%;
	height: auto;
	aspect-ratio: 2/3;
	overflow: hidden;
	background-color: var(--desktopColour);
	-webkit-transition: var(--transition);
	-o-transition: var(--transition);
	transition: var(--transition);
}
.thing:not(.loading) {
	background-color: var(--white);
}
.thing-info-container {
	position: absolute;
	top: 0;
	padding: var(--gutter);
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	    -ms-flex-direction: column;
	        flex-direction: column;
	-webkit-box-align: start;
	    -ms-flex-align: start;
	        align-items: flex-start;
	-webkit-box-pack: end;
	    -ms-flex-pack: end;
	        justify-content: flex-end;
	gap: calc(var(--gutter)/2);
	display: none;
	width: 100%;
	height: 100%;
	-webkit-backdrop-filter: blur(30px) saturate(3);
	        backdrop-filter: blur(30px) saturate(3);
	pointer-events: none;
}
@media screen and (min-width: 701px) {
	.thing-link {
		cursor: none;
	}
}
.thing-info {
	width: 100%;
}
.thing-cta {
	width: 100%;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-pack: justify;
	    -ms-flex-pack: justify;
	        justify-content: space-between;
}
.buy-btn {
	color: var(--black);
	background-color: var(--white);
	padding: .1em .3em .2em;
	border-radius: .2em;
	pointer-events: all;
}
a.buy-btn:hover {
	color: var(--white);
	background-color: var(--black);
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
@media screen and (min-width: 701px) {
	.thing:not(.loading):hover .thing-info-container {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
	}
}
@media screen and (max-width: 700px) {
	section {
		-ms-grid-columns: (1fr)[1];
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
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
	}
	.thing.last {
		margin-bottom: 50vh;
	}
}
</style>