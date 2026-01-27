<script lang="ts" module>
	export type EmitterEventBoardFrame =
		| { type: 'boardFrameGlowShow' }
		| { type: 'boardFrameGlowHide' };
</script>

<script lang="ts">
	import { Sprite, SpineProvider, SpineTrack } from 'pixi-svelte';

	import { getContext } from '../game/context';

	const context = getContext();
	const SPINE_SCALE = { width: 0.65, height: 0.68 };
	const FRAME_SCALE = 1.6;
	const FRAME_RATIO = 801 / 685;
	const FRAME_Y_OFFSET = -0.03;
	const POSITION_ADJUSTMENT = 1;

	type AnimationName = 'reelhouse_glow_start' | 'reelhouse_glow_idle' | 'reelhouse_glow_exit';

	let animationName = $state<AnimationName | undefined>(undefined);
	let loop = $state(false);

	context.eventEmitter.subscribeOnMount({
		boardFrameGlowShow: () => {
			animationName = 'reelhouse_glow_start';
			loop = false;
		},
		boardFrameGlowHide: () => {
			if (animationName) animationName = 'reelhouse_glow_exit';
		},
	});
</script>

{#if animationName}
	<SpineProvider
		zIndex={-1}
		key="reelhouse"
		x={context.stateGameDerived.boardLayout().x * POSITION_ADJUSTMENT}
		y={context.stateGameDerived.boardLayout().y * POSITION_ADJUSTMENT}
		width={context.stateGameDerived.boardLayout().width * SPINE_SCALE.width}
		height={context.stateGameDerived.boardLayout().height * SPINE_SCALE.height}
	>
		<SpineTrack
			trackIndex={0}
			{animationName}
			{loop}
			listener={{
				complete: (entry) => {
					if (entry.animation) {
						if (entry.animation.name === 'reelhouse_glow_start') {
							animationName = 'reelhouse_glow_idle';
							loop = true;
						}

						if (entry.animation.name === 'reelhouse_glow_exit') {
							animationName = undefined;
							loop = false;
						}
					}
				},
			}}
		/>
	</SpineProvider>
{/if}

<Sprite
	key="reelsframenewbg.png"
	anchor={0.48}
	x={context.stateGameDerived.boardLayout().x * POSITION_ADJUSTMENT + 20}
	y={
		context.stateGameDerived.boardLayout().y * POSITION_ADJUSTMENT +
		context.stateGameDerived.boardLayout().height * FRAME_Y_OFFSET
	}
	width={context.stateGameDerived.boardLayout().width * FRAME_SCALE}
	height={(context.stateGameDerived.boardLayout().width * FRAME_SCALE) / FRAME_RATIO}
/>
<Sprite
	key="reelsframenew.png"
	anchor={0.48}
	x={context.stateGameDerived.boardLayout().x * POSITION_ADJUSTMENT + 36}
	y={
		context.stateGameDerived.boardLayout().y * POSITION_ADJUSTMENT +
		context.stateGameDerived.boardLayout().height * FRAME_Y_OFFSET
	}
	width={context.stateGameDerived.boardLayout().width * (FRAME_SCALE + 0.06)}
	height={(context.stateGameDerived.boardLayout().width * (FRAME_SCALE + 0.06)) / FRAME_RATIO}
/>
