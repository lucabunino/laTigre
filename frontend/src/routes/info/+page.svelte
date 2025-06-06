<script>
let { data } = $props()
import { PortableText } from '@portabletext/svelte'
import PortableTextStyle from '$lib/components/PortableTextStyle.svelte';
import { getColors	} from '$lib/stores/color.svelte.js';
let colorer = getColors()
if (data.colours.info) {
	colorer.setColors(data.colours.info)	
}

let body = $state()

$effect(() => {
  body.style.overflow = 'hidden';
  return(() => {
	body.style.overflow = '';
  })
})
</script>

<svelte:body bind:this={body}/>

<section>
{#if data.info.body}
<PortableText
value={data.info.body}
components={{
  block: {
    normal: PortableTextStyle,
    h3: PortableTextStyle,
    h6: PortableTextStyle,
  },
  listItem: PortableTextStyle,
  marks: {
    link: PortableTextStyle,
    image: PortableTextStyle,
  },
}}/>
{/if}
</section>


<style>
section {
  padding: calc(var(--gutter)*2 + 1em) var(--gutter) var(--gutter);
  overflow-y: scroll;
  height: 100%;
}
</style>