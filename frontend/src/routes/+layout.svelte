<script>
// Data
let { data, children } = $props();

// Imports
import "../app.css";
import { dev } from '$app/environment';
import { page } from '$app/stores';
import { preloadData, pushState, goto } from '$app/navigation';
import { tick } from 'svelte';
import List from './works/list/+page.svelte';
import Work from './works/[slug]/+page.svelte';
import Personal from './things/[slug]/+page.svelte';
import Info from './info/+page.svelte';
import Modal from '$lib/components/Modal.svelte';
import { urlFor } from '$lib/utils/image';
import { modalInOut, backgroundInOut, headerInOut, singleIn, singleOut } from '$lib/utils/transition.js';
import { blur } from 'svelte/transition';
import { getToggles	} from '$lib/stores/toggle.svelte.js';
let toggler = getToggles()
import { getCta	} from '$lib/stores/cta.svelte.js';
let ctaer = getCta()
import { getSlide	} from '$lib/stores/slide.svelte.js';
let slider = getSlide()

// Variables
let mouse = $state([])
let domLoaded = $state(false)
let innerWidth = $state(0)
let innerHeight = $state(0)
let modalWidth = $derived(innerWidth <= 700 ? "100%" : $page.state.listData ? "75%" : $page.state.infoData ? "50%" : $page.state.workData ? "100%" : $page.state.thingData ? "100%" : "auto")
let closeWidth = $derived(innerWidth <= 700 ? "0%" : $page.state.listData ? "25%" : $page.state.infoData ? "50%" : $page.state.workData ? "0%" : $page.state.thingData ? "0%" : "auto")

// Functions
function handleMousemove(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
}

let headerHover = $state(false)
function handleHoverMenu() {
	headerHover = !headerHover
}

// Lifecycle
$effect.pre(async () => {	
	if (data.pathname === '/works/list') {
		// console.log("redirect list");
		await goto('/works');
		domLoaded = true;		
		await tick();
		toggler.toggleList();
	} else if (data.pathname === '/info') {
		// console.log("redirect info");
		await goto('/');
		domLoaded = true;
		await tick();
		toggler.toggleInfo();
	} else if (data.pathname.includes('/works/')) {
		let slug = data.pathname
		// console.log("redirect work");
		await goto('/works');
		domLoaded = true;
		await tick();
		toggler.toggleWork(null, slug);
	} else if (data.pathname.includes('/things/')) {
		let slug = data.pathname
		// console.log("redirect work");
		await goto('/things');
		domLoaded = true;
		await tick();
		toggler.toggleThing(null, slug);
	} else {
		domLoaded = true;
	}
});

// Dev
let viewGrid = $state(false)
const gridColumnsDesktop = 8
const gridColumnsMobile = 4
function handleKey({ key }) {
	if (key === 'G' && dev) {
		viewGrid = !viewGrid;
	} else if ((key === 'Escape' || key === 'Esc') && (toggler.work || toggler.thing)) {
		toggler.closeModal(true, false);
		slider.setSlide(0);
	}
}
</script>

<svelte:window bind:innerWidth bind:innerHeight onkeyup={handleKey} onmousemove={handleMousemove}></svelte:window>

{#if viewGrid}
<div id="layout"
			style="grid-template-columns:repeat({innerWidth > 800 ? gridColumnsDesktop : gridColumnsMobile}, 1fr);pointer-events:none;display: grid;position:fixed; z-index:999;width: -moz-available;width: -webkit-fill-available;height: -moz-available;height: -webkit-fill-available;margin:0 var(--gutter);gap:var(--gutter);opacity:.2;">
	{#each Array(innerWidth > 800 ? gridColumnsDesktop : gridColumnsMobile) as _, i}
		<div style="background-color:red"></div>
	{/each}
</div>
{/if}

<svelte:head>
	{#if data.seo[0].SEOTitle}<title>{data.seo[0].SEOTitle}</title>{/if}
	{#if data.seo[0].SEODescription}<meta name="description" content={data.seo[0].SEODescription}>{/if}
	<link rel="canonical" href={$page.url}>
	<meta name="robots" content="index,follow">
	<meta name="googlebot" content="index,follow">
	{#if data.seo[0].SEOTitle}<meta property="og:title" content={data.seo[0].SEOTitle}>{/if}
	{#if data.seo[0].SEODescription}<meta property="og:description" content={data.seo[0].SEODescription}>{/if}
	{#if data.seo[0].SEOImage}<meta property="og:image" content={urlFor(data.seo[0].SEOImage).width(2000).url()}>{/if}
	<meta property="og:url" content={$page.url}>
	<meta property="og:type" content="website">
	{#if data.seo[0].SEOTitle}<meta property="og:site_name" content={data.seo[0].SEOTitle}>{/if}
</svelte:head>

<!-- svelte-ignore a11y_consider_explicit_label -->

{#if domLoaded}
{#key data.pathname}
	<main
	in:blur={{amount: 50, duration: 300, delay: 300}}
	out:blur={{amount: 50, duration: 300}}
	>
		{@render children()}
	</main>
{/key}
{/if}
<header>
		<nav>
		{#if !toggler.work && !toggler.thing}
			<ul class="menu" onmouseenter={() => ctaer.setCta("")}>
				<li class="menu-item difference" class:active={$page.url.pathname === "/"}
				in:headerInOut|global={{ duration: 250, delay: 0 }}
				out:headerInOut|global={{ duration: 250, delay: 0 }}
				style="--hoverColour: {data.colours.menu ? data.colours.menu[0 % data.colours.menu.length].hex : "red"};"
				>
					<a href="/"
					onclick={(e) => {toggler.closeModal(false, false)}}
					>LaTigre</a>
				</li>
				<li class="menu-item difference" class:active={$page.url.pathname.includes("/works") && (!toggler.info || toggler.thing) || toggler.work}
				in:headerInOut|global={{ duration: 250, delay: 0 }}
				out:headerInOut|global={{ duration: 250, delay: 0 }}
				style="--hoverColour: {data.colours.menu[0] ? data.colours.menu[1 % data.colours.menu.length].hex : "red"};"
				>
					<a href="/works"
					onclick={(e) => {toggler.closeModal(false, false)}}
					>Works</a>
					{#if innerWidth > 700}
						<a href="/works/list"
						class="list-switch"
						onclick={(e) => {toggler.toggleList(e)}} data-sveltekit-preload-data
						class:crossed={toggler.list}
						class:off={$page.url.pathname !== "/works" || toggler.info || toggler.work || toggler.thing }
						style="--hoverColour: {data.colours.menu[1] ? data.colours.menu[1 % data.colours.menu.length].hex : "red"};"
						>
							<div style="position: relative; height:100%;">
								<div class="line"></div>
								<div class="line"></div>
								<div class="line"></div>
							</div>
						</a>
					{/if}
				</li>
				<li class="menu-item difference" class:active={toggler.info}
				in:headerInOut|global={{ duration: 250, delay: 0 }}
				out:headerInOut|global={{ duration: 250, delay: 0 }}
				style="--hoverColour: {data.colours.menu[2] ? data.colours.menu[2 % data.colours.menu.length].hex : "red"};"
				>
					<a href="/info"
					onclick={(e) => {toggler.toggleInfo(e)}} data-sveltekit-preload-data
					>Info</a>
				</li>
				<li class="menu-item difference" class:active={$page.url.pathname.includes("/things") && (!toggler.info || toggler.work) || toggler.thing}
				in:headerInOut|global={{ duration: 250, delay: 0 }}
				out:headerInOut|global={{ duration: 250, delay: 0 }}
				style="--hoverColour: {data.colours.menu[3] ? data.colours.menu[3 % data.colours.menu.length].hex : "red"};"
				>
					<a href="/things"
					onclick={(e) => {toggler.closeModal(false, false)}}
					>Things</a>
				</li>
			</ul>
			{:else}
				<button class="close-btn difference"
				onclick={(e) => {toggler.closeModal(true, false); slider.setSlide(0)}}
				in:headerInOut|global={{ duration: 250, delay: 0 }}
				out:headerInOut|global={{ duration: 250, delay: 0 }}
				style="--hoverColour: {data.colours.menu[4] ? data.colours.menu[4 % data.colours.menu.length].hex : "red"};"
				>Close</button>
			{/if}
		</nav>
</header>

{#if domLoaded && toggler.list && $page.state.listData}
{#key $page.state.listData}
	<div class="background noise"
	onmouseover={() => ctaer.setCta("")} onfocus={() => ctaer.setCta("")}
	role="button"
	tabindex=0
	in:backgroundInOut|global={{ duration: 250, delay: 0 }}
	out:backgroundInOut|global={{ duration: 250, delay: 550 }}
	>
		<div
		in:modalInOut|global={{ duration: 300, delay: 0 }}
		out:modalInOut|global={{ duration: 300, delay: 300}}
		>
			<Modal onclose={() => history.back()} width={modalWidth} bgWhite={true}>
					<List data={$page.state.listData}/>
			</Modal>
		</div>
		<div style="width: {closeWidth}"
		onclick={(e) => {toggler.toggleList(e)}}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggler.toggleList(e)} role="button" tabindex=0
		></div>
	</div>
{/key}
{/if}

{#if domLoaded && toggler.info && $page.state.infoData}
{#key $page.state.infoData}
	<div class="background noise"
	onmouseover={() => ctaer.setCta("")} onfocus={() => ctaer.setCta("")}
	role="button" tabindex="0"
	in:backgroundInOut|global={{ duration: 250, delay: 0 }}
	out:backgroundInOut|global={{ duration: 250, delay: 550 }}
	>
		<div
		in:modalInOut|global={{ duration: 300, delay: 0 }}
		out:modalInOut|global={{ duration: 300, delay: 300}}
		>
			<Modal onclose={() => history.back()} width={modalWidth} bgWhite={true}>
				<Info data={$page.state.infoData}/>
			</Modal>
		</div>
		<div style="width: {closeWidth}"
		onclick={(e) => {toggler.closeModal(true, false)}}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggler.closeModal(true, false)} role="button" tabindex=0
		></div>
	</div>
{/key}
{/if}

{#if domLoaded && toggler.work && $page.state.workData}
{#key $page.state.workData}
	<div class="background noise no-cursor"
	in:backgroundInOut|global={{ duration: 250, delay: 0 }}
	out:backgroundInOut|global={{ duration: 250, delay: 750 }}
	>
		<div
		in:singleIn|global={{ duration: 500, delay: 0, fromRight: true }}
		out:singleOut|global={{ duration: 500, delay: 500, fromRight: true}}
		>
			<Modal onclose={() => history.back()} width={modalWidth} bgWhite={false}>
				<Work data={$page.state.workData}/>
			</Modal>
		</div>
	</div>
	<div class="single-project-info difference"
	in:headerInOut|global={{ duration: 250, delay: 0 }}
	out:headerInOut|global={{ duration: 250, delay: 0 }}
	>
		<div style="pointer-events: all;"
		onmouseover={() => ctaer.setCta("")} onfocus={() => ctaer.setCta("")}
		role="button" tabindex="0"
		>
			<h1>{$page.state.workData.work[0].title}</h1>
			{#if $page.state.workData.work[0].tags}
				<p>
					{#each $page.state.workData.work[0].tags as tag, i}
						{tag.title}{#if i+1 < $page.state.workData.work[0].tags.length}{@html ", "}{/if}
					{/each}
				</p>
			{:else}
				<p>Missing tag</p>
			{/if}
		</div>
		<div style="pointer-events: all;"
		onmouseover={() => ctaer.setCta("")} onfocus={() => ctaer.setCta("")}
		role="button" tabindex="0"
		>
			{#if $page.state.workData.indexedMedia}
			<div class="single-project-indexes">
				{#each $page.state.workData.indexedMedia as index, i}
					<button data-index={i} class:active={slider.slide === i} onclick={(e) => {slider.setSlide(i)}}>{index._mediaIndex}</button>
				{/each}
			</div>
			{/if}
			{#if $page.state.workData.work[0].description}
				<p>{$page.state.workData.work[0].description}</p>
			{/if}
		</div>
	</div>
{/key}
{/if}

{#if domLoaded && toggler.thing && $page.state.thingData}
{#key $page.state.thingData}
	<div class="background noise no-cursor"
	in:backgroundInOut|global={{ duration: 250, delay: 0 }}
	out:backgroundInOut|global={{ duration: 250, delay: 750 }}
	>
		<div
		in:singleIn|global={{ duration: 500, delay: 0, fromRight: true }}
		out:singleOut|global={{ duration: 500, delay: 500, fromRight: true}}
		>
			<Modal onclose={() => history.back()} width={modalWidth} bgWhite={false}>
				<Personal data={$page.state.thingData}/>
			</Modal>
		</div>
	</div>
	<div class="single-project-info difference"
	in:headerInOut|global={{ duration: 250, delay: 0 }}
	out:headerInOut|global={{ duration: 250, delay: 0 }}
	>
		<div style="pointer-events: all;"
		onmouseover={() => ctaer.setCta("")} onfocus={() => ctaer.setCta("")}
		role="button" tabindex="0"
		>
			<h1>{$page.state.thingData.thing[0].title}</h1>
			{#if $page.state.thingData.thing[0].tags}
				<p>
					{#each $page.state.thingData.thing[0].tags as tag, i}
						{tag.title}{#if i+1 < $page.state.thingData.thing[0].tags.length}{@html ", "}{/if}
					{/each}
				</p>
			{:else}
				<p>Missing tag</p>
			{/if}
		</div>
		<div style="pointer-events: all;"
		onmouseover={() => ctaer.setCta("")} onfocus={() => ctaer.setCta("")}
		role="button" tabindex="0"
		>
			{#if $page.state.thingData.indexedMedia}
			<div class="single-project-indexes">
				{#each $page.state.thingData.indexedMedia as index, i}
					<button data-index={i} class:active={slider.slide === i} onclick={(e) => {slider.setSlide(i)}}>{index._mediaIndex}</button>
				{/each}
			</div>
			{/if}
			{#if $page.state.thingData.thing[0].description}
				<p>{$page.state.thingData.thing[0].description}</p>
			{/if}
			{#if $page.state.thingData.thing[0].moreInfo}
				<p>{$page.state.thingData.thing[0].moreInfo}</p>
			{/if}
		</div>	
	</div>
{/key}
{/if}

<p id="cta" class="difference desktop-only"
style={ctaer.cta === "" ? `-webkit-transform: translateX(${(mouse.x / innerWidth)*-100}%);-ms-transform: translateX(${(mouse.x / innerWidth)*-100}%);transform: translateX(${(mouse.x / innerWidth)*-100}%);left: ${mouse.x}px;top: ${mouse.y}px;` : `-webkit-transform: translateX(${(mouse.x / innerWidth)*-100}%);-ms-transform: translateX(${(mouse.x / innerWidth)*-100}%);transform: translateX(${(mouse.x / innerWidth)*-100}%);left: ${mouse.x}px;top: ${mouse.y}px;`}
class:visible={mouse.x}
>{ctaer.cta}</p>
	
<style>
/* Header */
.menu {
	display: contents;
}
.menu-item {
	z-index: 4;
	position: fixed;
	top: 0;
	width: 100%;
	margin: var(--gutter) var(--gutter);
}
.menu-item:nth-child(1) {
	left: 0%;
}
.menu-item:nth-child(2) {
	left: 25%;
	display: flex;
	align-items: flex-end;
	gap: .2em;
}
.menu-item:nth-child(3) {
	left: 50%;
}
.menu-item:nth-child(4) {
	left: 75%;
}
.menu-item:hover {
	color: var(--hoverColour);
	mix-blend-mode: normal;
}
.menu-item:hover .line {
	background-color: var(--hoverColour);
}
.list-switch {
	width: 1em;
	height: .45em;
	cursor: pointer;
	z-index: 10;
	margin-bottom: .28em;
}
.list-switch.off .line {
	width: 0;
}
.list-switch .line:nth-child(1) { transition-delay: .05s; }
.list-switch .line:nth-child(2) { transition-delay: .10s; }
.list-switch .line:nth-child(3) { transition-delay: .15s; }
.line {
	width: 100%;
	height: clamp(1px, .1vw, 2px);
	height: 2px;
	background-color: var(--white);
	position: absolute;
	transition: var(--transition);
	transition-property: top, transform, transform-origin, width;
	transform-origin: center;
}
.line:nth-child(1) {top: 0;}
.line:nth-child(2) {top: 50%;}
.line:nth-child(3) {top: 100%;}
.list-switch.crossed .line:nth-child(1) {
	transform: rotate(20deg);
	top: 50%;
}
.list-switch.crossed .line:nth-child(2) {
	transform: scaleX(0);
}
.list-switch.crossed .line:nth-child(3) {
	transform: rotate(-20deg);
	top: 50%;
}
@media screen and (max-width: 700px) {
	.menu-item {
		width: auto;
	}
	.menu-item:nth-child(1) {
		left: 0%;
	}
	.menu-item:nth-child(2) {
		left: 30%;
	}
	.menu-item:nth-child(3) {
		left: unset;
		right: 30%;
	}
	.menu-item:nth-child(4) {
		left: unset;
		right: 0%;
	}
}
@media screen and (max-width: 360px) {
	.menu-item {
		width: 50%;
	}
	.menu-item:nth-child(1) {
		left: 0%;
		right: unset;
	}
	.menu-item:nth-child(2) {
		top: 1.5rem;
		left: 0%;
		right: unset;
	}
	.menu-item:nth-child(3) {
		left: 50%;
		right: unset;
	}
	.menu-item:nth-child(4) {
		top: 1.5rem;
		left: 50%;
		right: unset;
	}
}

/* Modals */
.background {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	backdrop-filter: blur(30px) saturate(5);
	z-index: 2;
}
.background>div:nth-child(1) {
	backdrop-filter: opacity(1);
}
.background>div:nth-child(2) {
	position: absolute;
	height: 100vh;
	cursor: pointer;
}
#cta {
	z-index: 2;
	position: fixed;
	top: 50%;
	pointer-events: none;
	visibility: hidden;
	text-wrap-mode: nowrap;
}
#cta.visible {
	visibility: visible;
}
.single-project-info {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 2;
	pointer-events: none;
	width: 100vw;
	height: 100vh;
	padding: var(--gutter);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.single-project-indexes {
	pointer-events: all;
	display: flex;
	gap: .3em;
}
.single-project-indexes button:hover,
.single-project-indexes button.active {
	text-decoration: underline;
	cursor: pointer;
	text-decoration-thickness: 1px;
	text-underline-offset: 2px;
}
@media screen and (max-width: 700px) {
	.background {
		backdrop-filter: blur(10px);
	}
}

/* Close */
.close-btn {
	position: fixed;
	right: var(--gutter);
	top: var(--gutter);
	z-index: 4;
}
.close-btn:hover {
	color: var(--hoverColour);
	mix-blend-mode: normal;
}
</style>