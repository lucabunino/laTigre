<script>
// Data
let { data, children } = $props();

// Imports
import "../app.css";
import { dev } from '$app/environment';
import { page } from '$app/stores';
import { preloadData, pushState, goto } from '$app/navigation';
import { tick } from 'svelte';
import List from './archive/list/+page.svelte';
import Single from './archive/[slug]/+page.svelte';
import Studio from './studio/+page.svelte';
import Modal from '$lib/components/Modal.svelte';
import { urlFor } from '$lib/utils/image';
import { modalInOut, backgroundInOut, headerInOut, singleIn, singleOut } from '$lib/utils/transition.js';
import { getToggles  } from '$lib/stores/toggle.svelte.js';
let toggler = getToggles()
import { getCta  } from '$lib/stores/cta.svelte.js';
let ctaer = getCta()
import { getSlide  } from '$lib/stores/slide.svelte.js';
let slider = getSlide()

// Variables
let mouse = $state([])
let domLoaded = $state(false)
let innerWidth = $state(0)
let innerHeight = $state(0)
let modalWidth = $derived($page.state.listData ? "50%" : $page.state.studioData ? "75%" : $page.state.singleData ? "100%" : "auto")
let closeWidth = $derived($page.state.listData ? "50%" : $page.state.studioData ? "25%" : $page.state.singleData ? "0%" : "auto")

// Functions
function handleMousemove(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}

// Lifecycle
$effect.pre(async () => {
  if (!toggler.firstLoaded) {
    await toggler.setFirstLoaded(); 
  }
  console.log(toggler.firstLoaded);
  
  if (data.pathname === '/archive/list') {
    console.log("redirect list");
    await goto('/archive');
    domLoaded = true;    
    await tick();
    toggler.toggleList();
  } else if (data.pathname === '/studio') {
    console.log("redirect studio");

    await goto('/');
    domLoaded = true;
    await tick();
    toggler.toggleStudio();
  } else if (data.pathname.includes('/archive/')) {
    let slug = data.pathname
    console.log("redirect single");
    await goto('/');
    domLoaded = true;
    await tick();
    toggler.toggleSingle(null, slug);
  } else {
    domLoaded = true;
  }
});

// Dev
let viewGrid = $state(false)
const gridColumnsDesktop = 8
const gridColumnsMobile = 4
function handleKey({key}) {if (key === 'G' && dev) {viewGrid = !viewGrid}}
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
<!-- <p style="position: fixed; bottom:2em; left:0; z-index:99; background-color:#FFF;">Path: {$page.url.pathname} | Studio: {toggler.studio} | List: {toggler.list} | Single: {toggler.single}</p> -->
<header>
    <nav>
    {#if !toggler.single}
      <ul class="menu difference"
      in:headerInOut|global={{ duration: 250, delay: 0 }}
      out:headerInOut|global={{ duration: 250, delay: 0 }}
      >
        <li class="menu-item">
          <a href="/"
          onmouseenter={() => ctaer.setCta("")}
          onclick={(e) => {toggler.closeModal(false)}}
          >La Tigre</a>
        </li>
        <li class="menu-item">
          <a href="/studio"
          onmouseenter={() => ctaer.setCta("")}
          onclick={(e) => {toggler.toggleStudio(e)}} data-sveltekit-preload-data
          >Studio</a>
        </li>
        <li class="menu-item">
          <a href="/archive"
          onmouseenter={() => ctaer.setCta("")}
          onclick={(e) => {toggler.closeModal(false)}}
          >Archive</a>
          <a href="/archive/list"
          class="list-switch"
          onmouseenter={() => ctaer.setCta("")}
          onclick={(e) => {toggler.toggleList(e)}} data-sveltekit-preload-data
          class:crossed={toggler.list}
          class:off={$page.url.pathname !== "/archive" || toggler.studio || toggler.single }
          >
            <div style="position: relative; height:100%;">
              <div class="line"></div>
              <div class="line"></div>
              <div class="line"></div>
            </div>
          </a>
        </li>
        <li class="menu-item">
          <a href="/personal" onclick={(e) => {toggler.closeModal(false)}}>Personal</a>
        </li>
      </ul>
      {:else}
        <button class="close-btn difference"
        onclick={(e) => {toggler.closeModal(true); slider.setSlide(0)}}
        in:headerInOut|global={{ duration: 250, delay: 0 }}
        out:headerInOut|global={{ duration: 250, delay: 0 }}
        >Close</button>
      {/if}
    </nav>
</header>

{#if domLoaded}
  <main>
    {@render children()}
  </main>
{/if}

{#if domLoaded && toggler.list && $page.state.listData}
{#key $page.state.listData}
  <div class="background"
  in:backgroundInOut|global={{ duration: 250, delay: 0 }}
  out:backgroundInOut|global={{ duration: 250, delay: 750 }}
  >
    <div
    in:modalInOut|global={{ duration: 500, delay: 0 }}
    out:modalInOut|global={{ duration: 500, delay: 500}}
    >
      <Modal onclose={() => history.back()} width={modalWidth} bgWhite={true}>
          <List data={$page.state.listData}/>
      </Modal>
    </div>
    <div onclick={(e) => {toggler.closeModal(true)}} style="width: {closeWidth}"></div>
  </div>
{/key}
{/if}

{#if domLoaded && toggler.studio && $page.state.studioData}
{#key $page.state.studioData}
  <div class="background"
  in:backgroundInOut|global={{ duration: 250, delay: 0 }}
  out:backgroundInOut|global={{ duration: 250, delay: 750 }}
  >
    <div
    in:modalInOut|global={{ duration: 500, delay: 0 }}
    out:modalInOut|global={{ duration: 500, delay: 500}}
    >
      <Modal onclose={() => history.back()} width={modalWidth} bgWhite={true}>
        <Studio data={$page.state.studioData}/>
      </Modal>
    </div>
    <div onclick={(e) => {toggler.closeModal(true)}} style="width: {closeWidth}"></div>
  </div>
{/key}
{/if}

{#if domLoaded && toggler.single && $page.state.singleData}
{#key $page.state.singleData}
  <div class="background"
  in:backgroundInOut|global={{ duration: 250, delay: 0 }}
  out:backgroundInOut|global={{ duration: 250, delay: 750 }}
  >
    <div
    in:singleIn|global={{ duration: 500, delay: 0, fromRight: true }}
    out:singleOut|global={{ duration: 500, delay: 500, fromRight: true}}
    >
      <Modal onclose={() => history.back()} width={modalWidth} bgWhite={false}>
        <Single data={$page.state.singleData}/>
      </Modal>
    </div>
  </div>
  <div class="single-project-info difference"
  in:headerInOut|global={{ duration: 250, delay: 0 }}
  out:headerInOut|global={{ duration: 250, delay: 0 }}
  >
    <div>
      <h1>{$page.state.singleData.work[0].title}</h1>
      {#if $page.state.singleData.work[0].description}
        <p>{$page.state.singleData.work[0].description}</p>
      {/if}
      {#if $page.state.singleData.indexedMedia}
      <div class="single-project-indexes">
        {#each $page.state.singleData.indexedMedia as index, i}
          <button data-index={i} class:active={slider.slide === i} onclick={(e) => {slider.setSlide(i)}}>{index._mediaIndex}</button>
        {/each}
      </div>
      {/if}
    </div>
    <div>
      {#if $page.state.singleData.work[0].tags}
        <p>
          {#each $page.state.singleData.work[0].tags as tag, i}
            {tag.title}{#if i+1 < $page.state.singleData.work[0].tags.length}{@html ", "}{/if}
          {/each}
        </p>
      {:else}
        <p>Missing tag</p>
      {/if}
    </div>  
  </div>
{/key}
{/if}

<p id="cta" class="difference"
style={ctaer.cta === "" ? `-webkit-transform: translateX(${(mouse.x / innerWidth)*-100}%);-ms-transform: translateX(${(mouse.x / innerWidth)*-100}%);transform: translateX(${(mouse.x / innerWidth)*-100}%);left: ${mouse.x}px;top: ${mouse.y}px;` : `-webkit-transform: translateX(${(mouse.x / innerWidth)*-100}%);-ms-transform: translateX(${(mouse.x / innerWidth)*-100}%);transform: translateX(${(mouse.x / innerWidth)*-100}%);left: ${mouse.x}px;top: ${mouse.y}px;`}
class:visible={mouse.x}
>{ctaer.cta}</p>
  
<style>
/* Header */
.menu {
  padding: var(--gutter) 0;
  display: flex;
  align-items: flex-start;
  list-style: none;
  position: fixed;
  top: 0;
  left: 0;
  width: -webkit-fill-available;
  z-index: 4;
}
.menu-item {
  width: 100%;
  padding: 0 var(--gutter);
}
.menu-item:nth-child(3) {
  display: flex;
  align-items: flex-end;
  gap: .2em;
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

/* Modals */
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(30px);
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
  position: absolute;
  top: 50%;
  pointer-events: none;
  margin: 1em;
  visibility: hidden;
  text-wrap-mode: nowrap;
}
#cta.visible {
  visibility: visible;
}
.single-project-info {
  position: absolute;
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
}

/* Close */
.close-btn {
  position: fixed;
  right: var(--gutter);
  top: var(--gutter);
  z-index: 4;
}

/* Footer */
footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
footer div {
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-auto-flow: column;
  column-gap: var(--gutter);
}


@media screen and (max-width: 900px) {
  footer {
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 1em;
  }
  footer div {
    display: flex;
    flex-direction: column;
  }
  footer div>*:nth-child(even) {
    margin-bottom: 1.5em;
  }
}
</style>