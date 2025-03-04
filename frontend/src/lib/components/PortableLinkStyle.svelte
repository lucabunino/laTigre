<!-- PortableImageStyle -->
<script lang="ts">
  import type {BlockComponentProps} from '@portabletext/svelte'

  interface Props {
    portableText: BlockComponentProps;
    children?: import('svelte').Snippet;
  }

  let { portableText, children }: Props = $props();

  let {global, value} = $derived(portableText)
  let {style, listItem} = $derived(value);  
</script>

<a class="link" href={value.url} target={value.blank ? '_blank' : undefined}>
  {@render children()}
</a>

{$inspect(value)}

<style>
</style>