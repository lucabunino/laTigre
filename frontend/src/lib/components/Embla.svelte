<script>
  // Props
  let { data } = $props();

  // Embla imports & setup
  import emblaCarouselSvelte from 'embla-carousel-svelte';
  let emblaApi;
  let options = { loop: true, align: 'start', duration: 15, dragFree: false, skipSnaps: false };

  // Navigation functions
  function scrollNext() {
    emblaApi?.scrollNext();
  }
  function scrollPrev() {
    emblaApi?.scrollPrev();
  }

  // Init handler: grab API and listen for selection changes
  function onInit(event) {
    emblaApi = event.detail;
    emblaApi.on('select', () => {
      const index = emblaApi.selectedScrollSnap();
      currentProject = data.projects[index];
    });
  }

  // Utilities & state
  import { urlFor } from '$lib/utils/image';
  import { getToggles } from '$lib/stores/toggle.svelte.js';
  import { getCta } from '$lib/stores/cta.svelte.js';
  let toggler = getToggles();
  let ctaer = getCta();

  let currentProject = $state(data.projects[0]);
</script>

<!-- Embla Carousel -->
<div class="embla">
  <!-- Viewport wrapper: attach Embla action here -->
  <div
    class="embla__viewport"
    use:emblaCarouselSvelte={{options}}
    on:emblaInit={onInit}
  >
    <div class="embla__container">
      {#each data.projects as project}
        <div class="embla__slide">
          <a
            class="project"
            on:mouseover={() => ctaer.setCta('View')}
            on:click={(e) => toggler.toggleWork(e, project.reference.slug.current)}
            data-sveltekit-preload-data
            href="{project.reference._type === '/personal' ? '/personal' : '/archive'}/{project.reference.slug.current}"
          >
            {#if project.desktop}
              <img
                class="media"
                src={urlFor(project.desktop.asset).height(2200)}
                alt={project.desktop.info.altText}
                width={innerHeight * project.desktop.info.metadata.dimensions.width / project.desktop.info.metadata.dimensions.height}
                height={innerHeight}
              />
            {:else if project.video}
              <video
                class="media"
                muted
                loop
                autoplay
                playsinline
                src={project.video.mp4.asset.url}
                placeholder={project.video.cover ? urlFor(project.video.cover.asset).height(2200) : ''}
              ></video>
            {/if}
          </a>
        </div>
      {/each}
    </div>
  </div>

  <!-- Navigation buttons -->
  <button
    class="embla__button embla__prev"
    on:click={scrollPrev}
    on:mouseover={() => ctaer.setCta('Previous')}
    aria-label="Previous slide"
  ></button>
  <button
    class="embla__button embla__next"
    on:click={scrollNext}
    on:mouseover={() => ctaer.setCta('Next')}
    aria-label="Next slide"
  ></button>
</div>

<!-- Project Info -->
<div class="project-info difference">
  <h2>{currentProject.reference.title}</h2>
  {#if currentProject.reference.tags}
    <p>
      {#each currentProject.reference.tags as tag, i}
        {tag.title}{#if i + 1 < data.projects[0].reference.tags?.length}, {/if}
      {/each}
    </p>
  {/if}
</div>

<style>
  .embla {
    overflow: hidden;
    position: relative;
  }
  .embla__viewport {
    overflow: hidden;
    width: 100%;
  }
  .embla__container {
    display: flex;
  }
  .embla__slide {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .embla__button {
    background: transparent;
    border: none;
    width: 20vw;
    height: 100vh;
    position: absolute;
    display: block;
    top: 0;
    z-index: 1;
    cursor: pointer;
  }
  .embla__prev {
    left: 0;
  }
  .embla__next {
    right: 0;
  }
  .media {
    display: block;
    height: 100vh;
    width: auto;
    max-width: 100vw;
    object-fit: cover;
  }
  .project-info {
    position: absolute;
    left: var(--gutter);
    bottom: var(--gutter);
    z-index: 3;
  }
</style>
