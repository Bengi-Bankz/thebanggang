<script lang="ts">
	import { Rectangle, Sprite, SpineProvider, SpineTrack } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';
	import { SECOND } from 'constants-shared/time';

	import { getContext } from '../game/context';

	const context = getContext();

	const BG_RATIO = 2039 / 1000;
	const baseBackgroundProps = $derived(() => {
		const { width, height } = context.stateLayoutDerived.canvasSizes();
		let w = width;
		let h = width / BG_RATIO;
		if (h < height) {
			h = height;
			w = height * BG_RATIO;
		}
		return {
			x: width / 2,
			y: height / 2,
			width: w,
			height: h,
		};
	});

	const backgroundProps = $derived(
		context.stateLayoutDerived.normalBackgroundLayout({ scale: 0.5 }),
	);
	const showBaseBackground = $derived(context.stateGame.gameType === 'basegame');
	const showFeatureBackground = $derived(context.stateGame.gameType === 'freegame');
</script>

<Rectangle {...context.stateLayoutDerived.canvasSizes()} backgroundColor={0x000000} zIndex={-3} />

<FadeContainer show={showBaseBackground} duration={SECOND} zIndex={-2}>
	<Sprite key="featuringBg" {...baseBackgroundProps} anchor={{ x: 0, y: 0 }} />
</FadeContainer>

<FadeContainer show={showFeatureBackground} duration={SECOND} zIndex={-1}>
	<SpineProvider key="foregroundFeatureAnimation" {...backgroundProps}>
		<SpineTrack trackIndex={0} animationName={'idle'} loop />
	</SpineProvider>
	<SpineProvider key="foregroundFeatureAnimation" {...backgroundProps}>
		<SpineTrack trackIndex={0} animationName={'dust'} loop />
	</SpineProvider>
</FadeContainer>
