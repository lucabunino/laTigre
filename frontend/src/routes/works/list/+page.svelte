<script>
// Imports
import { urlFor } from "$lib/utils/image";
import { listInOut } from '$lib/utils/transition.js';
import { getToggles  } from '$lib/stores/toggle.svelte.js';
import Media from "$lib/components/Media.svelte"
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
let body = $state()

$effect(() => {
  domLoaded = true;
  body.style.overflow = 'hidden';
  return(() => {
	body.style.overflow = '';
  })
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

<svelte:body bind:this={body}/>

<div onwheel={(e) => { e.stopPropagation()}}
style={`--hoverColor: ${hoverColor}; --activeColor: ${activeColor}`}
>
  <ul class="tags" bind:clientHeight={tagsHeight}>
    {#each data.tags as tag, i}
    {#if domLoaded}
      <li>
        <button class="tag"
        style={`--tagColor: ${tag.colour.hex}`}
        in:listInOut|global={{ duration: 10, delay: 300+i*50}}
        out:listInOut|global={{ duration: 10, delay: data.tags.length*50 - i*50}}
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
        in:listInOut|global={{ duration: 10, delay: 300+i*7}}
        out:listInOut|global={{ duration: 10, delay: i*7}}
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
		  	<Media media={work.media[0]}
			className="list-works-media"
			resolution={1080}
			width={work.media[0].info?.metadata.dimensions.width}
			height={work.media[0].info?.metadata.dimensions.height}
			/>
          {:else}
		  	<Media media={work.media[0]}
			className="list-works-media"
			resolution={1080}
			width={work.media[0].info?.metadata.dimensions.width}
			height={work.media[0].info?.metadata.dimensions.height}
			video={true}
			/>
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
.work:visited {
	color: #9e9e9e;
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
</style>