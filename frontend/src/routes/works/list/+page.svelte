<script>
// Imports
import { urlFor } from "$lib/utils/image";
import { listInOut } from '$lib/utils/transition.js';
import { getToggles  } from '$lib/stores/toggle.svelte.js';
let toggler = getToggles()

// Variables
let { data } = $props()
let totalMedia = data.works.reduce((sum, work) => sum + (work.media?.length || 0), 0);
var remainingMedia = totalMedia;
let domLoaded = $state(false);
let tagsHeight = $state();

let activeTags = $state(new Map());
let activeColor = $state()

let hoverTags = $state([]);
let hoverColor = $state()

$effect(() => {
  domLoaded = true;
})

function handleTagEnter(slug, color) {
  if (!hoverTags.includes(slug)) {
    hoverTags.push(slug)
    hoverColor = color
  }
}
function handleTagLeave(slug) {
  const index = hoverTags.indexOf(slug);
  if (index > -1) {
    hoverTags.splice(index, 1);
    hoverColor = null
  }
}
function handleTagClick(slug, color) {
  if (activeTags.has(slug)) {
    activeTags.delete(slug);
  } else {
    activeTags.set(slug, color);
  }
  activeTags = new Map(activeTags);
}

function activeColorFor(work) {
  return work.tags?.find(t => activeTags.has(t.slug.current))
         ?.colour.hex;
}
</script>

<svelte:window onwheel|nonpassive={(e) => {e.preventDefault()}}/>

<div onwheel={(e) => { e.stopPropagation()}}
style={`--hoverColor: ${hoverColor}; --activeColor: ${activeColor}`}
>
  <ul class="tags" bind:clientHeight={tagsHeight}>
    {#each data.tags as tag, i}
    {#if domLoaded}
      <li>
        <button class="tag"
        style={`--tagColor: ${tag.colour.hex}`}
        in:listInOut|global={{ duration: 10, delay: 500+i*10}}
        out:listInOut|global={{ duration: 10, delay: i*10}}
        onclick={() => {handleTagClick(tag.slug.current, tag.colour.hex)}}
        onmouseenter={() => {handleTagEnter(tag.slug.current, tag.colour.hex)}}
        onmouseleave={() => {handleTagLeave(tag.slug.current)}}
        class:active={activeTags.has(tag.slug.current)}
        class:hover={hoverTags.includes(tag.slug.current)}
        >{tag.title}<sup>{tag.amount}</sup></button>
      </li>
    {/if}
    {/each}
  </ul>
  <ul class="list" style="padding-top: {tagsHeight}px;">
    {#each data.works as work, i}
      {@const localIndex = data.works.length - i}
      {#if domLoaded}
      <li>
        <a class="folio-14 work"
        href="/works/{work.slug.current}"
        data-tags={work.tags ? work.tags.map(tag => tag.slug.current).join(',') : ''}
        in:listInOut|global={{ duration: 10, delay: 500+i*10}}
        out:listInOut|global={{ duration: 10, delay: i*10}}
        onclick={(e) => toggler.toggleWork(e, work.slug.current)} data-sveltekit-preload-data
        class:active={work.tags?.some(tag => activeTags.has(tag.slug.current))}
        class:hover={work.tags?.some(tag => hoverTags.includes(tag.slug.current))}
        style={`--listColor: ${work.tags[0]?.colour.hex}; --workActive: ${activeColorFor(work)};`}
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
.tag.hover,
.tag.active {
  color: var(--tagColor)
}
.list {
  padding: 0 var(--gutter) var(--gutter);
  overflow-y: scroll;
  height: 100%;
  position: absolute;
  top: 0;
  width: 100%;
}
.work {
  display: flex;
  justify-content: space-between;
  width: -webkit-fill-available;
  gap: var(--gutter);
}
.work.active {
  color: var(--activeColor);
  color: var(--workActive);
  transition-property: opacity;
  transition-delay: 0s;
}
.work.hover {
  color: var(--hoverColor);
  transition-property: opacity;
  transition-delay: 0s;
}
.work:hover {
  color: var(--listColor);
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
  width: calc(100%/12*3);
}
a>*:nth-child(2) {
  width: calc(100%/12*9);
}
a>*:nth-child(3) {
  width: calc(100%/12*1);
  text-align: right;
}
.media {
  position: fixed;
  left: 0;
  top: 0;
  width: 25%;
  height: auto;
  display: none;
}
a:hover .media {
  display: block;
}
</style>