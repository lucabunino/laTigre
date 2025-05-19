<!-- PortableTextStyle -->
<script lang="ts">
  import type {BlockComponentProps} from '@portabletext/svelte'
  import { urlFor } from '$lib/utils/image.js';

  interface Props {
    portableText: BlockComponentProps;
    children?: import('svelte').Snippet;
  }

  let { portableText, children }: Props = $props();
  let {global, value} = $derived(portableText)
  let {style, listItem, markDefs} = $derived(value);

  let imgEl = $state()
  let active = $state()
  function toggleImgTap(e: Event) {
    const el = (e.currentTarget as HTMLElement).nextElementSibling as HTMLElement;
    active = active === el ? null : el;    // toggle

    console.log(active);
  }
</script>

{#if value._type === 'image'}
  <span ontouchstart={(e) => toggleImgTap(e)}>{@render children()}</span>
  <div
  class="imgHover"
  bind:this={imgEl}
  class:active={active === imgEl}
  ontouchstart={(e) => toggleImgTap(e)}
  >
    <div class="mobile-only background"></div>
    <img src={urlFor(value?.image.asset)} alt="">
    {#if value?.image.info.description}
      <p class="folio-14 caption">{value?.image.info.description}</p>
    {/if}
  </div>
{:else if value._type === 'link'}
  <a class="link" href={value?.url} target={value?.blank ? '_blank' : undefined}>
    {@render children()}
  </a>
{:else if style === 'normal' && !listItem}
  <p class="paragraph">{@render children()}</p>
{:else if style=== 'h3'}
  <h3 class="folio-14">{@render children()}</h3>
{/if}

<style>
.imgHover {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(-100%);
  display: none;
  width: calc((100vw - calc(var(--gutter))*1)/4);
}
.caption {
  background-color: var(--white);
  padding: calc(var(--gutter)*.5);
}

@media screen and (min-width: 701px) {
  span:hover + .imgHover {
    display: block;
  }
}

span, .link {
  text-decoration: underline;
  cursor: pointer;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}
.paragraph {
  margin: 0;
}
:global(.paragraph:has(+ .paragraph)) {
  margin-bottom: .6em;
}
h3 {
  margin-top: 1em;
  margin-bottom: .2em;
}

@media screen and (max-width: 700px) {
  .imgHover {
    transform: translateX(0);
    width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
  .imgHover.active {
    display: block;
  }
  .background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(10px);
    z-index: -1;
  }
}
</style>