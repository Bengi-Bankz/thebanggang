<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { Container, Sprite, BitmapText, SpineProvider, SpineTrack } from 'pixi-svelte';
	import { waitForTimeout } from 'utils-shared/wait';
	import { stateBetDerived } from 'state-shared';
	
	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';

	type Props = {
		x?: number;
		y?: number;
		multiplierValue: number;
		autoStart?: boolean;
		onComplete?: () => void;
	};

	type BombPhase = 'hidden' | 'landing' | 'static' | 'scaling' | 'tickingUp' | 'exploding' | 'complete';

	type DuelCharacter = {
		id: 'grenadeRobber' | 'donutCop';
		multiplier: number;
		spriteKey: 'grenadeRobber' | 'donutCop';
		x: number;
		isWinner: boolean;
	};

	const props: Props = $props();
	const context = getContext();
	
	// State management
	let phase = $state<BombPhase>('hidden');
	let animationName = $state('static');
	let showMultiplierText = $state(false);
	let currentTickValue = $state(1);
	let assetError = false;
	let assetLoaded = true;
	
	// Duel state
	let showDuel = $state(false);
	let duelCharacters = $state<DuelCharacter[]>([]);
	let duelWinnerRevealed = $state(false);
	let duelShootOrder = $state<('grenadeRobber' | 'donutCop')[]>([]);
	const winningCharacter = $derived(duelCharacters.find(c => c.isWinner));
	
	// Animation tweens
	const scale = new Tween(0);
	const textScale = new Tween(0);
	const rotation = new Tween(0);
	
	// Duel tweens
	const duelGrenadeX = new Tween(-SYMBOL_SIZE * 1.5);
	const duelDonutX = new Tween(SYMBOL_SIZE * 1.5);
	const duelGrenadeScale = new Tween(1);
	const duelDonutScale = new Tween(1);
	
	// Helper function to get random multiplier
	const getRandomMultiplier = () => {
		const MULTIPLIER_VALUES = [2, 4, 5, 7, 10, 50, 100];
		const available = MULTIPLIER_VALUES.filter(v => v !== props.multiplierValue);
		return available[Math.floor(Math.random() * available.length)];
	};
	
	// Animation intervals
	let tickUpInterval: ReturnType<typeof setInterval> | null = null;
	
	// Configuration
	const TICK_SPEED = 500; // ms between ticks during count up (slowed down more)
	
	// Get current sprite based on phase - ALL USE THE SAME STATIC SYMBOL
	// For debugging, use the 'trashcan' sprite key
	const currentSprite = $derived(() => {
		return 'm';
	});
	
	// Auto-start if requested
	onMount(() => {
		if (props.autoStart) {
			startBombSequence();
		}
		
		// Cleanup on unmount
		return () => {
			if (tickUpInterval) clearInterval(tickUpInterval);
		};
	});
	
	const startBombSequence = async () => {
		console.log(`🎯 Starting unified bomb sequence for ${props.multiplierValue}X`);
		await playDuelAnimation();
		await playExplodingAnimation();
		phase = 'complete';
		console.log(`✅ Unified bomb sequence complete for ${props.multiplierValue}X`);
		props.onComplete?.();
	};
	
	const playLandingAnimation = async () => {
		phase = 'landing';
		
		// Play scatter land sound - use the scatter land sound mapping
		const soundMap: { [key: number]: any } = {
			2: 'sfx_scatter_stop_1',
			4: 'sfx_scatter_stop_2', 
			5: 'sfx_scatter_stop_3',
			7: 'sfx_scatter_stop_4',
			10: 'sfx_scatter_stop_5',
		};
		const soundKey = soundMap[props.multiplierValue] || 'sfx_scatter_stop_1';
		context.eventEmitter?.broadcast({ type: 'soundOnce', name: soundKey as any });
		
		// Simple scale bounce animation for landing (no frame animation)
		await scale.set(1.2, { duration: 400 / stateBetDerived.timeScale() });
		await scale.set(1.0, { duration: 300 / stateBetDerived.timeScale() });
	};
	
	const playStaticPhase = async () => {
		phase = 'static';
		// Brief pause - multiplier value still HIDDEN, showing static symbol
		await waitForTimeout(300 / stateBetDerived.timeScale());
	};
	
	const playScalingPhase = async () => {
		phase = 'scaling';
		// Scale up to 2x as requested
		await scale.set(2.0, { duration: 500 / stateBetDerived.timeScale() });
	};
	
	const playDuelAnimation = async () => {
		phase = 'tickingUp';
		console.log('🎯 Starting duel animation');
		
		// Create character objects
		const fakeMultiplier = getRandomMultiplier();
		
		// Randomly assign multipliers to characters
		const assignToLeft = Math.random() > 0.5;
		duelCharacters = [
			{
				id: 'grenadeRobber',
				multiplier: assignToLeft ? props.multiplierValue : fakeMultiplier,
				spriteKey: 'grenadeRobber',
				x: -SYMBOL_SIZE * 1.5,
				isWinner: assignToLeft,
			},
			{
				id: 'donutCop',
				multiplier: assignToLeft ? fakeMultiplier : props.multiplierValue,
				spriteKey: 'donutCop',
				x: SYMBOL_SIZE * 1.5,
				isWinner: !assignToLeft,
			},
		];
		
		// Randomly determine shoot order
		const shootOrders = [
			['grenadeRobber', 'donutCop'],
			['donutCop', 'grenadeRobber'],
		];
		duelShootOrder = shootOrders[Math.floor(Math.random() * 2)] as ('grenadeRobber' | 'donutCop')[];
		
		console.log(
			`🎯 Duel: Grenade (${duelCharacters[0].multiplier}X) vs Donut (${duelCharacters[1].multiplier}X)`,
		);
		console.log(`🔫 Shoot order: ${duelShootOrder.join(' → ')}`);
		
		// Show duel
		showDuel = true;
		
		// Intro - characters slide in
		duelGrenadeX.set(-SYMBOL_SIZE * 0.8, { duration: 400 / stateBetDerived.timeScale() });
		duelDonutX.set(SYMBOL_SIZE * 0.8, { duration: 400 / stateBetDerived.timeScale() });
		await waitForTimeout(600 / stateBetDerived.timeScale());
		
		// Dueling - 3 rounds of shooting (alternate based on random shoot order)
		for (let i = 0; i < 3; i++) {
			const shooter = duelShootOrder[i % 2];
			const isGrenade = shooter === 'grenadeRobber';
			
			console.log(`🔫 Round ${i + 1}/3: ${shooter} shoots`);
			
			// Shooter attacks
			if (isGrenade) {
				duelGrenadeScale.set(1.2, { duration: 150 / stateBetDerived.timeScale() });
				context.eventEmitter?.broadcast({ type: 'soundOnce', name: 'sfx_scatter_stop_1' });
			} else {
				duelDonutScale.set(1.2, { duration: 150 / stateBetDerived.timeScale() });
				context.eventEmitter?.broadcast({ type: 'soundOnce', name: 'sfx_scatter_stop_2' });
			}
			await waitForTimeout(150 / stateBetDerived.timeScale());
			
			// Reset scale
			if (isGrenade) {
				duelGrenadeScale.set(1, { duration: 100 / stateBetDerived.timeScale() });
			} else {
				duelDonutScale.set(1, { duration: 100 / stateBetDerived.timeScale() });
			}
			await waitForTimeout(100 / stateBetDerived.timeScale());
		}
		
		await waitForTimeout(300 / stateBetDerived.timeScale());
		
		// Winner reveal
		console.log(`✨ Winner: ${duelCharacters.find(c => c.isWinner)?.id}`);
		duelWinnerRevealed = true;
		context.eventEmitter?.broadcast({ type: 'soundOnce', name: 'sfx_multiplier_explosion_a' });
		
		await waitForTimeout(1000 / stateBetDerived.timeScale());
		
		console.log('✅ Duel complete');
		showDuel = false;
	};
	
	const playExplodingAnimation = async () => {
		phase = 'exploding';
		animationName = 'explosion';
		await waitForTimeout(500 / stateBetDerived.timeScale());
		context.eventEmitter?.broadcast({ type: 'soundOnce', name: 'sfx_multiplier_explosion_a' });
		await waitForTimeout(600 / stateBetDerived.timeScale());
	};
</script>

{#if assetError}
    <div class="asset-error">
        Failed to load asset: {assetError}
    </div>
{:else if !assetLoaded}
    <div class="asset-loading">
        Loading...
    </div>
{:else}
    <Container x={props.x} y={props.y}>
        {#if phase !== 'hidden' && phase !== 'complete'}
            {#if phase === 'exploding'}
                <SpineProvider
                    x={0}
                    y={0}
                    width={SYMBOL_SIZE * 2}
                    key="explosion"
                >
                    <SpineTrack
                        trackIndex={0}
                        animationName={animationName}
                        timeScale={stateBetDerived.timeScale()}
                    />
                </SpineProvider>
            {:else if phase === 'tickingUp' && showDuel}
                <!-- Inline Duel Animation -->
                {#each duelCharacters as character}
                    <Container
                        x={character.id === 'grenadeRobber' ? duelGrenadeX.current : duelDonutX.current}
                        y={0}
                        scale={character.id === 'grenadeRobber' ? duelGrenadeScale.current : duelDonutScale.current}
                    >
                        <Sprite
                            key={character.spriteKey}
                            anchor={0.5}
                            scale={0.7}
                            x={0}
                            y={0}
                        />
                        <BitmapText
                            anchor={0.5}
                            x={0}
                            y={SYMBOL_SIZE * 0.5}
                            text={`${character.multiplier}X`}
                            style={{
                                fontFamily: 'purple',
                                fontSize: SYMBOL_SIZE * 0.25,
                                letterSpacing: -1,
                            }}
                        />
                    </Container>
                {/each}

                <!-- Winner reveal in center -->
                {#if duelWinnerRevealed && winningCharacter}
                    <Container y={0} scale={duelGrenadeScale.current * 1.5}>
                        <Sprite
                            key={winningCharacter.spriteKey}
                            anchor={0.5}
                            scale={0.9}
                            x={0}
                            y={0}
                        />
                        <BitmapText
                            anchor={0.5}
                            x={0}
                            y={SYMBOL_SIZE * 0.5}
                            text={`${winningCharacter.multiplier}X`}
                            style={{
                                fontFamily: 'purple',
                                fontSize: SYMBOL_SIZE * 0.35,
                                letterSpacing: -2,
                            }}
                        />
                    </Container>
                {/if}
            {:else}
                <Container scale={scale.current} rotation={rotation.current}>
                    <Sprite
                        key={currentSprite()}
                        anchor={0.5}
                        scale={0.8}
                        x={0}
                        y={0}
                    />
                    {#if showMultiplierText}
                        <Container scale={textScale.current}>
                            <BitmapText
                                anchor={0.5}
                                x={0}
                                y={0}
                                text={`${currentTickValue}X`}
                                style={{
                                    fontFamily: 'purple',
                                    fontSize: SYMBOL_SIZE * 0.3,
                                    letterSpacing: -2,
                                }}
                            />
                        </Container>
                    {/if}
                </Container>
            {/if}
        {/if}
    </Container>
{/if}