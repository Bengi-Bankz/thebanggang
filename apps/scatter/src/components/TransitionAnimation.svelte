<script lang="ts">
	import FramedDisplay from '../framedisplay.svelte';
	import { getContext } from '../game/context';

	type Props = {
		oncomplete: () => void;
	};

	const props: Props = $props();
	const context = getContext();

	// Calculate dynamic dimensions based on canvas size
	const canvasSize = context.stateLayoutDerived.canvasSizes();
	const DISPLAY_WIDTH_RATIO = 0.65; // 65% of canvas width
	const ASPECT_RATIO = 500 / 290; // Original aspect ratio
	
	const displayWidth = canvasSize.width * DISPLAY_WIDTH_RATIO;
	const displayHeight = displayWidth / ASPECT_RATIO;
	
	const centerX = canvasSize.width * 0.5;
	const centerY = canvasSize.height * 0.5;
</script>

<FramedDisplay
	frameKeys={[
		"frame_0001 (1).png", "frame_0001 (2).png", "frame_0001 (3).png", "frame_0001 (4).png", "frame_0001 (5).png", 
		"frame_0001 (6).png", "frame_0001 (7).png", "frame_0001 (8).png", "frame_0001 (9).png", "frame_0001 (10).png",
		"frame_0001 (11).png", "frame_0001 (12).png", "frame_0001 (13).png", "frame_0001 (14).png", "frame_0001 (15).png", 
		"frame_0001 (16).png", "frame_0001 (17).png", "frame_0001 (18).png", "frame_0001 (19).png", "frame_0001 (20).png",
		"frame_0001 (21).png", "frame_0001 (22).png", "frame_0001 (23).png", "frame_0001 (24).png", "frame_0001 (25).png", 
		"frame_0001 (26).png", "frame_0001 (27).png", "frame_0001 (28).png", "frame_0001 (29).png", "frame_0001 (30).png",
		"frame_0001 (31).png", "frame_0001 (32).png", "frame_0001 (33).png", "frame_0001 (34).png", "frame_0001 (35).png", 
		"frame_0001 (36).png", "frame_0001 (37).png", "frame_0001 (38).png", "frame_0001 (39).png", "frame_0001 (40).png",
		"frame_0001 (41).png", "frame_0001 (42).png", "frame_0001 (43).png", "frame_0001 (44).png", "frame_0001 (45).png", 
		"frame_0001 (46).png", "frame_0001 (47).png", "frame_0001 (48).png", "frame_0001 (49).png", "frame_0001 (50).png",
		"frame_0001 (51).png", "frame_0001 (52).png", "frame_0001 (53).png", "frame_0001 (54).png", "frame_0001 (55).png", 
		"frame_0001 (56).png", "frame_0001 (57).png", "frame_0001 (58).png", "frame_0001 (59).png", "frame_0001 (60).png",
		"frame_0001 (61).png"
	]}
	x={centerX}
	y={centerY}
	width={displayWidth}
	height={displayHeight}
	fps={24}
	scale={1}
	oncomplete={props.oncomplete}
/>
