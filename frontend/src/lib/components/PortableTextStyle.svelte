<!-- PortableTextStyle -->
<script lang="ts">
import type {BlockComponentProps} from '@portabletext/svelte'
import { urlFor } from '$lib/utils/image.js';
interface Props {
	portableText: BlockComponentProps;
	children?: import('svelte').Snippet;
	colours: any;
}
let { portableText, children, colours }: Props = $props();
let {global, value} = $derived(portableText)
let {style, listItem, markDefs} = $derived(value);

import { getColors	} from '$lib/stores/color.svelte.js';
let colorer = getColors()

let imgEl = $state()
let active = $state()
function toggleImgTap(e: Event) {
	const el = (e.currentTarget as HTMLElement).nextElementSibling as HTMLElement;
	active = active === el ? null : el;
}
</script>

{#if value._type === 'image'}
	<span class="imgHover-span"
	style="--hoverColor: {colorer.colors[Math.floor(Math.random() * colorer.colors.length)].hex}"
	ontouchstart={(e) => toggleImgTap(e)}>{@render children()}</span><div
	class="imgHover"
	bind:this={imgEl}
	class:active={active === imgEl}
	ontouchstart={(e) => toggleImgTap(e)}
	>
		<div class="mobile-only background noise"></div>
		<img src={urlFor(value?.image.asset)} alt="">
		{#if value?.image.info.description}
			<p class="folio-14 caption">{value?.image.info.description}</p>
		{/if}
	</div>
{:else if listItem == 'bullet'}
	<li class="list-item">
		{#if value.children[0].text.includes('::')}
			{@const [marker, content] = value.children[0].text.split('::')}
			<span class="marker">{marker}</span><span>{content}</span>
		{:else}
			<span>{@render children()}</span>
		{/if}
	</li>
{:else if value._type === 'link'}
	<a class="link" href={value?.url} target={value?.blank ? '_blank' : undefined}
	style="--hoverColor: {colorer.colors[Math.floor(Math.random() * colorer.colors.length)].hex}"
	>
		{@render children()}
	</a>
{:else if style === 'normal' && !listItem}
	<p class="paragraph">{@render children()}</p>
{:else if style=== 'h3'}
	<h3 class="folio-14">{@render children()}</h3>
{:else if style=== 'h6'}
	<h6 class="folio-14">{@render children()}</h6>
{/if}

<style>
.list-item {
	margin-left: 2.7em;
}
.marker {
	margin-left: -2.7em;
	min-width: 2.2em;
	margin-right: .5em;
	display: inline-block;
}
.imgHover {
	position: absolute;
	top: 0;
	left: 0;
	-webkit-transform: translateX(-100%);
	    -ms-transform: translateX(-100%);
	        transform: translateX(-100%);
	display: none;
	width: calc((100vw - calc(var(--gutter))*1)/4);
}
.caption {
	background-color: var(--white);
	padding: calc(var(--gutter)*.5);
}

@media screen and (min-width: 701px) {
	span:hover + .imgHover {
		display: block;
	}
}

.imgHover-span, .link {
	text-decoration: underline;
	cursor: pointer;
	text-decoration-thickness: 1px;
	text-underline-offset: 2px;
}
.imgHover-span:hover, .link:hover {
	color: var(--hoverColor);
}
.paragraph {
	margin: 0;
}
:global(.paragraph:has(+ .paragraph)) {
	margin-bottom: .6em;
}
h3 {
	margin-top: 1.5em;
	margin-bottom: 0;
}
h6 {
	color: red;
	padding-left: 4em;
	text-indent: -4em;
}

@media screen and (max-width: 700px) {
	.imgHover {
		-webkit-transform: translateX(0);
		    -ms-transform: translateX(0);
		        transform: translateX(0);
		width: 100%;
		max-height: 100%;
		-o-object-fit: cover;
		   object-fit: cover;
	}
	.imgHover.active {
		display: block;
	}
	.imgHover img {
		max-height: 90vh;
	}
	.background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		-webkit-backdrop-filter: blur(10px);
		        backdrop-filter: blur(10px);
		z-index: -1;
	}
}
</style>