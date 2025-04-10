<script>
// Data
let { data } = $props();
$inspect(data)

// Imports
import SwiperSingle from "$lib/components/SwiperSingle.svelte"
</script>

{#key data.work[0].title}
  <SwiperSingle data={data}/>
{/key}