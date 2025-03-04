<script>
// Data
let { data } = $props()

// Imports
import { urlFor } from "$lib/utils/image";

// Variables
let totalmedia = data.works.reduce((sum, work) => sum + (work.media?.length || 0), 0);
let remainingmedia = totalmedia+1;
let index = 1;
let domLoaded = $state(false);
let innerWidth = $state(0)
let innerHeight = $state(0)
let cols = $derived(() => {
  if (innerWidth > 1600) return 10;
  if (innerWidth > 1280) return 9;
  if (innerWidth > 1024) return 8;
  return 7; // Default value for smaller screens
});
let desktopColours = data.colours.desktop
let mobileColours = data.colours.mobile

// Functions
function handleMouseover(e) {
  e.target.classList.toggle("on")
}

// Lifecycle
$effect(() => {
  setTimeout(() => {
    domLoaded = true;
  }, 1000);
})
</script>

<svelte:window bind:innerWidth bind:innerHeight></svelte:window>

<section class="folio-14">
  {#each data.works as work, i}
    {#each work.media as image, j}
    {@const localIndex = index}
    {@const col = (localIndex - 1) % cols()}
    {@const row = Math.floor((localIndex - 1) / cols())}
      <a class="work"
      href="/archive/{work.slug.current}"
      data-index={localIndex}
      onmouseenter={(e) => handleMouseover(e)}
      class:loading={!domLoaded}
      class:on={(row % 2 === 0 && col % 2 === 0) || (row % 2 !== 0 && col % 2 !== 0)}
      style="--desktopColour: {desktopColours[localIndex % desktopColours.length].hex}; --mobileColour: {mobileColours[localIndex % mobileColours.length].hex}"
      >
        <img src={urlFor(image)} alt="">
        <div class="work-info-container">
          <div class="work-info">
            <h2>{work.title}</h2>
            {#if work.tags}
              <p>
                {#each work.tags as tag, i}
                  {tag.title}{#if i+1 < work.tags.length}{@html ", "}{/if}
                {/each}
              </p>
            {/if}
          </div>
          <p class="index">{(remainingmedia -= 1).toString().padStart(3, '0')}</p>
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
}
.work {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 2/3;
  overflow: hidden;
}
.work.on {
  background-color: var(--desktopColour);
}
.work img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: none;
}
.work.on:not(.loading) img {
  display: block;
}
.work-info-container {
  position: absolute;
  bottom: 0;
  padding: var(--gutter);
  align-items: flex-end;
  justify-content: flex-end;
  gap: calc(var(--gutter)/2);
  display: flex;
  width: 100%;
}
.work.on .index {
  display: none;
}
.work .work-info {
  display: none;
}
.work:not(.on):hover .work-info {
  display: block;
}
@media screen and (min-width: 1025px) {
  section {
    grid-template-columns: repeat(8, 1fr);
  }
}
@media screen and (min-width: 1281px) {
  section {
    grid-template-columns: repeat(9, 1fr);
  }
}
@media screen and (min-width: 1601px) {
  section {
    grid-template-columns: repeat(10, 1fr);
  }
}
</style>