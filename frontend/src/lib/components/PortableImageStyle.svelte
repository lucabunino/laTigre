<!-- PortableImageStyle -->
<script lang="ts">
  import { urlFor } from '$lib/utils/image';
  import type {BlockComponentProps} from '@portabletext/svelte'

  interface Props {
    portableText: BlockComponentProps;
    children?: import('svelte').Snippet;
  }

  let { portableText, children }: Props = $props();

  let {global, value} = $derived(portableText)
  let {style, listItem} = $derived(value);  
</script>

<span>{@render children()}</span>
<div class="imgHover">
  <img src={urlFor(value.image.asset)} alt="">
  <p class="folio-14">{$inspect(value.image)}</p>
</div>

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
span:hover + .imgHover {
  display: block;
}
</style>