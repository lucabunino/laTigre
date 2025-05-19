<script>
import SwiperGoods from "$lib/components/SwiperGoods.svelte"
import { urlFor } from '$lib/utils/image';
let { data } = $props();
</script>

<svelte:head>
  {#if data.good[0].media && !data.good[0].media[0].mp4}<meta property="og:image" content={urlFor(data.good[0].media[0]).width(2000).url()}>{/if}
</svelte:head>

{#key data.good[0].title}
  <SwiperGoods data={data}/>
{/key}