<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Sprite } from 'pixi-svelte';
	import { getContextApp } from 'pixi-svelte';

	const {
		frames = [],
		fps = 12,
		x = 0,
		y = 0,
		width = undefined,
		height = undefined,
		anchor = 0.5,
		alpha = undefined,
		scale = undefined,
		rotation = undefined,
	} = $props<{
		frames?: string[];
		fps?: number;
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		anchor?: number | { x: number; y: number };
		alpha?: number;
		scale?: number;
		rotation?: number;
	}>();

	const context = getContextApp();

	let currentFrameIndex = $state(0);
	let interval: ReturnType<typeof setInterval> | undefined;

	const currentKey = $derived(frames.length > 0 ? frames[currentFrameIndex] : '');
	const canRender = $derived(() => {
		if (!currentKey) return false;
		const texture = context.stateApp.loadedAssets?.[currentKey] as { orig?: unknown } | undefined;
		return Boolean(texture && texture.orig);
	});

	const missingFramesLogged = new Set<string>();
	$effect(() => {
		if (!currentKey || canRender) return;
		if (!missingFramesLogged.has(currentKey)) {
			missingFramesLogged.add(currentKey);
			console.warn(`[AnimatedSprite] Missing frame key: ${currentKey}`);
		}
	});

	const start = () => {
		stop();
		if (frames.length <= 1) return;
		interval = setInterval(() => {
			currentFrameIndex = (currentFrameIndex + 1) % frames.length;
		}, 1000 / fps);
	};

	const stop = () => {
		if (interval) clearInterval(interval);
		interval = undefined;
	};

	onMount(() => {
		start();
	});

	onDestroy(() => {
		stop();
	});
</script>

{#if currentKey && canRender}
	<Sprite
		key={currentKey}
		{x}
		{y}
		{width}
		{height}
		{anchor}
		{alpha}
		{scale}
		{rotation}
	/>
{/if}
