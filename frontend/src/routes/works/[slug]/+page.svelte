<script>
import SwiperWork from "$lib/components/SwiperWork.svelte"
import { urlFor } from '$lib/utils/image';
let { data } = $props();
let body = $state()

$effect(() => {
  body.style.overflow = 'hidden';
  return(() => {
	body.style.overflow = '';
  })
})
</script>

<svelte:body bind:this={body}/>

<svelte:head>
  {#if data.work[0].media && !data.work[0].media[0].mp4}<meta property="og:image" content={urlFor(data.work[0].media[0]).width(2000).url()}>{/if}
</svelte:head>

{#key data.work[0].title}
  <SwiperWork data={data}/>
{/key}