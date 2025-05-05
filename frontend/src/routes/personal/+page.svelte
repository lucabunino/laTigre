<script>
  import { urlFor } from "$lib/utils/image";
  import { getToggles  } from '$lib/stores/toggle.svelte.js';
  let toggler = getToggles()

  let { data } = $props()

  let cols = 4;
  let totalItems = data.personals.length;
  let totalSlots = totalItems * 2;
  let rows = Math.ceil(totalSlots / cols);

  let index = 0;
  let domLoaded = $state(false);

  $effect(() => {
    setTimeout(() => {
      domLoaded = true;
    }, 1000);
  });
</script>

<section class="folio-14 chess-board" style="--cols: {cols};">
  {#each Array(rows) as _, row}
    {#each Array(cols) as _, col}
      {#if (row + col) % 2 === 0}
        {#if index < data.personals.length}
          {@const personal = data.personals[index]}
            <div
              class="personal"
              class:loading={!domLoaded}
              style="--desktopColour: {data.colours.desktop[index % data.colours.desktop.length].hex}; --mobileColour: {data.colours.mobile[index % data.colours.mobile.length].hex}"
            >
              {#if personal.media[0]?.asset}
                <img class="media"
                src={urlFor(personal.media[0].asset).height(1080)}
                width={personal.media[0].info.metadata.dimensions.width}
                height={personal.media[0].info.metadata.dimensions.height}
                alt={personal.media[0].info.altText}>
              {:else}
                <video class="media" muted loop autoplay playsinline
                src={personal.media[0].mp4.asset.url}
                placeholder={personal.media[0].cover ? urlFor(personal.media[0].cover.asset).width(600) : ""}
                ></video>
              {/if}
              <div class="personal-info-container">
                <div class="personal-info">
                  <h2>{personal.title}</h2>
                  {#if personal.description}<p>{personal.description}</p>{/if}
                </div>
                <div class="personal-cta">
                  {#if personal.priceInfo}
                  <p>
                    {#if personal.linkPayPalUrl && personal.payPalUrl}
                      <a class="buy-btn" href={personal.payPalUrl} target="_blank" rel="noopener noreferrer">{personal.priceInfo}</a>
                    {:else}
                      <p class="buy-btn">{personal.priceInfo}</p>
                    {/if}
                    {#if personal.showShipping}
                      <span>+ shipping</span>
                    {/if}
                  </p>
                  {/if}
                  <a
                  href="/personal/{personal.slug.current}"
                  onclick={(e) => toggler.togglePersonal(e, personal.slug.current)} data-sveltekit-preload-data
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
.personal {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 2/3;
  overflow: hidden;
  background-color: var(--desktopColour);
}
.personal .media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: none;
}
.personal:not(.loading) .media {
  display: block;
}
.personal-info-container {
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
</style>