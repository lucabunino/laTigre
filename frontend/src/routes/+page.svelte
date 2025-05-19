<script>
// Imports
import Embla from "$lib/components/Embla.svelte"
import { urlFor } from '$lib/utils/image';
import { getToggles  } from '$lib/stores/toggle.svelte.js';
let toggler = getToggles()

// Variables
let { data } = $props()
let innerWidth = $state(0)
let innerHeight = $state(0)
</script>

<svelte:window bind:innerWidth bind:innerHeight></svelte:window>

{#if innerWidth > 700}
{#key data.projects}
  <Embla data={data}/>
{/key}
{:else}
{#each data.projects as project, i}
  <div class="project">
    <div class="project-title-container difference">
      <div class="project-title">
        <h2>{project.reference.title}</h2>
        {#if project.reference.description}
          <p>{project.reference.description}</p>
        {/if}
      </div>
    </div>
    {#if project.mobile}
      <img class="media"
      src={urlFor(project.mobile.asset).height(2200)}
      width={project.mobile.info.metadata.dimensions.width}
      height={project.mobile.info.metadata.dimensions.height}
      alt={project.mobile.info.altText}>
    {:else if project.desktop}
      <img class="media"
      src={urlFor(project.desktop.asset).height(2200)}
      width={project.desktop.info.metadata.dimensions.width}
      height={project.desktop.info.metadata.dimensions.height}
      alt={project.desktop.info.altText}>
    {:else if project.video}
      <video class="media" muted loop autoplay playsinline
      src={project.video.mp4.asset.url}
      placeholder={project.video.cover ? urlFor(project.video.cover.asset).height(2200) : ""}
      width={innerWidth}
      height={innerHeight}
      ></video>
    {/if}
  </div>
{/each}
{/if}



<style>
.project {
  position: relative;
  height: 85vh;
  display: block;
}
.media {
  width: 100%;
  height: 85vh;
  object-fit: cover;
}
.project-title-container {
  position: absolute;
  top: 0;
  height: 85vh;
  z-index: 2;
  width: 100%;
  display: flex;
  align-items: center;
}
.project-title {
  position: sticky;
  margin: var(--gutter);
  top: 40vh;
  z-index: 3;
}
</style>