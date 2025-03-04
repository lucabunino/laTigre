<script>
// Data
let { data, children } = $props();
$inspect(data)

// Imports
import "../app.css";
import { dev } from '$app/environment';
import { page } from '$app/stores';
import { preloadData, pushState, goto } from '$app/navigation';
import { tick } from 'svelte';
import Archive from './archive/+page.svelte';
import ArchiveList from './archive/list/+page.svelte';
import Studio from './studio/+page.svelte';
import Modal from '$lib/components/Modal.svelte';

// Variables
let domLoaded = $state(false)
let innerWidth = $state(0)
let innerHeight = $state(0)
let listOpen = $state(false)
let studioOpen = $state(false)
let modalWidth = $derived($page.state.archiveData
    ? "calc((100% - calc(var(--gutter))*5)/2 + calc(var(--gutter))*3);"
    : $page.state.studioData
    ? "calc((100% - calc(var(--gutter))*5)/4*3 + calc(var(--gutter))*4);"
    : "auto")
    $inspect(modalWidth)

// Functions
async function openArchiveList(e) {
  studioOpen = false
  listOpen = true
  let href;
  if (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    href = e.currentTarget;
  } else {
    href = '/archive/list'
  }
  const result = await preloadData(href);
  if (result.type === 'loaded' && result.status === 200) {
    pushState(href, { archiveData: result.data });
  } else {
    goto(href);
  }
}
async function closeArchiveList() {
  listOpen = false
  history.back()
}
async function openStudio(e) {
  listOpen = false
  studioOpen = true
  let href;
  if (e) {
    // Ignore if opening in new tab/window
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault(); // Prevent full navigation
    href = e.currentTarget;
  } else {
    href = '/studio'
  }
  
  // Preload data from /archive
  const result = await preloadData(href);
  
  if (result.type === 'loaded' && result.status === 200) {
    pushState(href, { studioData: result.data });
  } else {
    // If something goes wrong, navigate normally
    goto(href);
  }
}
async function closeModal(back) {
  listOpen = false
  studioOpen = false
  if (back) {
    history.back()
  }
}

// Lifecycle
$effect.pre(async () => {
  if (data.pathname === '/archive/list') {    
    await goto('/');
    domLoaded = true;
    await tick();
    openArchiveList();
  } else if (data.pathname === '/studio') {    
    await goto('/');
    domLoaded = true;
    await tick();
    openStudio();
  } else {
    domLoaded = true;
  }
});

let viewGrid = $state(false)
const gridColumnsDesktop = 8
const gridColumnsMobile = 4
function handleKey({key}) {if (key === 'G' && dev) {viewGrid = !viewGrid}}
</script>

<svelte:window bind:innerWidth bind:innerHeight onkeyup={handleKey}></svelte:window>

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

<header>
  <nav>
    <ul class="menu difference">
      <li class="menu-item"><a href="/" onclick={() => closeModal(false)}>La Tigre</a></li>
      <li class="menu-item">
        {#if !studioOpen}
          <a href="/studio" onclick={openStudio} data-sveltekit-preload-data>Studio</a>
        {:else}
          <button onclick={() => closeModal(true)}>Studio</button> 
        {/if}
      </li>
      <li class="menu-item"><a href="/archive" onclick={() => closeModal(false)}>Archive</a>
        {#if $page.url.pathname === "/archive" && !listOpen && !studioOpen}
          <a href="/archive/list" onclick={openArchiveList} data-sveltekit-preload-data>List</a>
        {:else if $page.url.pathname === "/archive" && listOpen && !studioOpen}
          <button onclick={() => closeModal(true)}>Close</button> 
        {/if}
      </li>
      <li class="menu-item" onclick={() => closeModal(false)}><a href="/personal">Personal</a></li>
    </ul>
  </nav>
</header>

{#if domLoaded}
  <main>
    {@render children()}
  </main>
{/if}

{#if domLoaded && ($page.state.archiveData || $page.state.studioData)}
	<Modal onclose={() => history.back()} width={modalWidth}>
      {#if listOpen &&  $page.state.archiveData}
        <ArchiveList data={$page.state.archiveData}/>
      {/if}
      {#if studioOpen && $page.state.studioData}
        <Studio data={$page.state.studioData}/>
      {/if}
	</Modal>
{/if}
  
<style>
.menu {
  padding: var(--gutter);
  display: flex;
  gap: var(--gutter);
  align-items: flex-start;
  list-style: none;
  position: fixed;
  top: 0;
  left: 0;
  width: -webkit-fill-available;
  z-index: 3;
}
.menu-item {
  width: 100%;
}
svg {
  width: 7vw;
  fill: var(--black);
}
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
  svg {
    width: 6rem;
  }
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