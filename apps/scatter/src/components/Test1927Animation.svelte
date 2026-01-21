<script lang="ts">
	import { Sprite } from 'pixi-svelte';
	import FramedDisplay from '../framedisplay.svelte';

	// 30-frame series from the 19-27 animation (frames 6-35)
	const frameKeys = [
		'frame_006.png',
		'frame_007.png',
		'frame_008.png',
		'frame_009.png',
		'frame_010.png',
		'frame_011.png',
		'frame_012.png',
		'frame_013.png',
		'frame_014.png',
		'frame_015.png',
		'frame_016.png',
		'frame_017.png',
		'frame_018.png',
		'frame_019.png',
		'frame_020.png',
		'frame_021.png',
		'frame_022.png',
		'frame_023.png',
		'frame_024.png',
		'frame_025.png',
		'frame_026.png',
		'frame_027.png',
		'frame_028.png',
		'frame_029.png',
		'frame_030.png',
		'frame_031.png',
		'frame_032.png',
		'frame_033.png',
		'frame_034.png',
		'frame_035.png',
	];

	// Display dimensions - center on screen
	const displayWidth = 400;
	const displayHeight = 400;
</script>

<FramedDisplay
	assetKey="S_19_27"
	{frameKeys}
	x={0}
	y={0}
	width={displayWidth}
	height={displayHeight}
	fps={24}
	loop={true}
/>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		background: #000;
	}
</style>
