<script>
// Data
let { data } = $props()

// Imports
import Swiper from "$lib/components/Swiper.svelte"
</script>


{#key data.projects}
  <Swiper data={data}/>
{/key}