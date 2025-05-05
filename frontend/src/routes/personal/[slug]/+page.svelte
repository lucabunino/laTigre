<script>
// Data
let { data } = $props();
$inspect(data)

// Imports
import SwiperPersonal from "$lib/components/SwiperPersonal.svelte"
</script>

{#key data.personal[0].title}
  <SwiperPersonal data={data}/>
{/key}