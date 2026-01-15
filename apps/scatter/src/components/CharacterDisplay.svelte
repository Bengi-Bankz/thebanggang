<script lang="ts">
	import { Container, Sprite } from 'pixi-svelte';
	import { getContext } from '../game/context';
	import FramedDisplay from '../framedisplay.svelte';

	const context = getContext();

	// Calculate dynamic dimensions based on canvas size
	const canvasSize = context.stateLayoutDerived.canvasSizes();
	const DISPLAY_WIDTH_RATIO = 0.25; // 25% of canvas width
	const ASPECT_RATIO = 1728 / 2262; // boardguy aspect ratio
	
	const displayWidth = canvasSize.width * DISPLAY_WIDTH_RATIO;
	const displayHeight = displayWidth / ASPECT_RATIO;
	
	// Position to the left side of the canvas
	const posX = canvasSize.width * 0.02;
	const posY = canvasSize.height * 0.15;

	let loopKey = $state(0);

	const frameKeys = [
		"boardguy1", "boardguy2", "boardguy3", "boardguy4", "boardguy5", 
		"boardguy6", "boardguy7", "boardguy8", "boardguy9", "boardguy10",
		"boardguy11", "boardguy12", "boardguy13", "boardguy14", "boardguy15", 
		"boardguy16", "boardguy17", "boardguy18", "boardguy19", "boardguy20",
		"boardguy21", "boardguy22", "boardguy23", "boardguy24", "boardguy25", 
		"boardguy26", "boardguy27", "boardguy28", "boardguy29", "boardguy30",
		"boardguy31", "boardguy32", "boardguy33", "boardguy34", "boardguy35", 
		"boardguy36"
	];
</script>

<FramedDisplay
	{frameKeys}
	x={posX}
	y={posY}
	width={displayWidth}
	height={displayHeight}
	fps={16}
	scale={1}
	loop={true}
/>
