<script>
// Imports
import { urlFor } from "$lib/utils/image";
import { listInOut } from '$lib/utils/transition.js';
import { getToggles  } from '$lib/stores/toggle.svelte.js';
let toggler = getToggles()

// Variables
let { data } = $props()
let totalMedia = data.works.reduce((sum, work) => sum + (work.media?.length || 0), 0);
let remainingMedia = totalMedia;
let domLoaded = $state(false);
let tagHover = $state();
let tagsHeight = $state();
let activeColour = $state();

$effect(() => {
  domLoaded = true;
})

function handleTagHover(slug, colour) {
  activeColour = colour
  tagHover = slug
}
</script>

<svelte:window on:wheel|nonpassive|preventDefault />

<div onwheel={(e) => { e.stopPropagation()}}>
<ul class="tags" bind:clientHeight={tagsHeight}>
  {#each data.tags as tag, i}
  {#if domLoaded}
    <li>
      <button
      style={`--tagColour: ${tag.colour.hex}`}
      onmouseenter={() => {handleTagHover(tag.slug.current, tag.colour)}}
      onmouseleave={() => {handleTagHover(null, null)}}
      in:listInOut|global={{ duration: 10, delay: 500+i*10}}
      out:listInOut|global={{ duration: 10, delay: i*10}}
      >{tag.title}<sup>{tag.amount}</sup></button>
    </li>
  {/if}
  {/each}
</ul>
<ul class="list" style="padding-top: {tagsHeight}px; --activeColour: {activeColour ? activeColour.hex : ""}">
  {#each data.works as work, i}
    {@const localIndex = data.works.length - i}
    {#if domLoaded}
    <li>
      <a class="folio-14 work-list"
      data-tags={work.tags ? work.tags.map(tag => tag.slug.current).join(',') : ''}
      class:active={work.tags ? work.tags.some(tag => tag.slug.current === tagHover) : ''}
      in:listInOut|global={{ duration: 10, delay: 500+i*10}}
      out:listInOut|global={{ duration: 10, delay: i*10}}
      href="/archive/{work.slug.current}"
      onclick={(e) => toggler.toggleWork(e, work.slug.current)} data-sveltekit-preload-data
      style={work.tags ? `--listColour: ${work.tags[0].colour.hex};` : `--listColour: #999;`}
      >
        <h2>{work.title}</h2>
        {#if work.description}
          <p>
            {work.description}
          </p>
        {:else}
          <p>No description</p>
        {/if}
        <p>{#if (remainingMedia - work.media?.length)+1 < remainingMedia}{remainingMedia.toString().padStart(3, '0')}–{/if}{((remainingMedia -= work.media?.length) + 1).toString().padStart(3, '0')}</p>
        {#if work.media[0]?.asset}
          <img class="media"
          src={urlFor(work.media[0].asset).height(1080)}
          width={work.media[0].info.metadata.dimensions.width}
          height={work.media[0].info.metadata.dimensions.height}
          alt={work.media[0].info.altText}>
        {:else}
          <video class="media" muted loop autoplay playsinline
          src={work.media[0].mp4.asset.url}
          placeholder={work.media[0].cover ? urlFor(work.media[0].cover.asset).width(500) : ""}
          ></video>
        {/if}
      </a>
    </li>
    {/if}
  {/each}
</ul>
</div>

<style>
.tags {
  padding: calc(var(--gutter)*2 + .7em) var(--gutter) var(--gutter);
  display: flex;
  column-gap: .2em;
  flex-wrap: wrap;
  z-index: 2;
  position: relative;
}
.tags sup {
  font-size: .5em;
}
.tags button:hover {
  color: var(--tagColour)
}
.list {
  padding: 0 var(--gutter) var(--gutter);
  overflow-y: scroll;
  height: 100%;
  position: absolute;
  top: 0;
  width: 100%;
}
a {
  display: flex;
  justify-content: space-between;
  width: -webkit-fill-available;
  gap: var(--gutter);
}
a:hover {
  color: var(--listColour);
  transition-property: opacity;
  transition-delay: 0s;
}
a.active {
  color: var(--activeColour);
  transition-property: opacity;
  transition-delay: 0s;
}
a:not(:hover) {
  transition-delay: 500ms;
}
a>* {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
a>*:nth-child(1) {
  width: calc(100%/6*2);
}
a>*:nth-child(2) {
  width: calc(100%/6*3);
}
a>*:nth-child(3) {
  width: calc(100%/6*1);
  text-align: right;
}
.media {
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  height: auto;
  transform: translateX(-100%);
  display: none;
}
a:hover .media {
  display: block;
}
</style>