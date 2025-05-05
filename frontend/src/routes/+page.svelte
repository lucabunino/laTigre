<script>
// Imports
import Swiper from "$lib/components/Swiper.svelte"
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
  <!-- <Swiper data={data}/> -->
  <Embla data={data}/>
{/key}
{:else}
{#each data.projects as project, i}
  <a class="project"
  onclick={(e) => {project.reference._type === "/personal" ? toggler.togglePersonal(e, project.reference.slug.current) : toggler.toggleWork(e, project.reference.slug.current)}} data-sveltekit-preload-data
  href="{project.reference._type === "/personal" ? "/personal" : "/archive"}/{project.reference.slug.current}"
  >
  <div class="project-title-container difference">
    <div class="project-title">
      <h3>{project.reference.title}</h3>
      {#if project.reference.tags}
        <p>
          {#each project.reference.tags as tag, i}
            {tag.title}{#if i+1 < project.reference.tags.length}{@html ", "}{/if}
          {/each}
        </p>
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
  </a>
{/each}
{/if}



<style>
.project {
  position: relative;
  height: 90vh;
  display: block;
}
.media {
  width: 100%;
  height: 90vh;
  object-fit: cover;
}
.project-title-container {
  position: absolute;
  top: 0;
  height: 90vh;
  z-index: 2;
  width: 100%;
  display: flex;
  align-items: center;
}
.project-title {
  position: sticky;
  margin: var(--gutter);
  top: 45vh;
  z-index: 3;
}
</style>