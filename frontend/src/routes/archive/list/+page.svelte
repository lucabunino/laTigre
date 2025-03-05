<script>
// Imports
import { urlFor } from "$lib/utils/image";

// Variables
let { data } = $props()
let totalMedia = data.works.reduce((sum, work) => sum + (work.media?.length || 0), 0);
let remainingMedia = totalMedia;
let archiveColours = data.colours.archive
</script>

<ul>
  {#each data.works as work, i}
    {@const localIndex = data.works.length - i}
    <a class="folio-14 work-list"
    href="/archive/{work.slug.current}"
    style="--archiveColour: {archiveColours[localIndex % archiveColours.length].hex};"
    >
      <h2>{work.title}</h2>
      {#if work.tags}
        <p>
          {#each work.tags as tag, i}
            {tag.title}{#if i+1 < work.tags.length}{@html ", "}{/if}
          {/each}
        </p>
      {:else}
        <p>No tags</p>
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
        placeholder={work.media[0].cover ? urlFor(work.media[0].cover.asset).width(600) : ""}
        ></video>
      {/if}
    </a>
  {/each}
</ul>

<style>
ul {
  padding: calc(var(--gutter)*2 + 1.1em) var(--gutter) var(--gutter);
  overflow-y: scroll;
  height: 100%;
}
a {
  display: flex;
  justify-content: space-between;
  width: -webkit-fill-available;
  gap: var(--gutter);
}
a:hover {
  color: var(--archiveColour);
  transition-delay: 0s;
}
a:not(:hover) {
  transition-delay: 1000ms;
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
  width: calc((100% - calc(var(--gutter))*3)/2 + calc(var(--gutter))*1);
  height: auto;
  transform: translateX(-100%);
  display: none;
}
a:hover .media {
  display: block;
}
</style>