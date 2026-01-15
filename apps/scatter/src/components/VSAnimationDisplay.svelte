<script lang="ts">
	import { Container, Sprite } from 'pixi-svelte';
	import { getContext } from '../game/context';
	import FramedDisplay from '../framedisplay.svelte';

	const context = getContext();

	// Calculate dynamic dimensions based on canvas size
	const canvasSize = context.stateLayoutDerived.canvasSizes();
	const DISPLAY_WIDTH_RATIO = 0.3; // 30% of canvas width
	const ASPECT_RATIO = 2214 / 2202; // vsanimation aspect ratio
	
	const displayWidth = canvasSize.width * DISPLAY_WIDTH_RATIO;
	const displayHeight = displayWidth / ASPECT_RATIO;
	
	// Position in center of canvas
	const posX = (canvasSize.width - displayWidth) / 2;
	const posY = (canvasSize.height - displayHeight) / 2;

	const frameKeys = [
		"vsanimation1", "vsanimation2", "vsanimation3", "vsanimation4", "vsanimation5", 
		"vsanimation6", "vsanimation7", "vsanimation8", "vsanimation9", "vsanimation10",
		"vsanimation11", "vsanimation12", "vsanimation13", "vsanimation14", "vsanimation15", 
		"vsanimation16", "vsanimation17", "vsanimation18", "vsanimation19", "vsanimation20",
		"vsanimation21", "vsanimation22", "vsanimation23", "vsanimation24", "vsanimation25", 
		"vsanimation26", "vsanimation27", "vsanimation28", "vsanimation29", "vsanimation30",
		"vsanimation31", "vsanimation32", "vsanimation33", "vsanimation34", "vsanimation35", 
		"vsanimation36"
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
