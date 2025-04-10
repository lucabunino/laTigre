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
</script>
{#if value._type === 'image'}
  <span>{@render children()}</span>
  <div class="imgHover">
    <img src={urlFor(value.image.asset)} alt="">
    {#if value.image.info.description}
      <p class="folio-14 caption">{value.image.info.description}</p>
    {/if}
  </div>
{:else if value._type === 'link'}
  <a class="link" href={value.url} target={value.blank ? '_blank' : undefined}>
    {@render children()}
  </a>
{:else if style === 'normal' && !listItem}
  <p class="portableText">{@render children()}</p>
{:else if style=== 'h3'}
  <h3 class="text-m">{@render children()}</h3>
{:else if style=== 'h4'}
  <h4>{@render children()}</h4>
{:else if listItem == 'bullet'}
  <li>{@render children()}</li>
{:else if listItem == 'bumber'}
  <li>{@render children()}</li>
{/if}

<style>
span {
  text-decoration: underline;
  cursor: pointer;
}
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
span:hover + .imgHover {
  display: block;
}
.link {
  color: var(--blue);
  text-decoration: underline;
}
p {
  margin: 0;
  padding-left: 1em;
}
:global(ul) {
  list-style-type: none;
  padding-left: 2em;
}
li::before {
  display: inline-block;
  content: "— ";
  width: 2em;
  margin-left: -2em;
}
p + p {
  
}
h4 {
  
}
</style>