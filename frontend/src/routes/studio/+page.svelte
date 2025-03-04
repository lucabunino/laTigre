<script>
let { data } = $props()
$inspect(data)
import { PortableText } from '@portabletext/svelte'
import PortableTextStyle from '$lib/components/PortableTextStyle.svelte';
import PortableImageStyle from '$lib/components/PortableImageStyle.svelte';
import PortableLinkStyle from '$lib/components/PortableLinkStyle.svelte';
</script>

<section>
{#if data.studio.body}
<PortableText
value={data.studio.body}
components={{
  block: {
    normal: PortableTextStyle,
    h3: PortableTextStyle,
    h4: PortableTextStyle,
  },
  listItem: PortableTextStyle,
  marks: {
    link: PortableLinkStyle,
    image: PortableImageStyle,
  },
}}/>
{/if}
</section>


<style>
section {
  padding: calc(var(--gutter)*2 + 1.1em) var(--gutter) var(--gutter);
  overflow-y: scroll;
  height: 100%;
}
</style>