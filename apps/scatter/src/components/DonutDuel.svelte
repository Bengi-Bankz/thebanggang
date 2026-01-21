<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { Container, BitmapText } from 'pixi-svelte';
	import { waitForTimeout } from 'utils-shared/wait';
	import { stateBetDerived } from 'state-shared';
	
	import { getContext } from '../game/context';
	import FramedDisplay from '../framedisplay.svelte';
	import MultiplierNumber from './MultiplierNumber.svelte';
	import { SYMBOL_SIZE } from '../game/constants';

	type Props = {
		x?: number;
		y?: number;
		multiplierValue: number;
		gridPosition?: { row: number; col: number }; // Position on grid where VS symbol landed
		onComplete?: () => void;
	};

	type DuelPhase = 'hidden' | 'vs-reveal' | 'win-animation' | 'multiplier-drop' | 'complete';

	const props: Props = $props();
	const context = getContext();
	
	// Helper function to get random multiplier (must be defined before use)
	const getRandomMultiplier = () => {
		const MULTIPLIER_VALUES = [2, 4, 5, 7, 10, 50, 100];
		const available = MULTIPLIER_VALUES.filter(v => v !== props.multiplierValue);
		return available[Math.floor(Math.random() * available.length)];
	};
	
	let phase = $state<DuelPhase>('hidden');
	let showVSAnimation = $state(false);
	let showWinAnimation = $state(false);
	let showMultiplierDrop = $state(false);
	
	// Randomly determine winner (50/50 chance)
	const winnerIsGrenade = Math.random() > 0.5;
	const winningCharacterId = winnerIsGrenade ? 'grenadeRobber' : 'donutCop';
	const fakeMultiplier = getRandomMultiplier();
	
	// Assign multipliers based on winner
	const grenadeMultiplier = winnerIsGrenade ? props.multiplierValue : fakeMultiplier;
	const copMultiplier = winnerIsGrenade ? fakeMultiplier : props.multiplierValue;
	
	// Frame sequences for animations
	const VS_ANIMATION_FRAMES = [
		"vs0001 (9).png", "vs0001 (8).png", "vs0001 (7).png", "vs0001 (6).png", "vs0001 (5).png", "vs0001 (4).png",
		"vs0001 (3).png", "vs0001 (2).png", "vs0001 (1).png", "vs0001 (30).png", "vs0001 (29).png", "vs0001 (28).png",
		"vs0001 (27).png", "vs0001 (26).png", "vs0001 (25).png", "vs0001 (24).png", "vs0001 (23).png", "vs0001 (22).png",
		"vs0001 (21).png", "vs0001 (20).png", "vs0001 (19).png", "vs0001 (18).png", "vs0001 (17).png", "vs0001 (16).png",
		"vs0001 (15).png", "vs0001 (14).png", "vs0001 (13).png", "vs0001 (12).png", "vs0001 (11).png", "vs0001 (10).png"
	];

	const ROBBERWINS_FRAMES = [
		"robberwins0001 (9).png", "robberwins0001 (8).png", "robberwins0001 (7).png", "robberwins0001 (6).png", "robberwins0001 (5).png", "robberwins0001 (4).png",
		"robberwins0001 (36).png", "robberwins0001 (35).png", "robberwins0001 (34).png", "robberwins0001 (33).png", "robberwins0001 (32).png", "robberwins0001 (31).png",
		"robberwins0001 (30).png", "robberwins0001 (29).png", "robberwins0001 (28).png", "robberwins0001 (27).png", "robberwins0001 (26).png", "robberwins0001 (25).png",
		"robberwins0001 (24).png", "robberwins0001 (23).png", "robberwins0001 (22).png", "robberwins0001 (21).png", "robberwins0001 (20).png", "robberwins0001 (19).png",
		"robberwins0001 (18).png", "robberwins0001 (17).png", "robberwins0001 (16).png", "robberwins0001 (15).png", "robberwins0001 (14).png", "robberwins0001 (13).png",
		"robberwins0001 (12).png", "robberwins0001 (11).png", "robberwins0001 (10).png", "robberwins0001 (3).png", "robberwins0001 (2).png", "robberwins0001 (1).png"
	];

	const COPWINS_FRAMES = [
		"copwins0001 (9).png", "copwins0001 (8).png", "copwins0001 (7).png", "copwins0001 (6).png", "copwins0001 (5).png", "copwins0001 (4).png",
		"copwins0001 (36).png", "copwins0001 (35).png", "copwins0001 (34).png", "copwins0001 (33).png", "copwins0001 (32).png", "copwins0001 (31).png",
		"copwins0001 (30).png", "copwins0001 (29).png", "copwins0001 (28).png", "copwins0001 (27).png", "copwins0001 (26).png", "copwins0001 (25).png",
		"copwins0001 (24).png", "copwins0001 (23).png", "copwins0001 (22).png", "copwins0001 (21).png", "copwins0001 (20).png", "copwins0001 (19).png",
		"copwins0001 (18).png", "copwins0001 (17).png", "copwins0001 (16).png", "copwins0001 (15).png", "copwins0001 (14).png", "copwins0001 (13).png",
		"copwins0001 (12).png", "copwins0001 (11).png", "copwins0001 (10).png", "copwins0001 (3).png", "copwins0001 (2).png", "copwins0001 (1).png"
	];

	// Multiplier drop animation
	const multiplierDropX = new Tween(0);
	const multiplierDropY = new Tween(0);
	const multiplierDropScale = new Tween(1);

	// Win animation entrance
	const winAnimationScale = new Tween(0);
	const winAnimationAlpha = new Tween(0);

	onMount(() => {
		startDuelSequence();
	});

	const startDuelSequence = async () => {
		console.log(`🎯 Donut Duel: ${winningCharacterId === 'grenadeRobber' ? 'Grenade' : 'Cop'} wins with ${props.multiplierValue}X vs ${fakeMultiplier}X`);
		
		// Phase 1: VS Animation with multiplier comparison
		phase = 'vs-reveal';
		await playVSAnimation();
		
		// Pause to let multipliers sink in
		await waitForTimeout(800 / stateBetDerived.timeScale());
		
		// Phase 2: Character Win Animation
		phase = 'win-animation';
		await playWinAnimation();
		
		// Phase 3: Multiplier Drop to Grid
		phase = 'multiplier-drop';
		await playMultiplierDrop();
		
		phase = 'complete';
		console.log('✅ Donut Duel complete');
		props.onComplete?.();
	};

	const playVSAnimation = async () => {
		console.log('🆚 Playing VS animation with multiplier comparison');
		showVSAnimation = true;
		context.eventEmitter?.broadcast({ type: 'soundOnce', name: 'sfx_multiplier_explosion_a' });
		
		// Play through all 36 frames (at fps 16 = ~2.25 seconds)
		await waitForTimeout(2250 / stateBetDerived.timeScale());
		
		showVSAnimation = false;
		console.log('✅ VS animation complete');
	};

	const playWinAnimation = async () => {
		console.log(`🏆 Playing ${winningCharacterId} win animation`);
		
		// Reset and animate entrance
		winAnimationScale.set(0, { duration: 0 });
		winAnimationAlpha.set(0, { duration: 0 });
		
		showWinAnimation = true;
		
		// Animate in with scale and alpha
		winAnimationScale.set(1, { duration: 300 });
		winAnimationAlpha.set(1, { duration: 300 });
		
		// Play through all 36 frames (at fps 16 = ~2.25 seconds)
		await waitForTimeout(2250 / stateBetDerived.timeScale());
		
		showWinAnimation = false;
		console.log('✅ Win animation complete');
	};

	const playMultiplierDrop = async () => {
		console.log('💰 Dropping multiplier to grid position');
		showMultiplierDrop = true;
		
		// Calculate target grid position
		const targetX = props.gridPosition ? (props.gridPosition.col - 1.5) * SYMBOL_SIZE : 0;
		const targetY = props.gridPosition ? (props.gridPosition.row - 1.5) * SYMBOL_SIZE : 0;
		
		// Animate multiplier from center to grid position with drop effect
		multiplierDropScale.set(1.5, { duration: 0 }); // Start larger
		multiplierDropX.set(0, { duration: 0 });
		multiplierDropY.set(-SYMBOL_SIZE * 2, { duration: 0 });
		
		// Drop down to grid position
		multiplierDropY.set(targetY, { duration: 600 / stateBetDerived.timeScale() });
		multiplierDropX.set(targetX, { duration: 600 / stateBetDerived.timeScale() });
		multiplierDropScale.set(1, { duration: 600 / stateBetDerived.timeScale() });
		
		await waitForTimeout(700 / stateBetDerived.timeScale());
		
		showMultiplierDrop = false;
		console.log('✅ Multiplier drop complete');
	};
</script>

{#if phase !== 'hidden' && phase !== 'complete'}
	<Container x={props.x} y={props.y - SYMBOL_SIZE * 0.8}>
		<!-- VS Animation Phase with large Multiplier Comparison -->
		{#if phase === 'vs-reveal' && showVSAnimation}
			<!-- Grenade Robber Multiplier (left) - Large display -->
			<MultiplierNumber
				multiplier={grenadeMultiplier}
				color="blue"
				x={-SYMBOL_SIZE * 1.2}
				y={0}
				scale={1.5}
			/>

			<!-- VS Animation in center -->
			<FramedDisplay
				frameKeys={VS_ANIMATION_FRAMES}
				x={-(SYMBOL_SIZE * 0.8)}
				y={0}
				width={SYMBOL_SIZE * 1.6}
				height={SYMBOL_SIZE * 1.6}
				fps={16}
				scale={1}
				loop={false}
			/>

			<!-- Donut Cop Multiplier (right) - Large display -->
			<MultiplierNumber
				multiplier={copMultiplier}
				color="red"
				x={SYMBOL_SIZE * 1.2}
				y={0}
				scale={1.5}
			/>
		{/if}

		<!-- Character Win Animation Phase (Wanted Poster Style) -->
		{#if phase === 'win-animation' && showWinAnimation}
			<Container x={0} y={winningCharacterId === 'donutCop' ? -SYMBOL_SIZE : 0} scale={winAnimationScale.current} alpha={winAnimationAlpha.current}>
				<!-- Win animation - Full character with winning multiplier overlay -->
				<FramedDisplay
					frameKeys={winningCharacterId === 'grenadeRobber' ? ROBBERWINS_FRAMES : COPWINS_FRAMES}
					x={-(SYMBOL_SIZE * 1.0)}
					y={0}
					width={winningCharacterId === 'donutCop' ? SYMBOL_SIZE * 3.2 : SYMBOL_SIZE * 2.0}
					height={winningCharacterId === 'donutCop' ? SYMBOL_SIZE * 3.2 : SYMBOL_SIZE * 2.0}
					fps={16}
					scale={1}
					loop={false}
				/>
				
				<!-- Large Winning Multiplier Overlay -->
				<BitmapText
					anchor={0.5}
					x={0}
					y={0}
					text={`${props.multiplierValue}X`}
					style={{
						fontFamily: 'purple',
						fontSize: SYMBOL_SIZE,
						letterSpacing: -4,
						fontWeight: 'bold',
					}}
				/>
			</Container>
		{/if}

		<!-- Multiplier Drop Phase -->
		{#if phase === 'multiplier-drop' && showMultiplierDrop}
			<Container
				x={multiplierDropX.current}
				y={multiplierDropY.current}
				scale={multiplierDropScale.current}
			>
				<MultiplierNumber
					multiplier={props.multiplierValue}
					color="blue"
					x={0}
					y={0}
					scale={1}
				/>
				/>
			</Container>
		{/if}
	</Container>
{/if}
