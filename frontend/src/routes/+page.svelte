<script>
// Imports
import Embla from "$lib/components/Embla.svelte"
import Media from "$lib/components/Media.svelte"
import { urlFor } from '$lib/utils/image';
import { getToggles	} from '$lib/stores/toggle.svelte.js';
let toggler = getToggles()

// Variables
let { data } = $props()
let innerWidth = $state(0)
let innerHeight = $state(0)
</script>

<svelte:window bind:innerWidth bind:innerHeight></svelte:window>

{#if innerWidth/innerHeight > 1}
	{#key data.projects}
		<Embla data={data}/>
	{/key}
{:else}
{#each data.projects as project, i}
	<div class="project">
		<div class="project-title-container difference">
			<div class="project-title">
				<h2>{project.reference.title}</h2>
				{#if project.reference.description}
					<p>{project.reference.description}</p>
				{/if}
			</div>
		</div>
		{#if project.mobile}
			<Media media={project.mobile} className="home-mobile-media"/>
		{:else if project.desktop}
			<Media media={project.desktop} className="home-mobile-media"/>
		{:else if project.video}
			<Media media={project.video} className="home-mobile-media" video={true} width={innerWidth} height={innerHeight}/>
		{/if}
	</div>
{/each}
{/if}



<style>
.project {
	position: relative;
	height: 85vh;
	display: block;
}
.project-title-container {
	position: absolute;
	top: 0;
	height: 85vh;
	z-index: 2;
	width: 100%;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	    -ms-flex-align: center;
	        align-items: center;
}
.project-title {
	position: sticky;
	margin: var(--gutter);
	top: 40vh;
	z-index: 3;
}
</style>