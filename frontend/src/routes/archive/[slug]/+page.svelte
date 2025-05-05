<script>
// Data
let { data } = $props();
$inspect(data)

// Imports
import SwiperWork from "$lib/components/SwiperWork.svelte"
</script>

{#key data.work[0].title}
  <SwiperWork data={data}/>
{/key}