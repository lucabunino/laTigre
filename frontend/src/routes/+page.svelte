<script>
// Imports
import Embla from "$lib/components/Embla.svelte"
import Media from "$lib/components/Media.svelte"
import { urlFor } from '$lib/utils/image';
import { getToggles	} from '$lib/stores/toggle.svelte.js';
import SwiperMobile from '$lib/components/SwiperMobile.svelte';
let toggler = getToggles()

// Variables
let { data } = $props()
let innerWidth = $state(0)
let innerHeight = $state(0)
let body = $state()
let openWork = $state(false);

// Lifecycle
$effect(() => {
	if (openWork === 0 || openWork > 0) {
		body.style.overflow = 'hidden';
	} else {
		body.style.overflow = '';
	}
})

function handleOpenWork(i) {
	if (openWork === i) {
		openWork = false
	} else {
		openWork = i
	}	
}
function closeOpenWork() {
	openWork = false
}
</script>

<svelte:body bind:this={body}/>
<svelte:window bind:innerWidth bind:innerHeight></svelte:window>

{#if innerWidth/innerHeight > 1 || innerWidth > 1025}
	{#key data.projects}
		<Embla data={data}/>
	{/key}
{:else}
{#each data.projects as project, i}
	<div class="project">
		<div class="project-title-container difference"
		onclick={(e) => {handleOpenWork(i)}}
		>
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
		{#if innerWidth <= 1024 && openWork === i}
			<div class="swiper-container">
				<SwiperMobile media={project.reference.media}/>
				<button class="close-btn difference"
				onclick={(e) => {closeOpenWork()}}
				>Close</button>
			</div>
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

.swiper-container {
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	    -ms-flex-align: center;
	        align-items: center;
	background-color: var(--black);
	z-index: 99;
}
.close-btn {
	position: fixed;
	right: var(--gutter);
	top: var(--gutter);
	z-index: 100;
	font-size: 1rem;
}
</style>