<script>
import { urlFor } from "$lib/utils/image";
import { getToggles  } from '$lib/stores/toggle.svelte.js';
let toggler = getToggles()

let { data } = $props()

let cols = 4;
let totalItems = data.goods.length;
let totalSlots = totalItems * 2;
let rows = Math.ceil(totalSlots / cols);

var index = 0;
let domLoaded = $state(false);

let activeGoods = $state([])
$inspect(activeGoods)

$effect(() => {
  setTimeout(() => {
    domLoaded = true;
  }, 1000);
});

function handleTap(i) {
  if (activeGoods.includes(i)) {
    const index = activeGoods.indexOf(i);
    if (index !== -1) {
      activeGoods.splice(index, 1); // Remove the index if it exists in the array
    }
  } else {
    activeGoods = [];
    activeGoods.push(i)
  }
}

let threshold = 1;
function handleScroll() {
  const goodEls = document.querySelectorAll(".good");
  for (let i = 0; i < goodEls.length; i++) {
    const rect = goodEls[i].getBoundingClientRect();
    
    // Only push the element index if it's not already in the activeGoods array
    if (rect.top <= threshold && rect.bottom >= threshold && !activeGoods.includes(i)) {
      activeGoods.push(i);
    }
    
    // Remove the element index if it's out of the viewport (check it is currently in activeGoods)
    else if (rect.top > threshold) {
      const index = activeGoods.indexOf(i);
      if (index !== -1) {
        activeGoods.splice(index, 1); // Remove the index if it exists in the array
      }
    }
  }
}
</script>

<!-- <svelte:window onscroll={() => handleScroll()}></svelte:window> -->

<section class="folio-14 chess-board" style="--cols: {cols};">
  {#each Array(rows) as _, row}
    {#each Array(cols) as _, col}
      {#if (row + col) % 2 === 0}
        {#if index < data.goods.length}
          {@const i = index}
          {@const goods = data.goods[index]}
            <div
              class="good"
              class:loading={!domLoaded}
              class:active={activeGoods.includes(i)}
              ontouchend={(e) => {handleTap(i)}}
              style="--desktopColour: {data.colours.desktop[index % data.colours.desktop.length].hex}; --mobileColour: {data.colours.mobile[index % data.colours.mobile.length].hex}"
            >
              {#if goods.media[0]?.asset}
                <img class="media"
                src={urlFor(goods.media[0].asset).height(1080)}
                width={goods.media[0].info.metadata.dimensions.width}
                height={goods.media[0].info.metadata.dimensions.height}
                alt={goods.media[0].info.altText}>
              {:else}
                <video class="media" muted loop autoplay playsinline
                src={goods.media[0].mp4.asset.url}
                placeholder={goods.media[0].cover ? urlFor(goods.media[0].cover.asset).width(600) : ""}
                ></video>
              {/if}
              <div class="good-info-container">
                <div class="good-info">
                  <h2>{goods.title}</h2>
                  {#if goods.description}<p>{goods.description}</p>{/if}
                </div>
                <div class="good-cta">
                  {#if goods.priceInfo}
                  <p>
                    {#if goods.linkPayPalUrl && goods.payPalUrl}
                      <a class="buy-btn" href={goods.payPalUrl} target="_blank" rel="noopener noreferrer">{goods.priceInfo}</a>
                    {:else}
                      <span class="buy-btn">{goods.priceInfo}</span>
                    {/if}
                    {#if goods.showShipping}
                      <span>+ shipping</span>
                    {/if}
                  </p>
                  {/if}
                  <a
                  href="/goods/{goods.slug.current}"
                  onclick={(e) => toggler.toggleGood(e, goods.slug.current)} data-sveltekit-preload-data
                  >More info</a>
                </div>
              </div>
            </div>
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
  display: grid;
  width: 100vw;
  align-items: start;
  grid-template-columns: repeat(4, 1fr);
}
.good {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 2/3;
  overflow: hidden;
  background-color: var(--desktopColour);
}
.good .media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: none;
}
.good:not(.loading) .media {
  display: block;
}
.good-info-container {
  position: absolute;
  bottom: 0;
  padding: var(--gutter);
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: calc(var(--gutter)/2);
  display: none;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(20px);
}
.good-cta {
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
/* @media screen and (min-width: 1025px) {
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
} */
@media screen and (min-width: 701px) {
  .good:hover .good-info-container {
    display: flex;
  }
}
@media screen and (max-width: 700px) {
  section {
    grid-template-columns: repeat(1, 1fr);
  }
  .good.active .good-info-container {
    display: flex;
  }
}
</style>