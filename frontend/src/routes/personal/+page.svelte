<script>
// Data
let { data } = $props()

// Imports
import { urlFor } from "$lib/utils/image";

// Variables
let index = 1;
let domLoaded = $state(false);
let innerWidth = $state(0)
let innerHeight = $state(0)
let cols = $derived(() => {
  if (innerWidth > 1600) return 6;
  if (innerWidth > 1280) return 5;
  if (innerWidth > 1024) return 4;
  return 3; // Default value for smaller screens
});
let desktopColours = data.colours.desktop
let mobileColours = data.colours.mobile

// Lifecycle
$effect(() => {
  setTimeout(() => {
    domLoaded = true;
  }, 1000);
})
</script>

<svelte:window bind:innerWidth bind:innerHeight></svelte:window>

<section class="folio-14">
  {#each data.personals as personal, i}
    {@const localIndex = index}
    {@const col = (localIndex - 1) % cols()}
    {@const row = Math.floor((localIndex - 1) / cols())}
    <div class="personal"
    class:loading={!domLoaded}
    style="--desktopColour: {desktopColours[localIndex % desktopColours.length].hex}; --mobileColour: {mobileColours[localIndex % mobileColours.length].hex}"
    >
      <img src={urlFor(personal.media[0])} alt="">
      <div class="personal-info-container">
        <div class="personal-info">
          <h2>{personal.title}</h2>
          {#if personal.description}<p>{personal.description}</p>{/if}
        </div>
        <div class="personal-cta">
          {#if personal.price && personal.payPalUrl}<p><a class="buy-btn" href={personal.payPalUrl} target="_blank" rel="noopener noreferrer">Buy €{personal.price}</a> + shipping</p>{/if}
          <a href="/personal/{personal.slug.current}">More info</a>
        </div>
      </div>
    </div>
    {(() => {index++})()}
  {/each}
</section>

<style>
section {
  display: grid;
  width: 100vw;
  align-items: start;
}
.personal {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 2/3;
  overflow: hidden;
  background-color: var(--desktopColour);
}
.personal img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: none;
}
.personal:not(.loading) img {
  display: block;
}
.personal-info-container {
  position: absolute;
  bottom: 0;
  padding: var(--gutter);
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  gap: calc(var(--gutter)/2);
  display: none;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(20px);
}
.personal:hover .personal-info-container {
  display: flex;
}
.personal-cta {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.buy-btn {
  color: var(--white);
  background-color: var(--black);
  padding: .1em .3em .2em;
  border-radius: .2em;
}
@media screen and (min-width: 1025px) {
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
}
</style>