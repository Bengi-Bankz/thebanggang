<script lang="ts" module>
	export type EmitterEventFreeSpinIntro =
		| { type: 'freeSpinIntroShow' }
		| { type: 'freeSpinIntroHide' }
		| { type: 'freeSpinIntroUpdate'; totalFreeSpins: number };
</script>

<script lang="ts">
	import { CanvasSizeRectangle } from 'components-layout';
	import { stateUrlDerived } from 'state-shared';
	import { FadeContainer } from 'components-pixi';
	import { waitForResolve } from 'utils-shared/wait';
	import { BitmapText, SpineProvider, SpineSlot, SpineTrack, Sprite } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import PressToContinue from './PressToContinue.svelte';
	import FreeSpinAnimation from './FreeSpinAnimation.svelte';

	type AnimationName = 'intro' | 'idle';

	const context = getContext();

	let show = $state(false);
	let animationName = $state<AnimationName>('intro');
	let freeSpinsFromEvent = $state(0);
	let oncomplete = $state(() => {});

	context.eventEmitter.subscribeOnMount({
		freeSpinIntroShow: () => (show = true),
		freeSpinIntroHide: () => (show = false),
		freeSpinIntroUpdate: async (emitterEvent) => {
			// if (emitterEvent.extraSpins) {
			// 	context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_fs_respins' });
			// }
			// freeSpinsFromEvent = emitterEvent.extraSpins ?? emitterEvent.totalFreeSpins;
			freeSpinsFromEvent = emitterEvent.totalFreeSpins;
			await waitForResolve((resolve) => (oncomplete = resolve));
		},
	});
</script>

<FadeContainer {show}>
	<CanvasSizeRectangle backgroundColor={0x000000} backgroundAlpha={0.5} />

	<FreeSpinAnimation>
		{#snippet children({ sizes })}
				<!-- Grenade mug shot sprite with sign - sized to fill board -->
				<Sprite
					anchor={{ x: 0, y: 0 }}
					width={sizes.width}
					height={sizes.height}
					key="grenadeMugShot"
				/>

				<!-- Text on the sign (centered horizontally, positioned on sign vertically) -->
				<BitmapText
					anchor={{ x: 0.5, y: 0.5 }}
					x={sizes.width * 0.5}
					y={sizes.height * 0.5 + sizes.width * 0.206}
					text={freeSpinsFromEvent}
					style={{
						fontFamily: 'MoneyFont3',
						fontSize: sizes.width * 0.12,
						fontWeight: 'bold',
					}}
				/>

				<!-- "FREE" text below the number -->
				<BitmapText
					anchor={{ x: 0.5, y: 0.5 }}
					x={sizes.width * 0.5}
					y={sizes.height * 0.5 + sizes.width * 0.206 + sizes.width * 0.1}
					text="FREE"
					style={{
						fontFamily: 'MoneyFont3',
						fontSize: sizes.width * 0.08,
						fontWeight: 'bold',
					}}
				/>

				<!-- "SPINS" text below FREE -->
				<BitmapText
					anchor={{ x: 0.5, y: 0.5 }}
					x={sizes.width * 0.5}
					y={sizes.height * 0.5 + sizes.width * 0.206 + sizes.width * 0.18}
					text="SPINS"
					style={{
						fontFamily: 'MoneyFont3',
						fontSize: sizes.width * 0.08,
						fontWeight: 'bold',
					}}
				/>
		{/snippet}
	</FreeSpinAnimation>

	<PressToContinue onpress={() => oncomplete()} />
</FadeContainer>
