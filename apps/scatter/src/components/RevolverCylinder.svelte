<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { Container, Sprite, Circle } from 'pixi-svelte';
	import { waitForTimeout } from 'utils-shared/wait';
	import { stateBetDerived } from 'state-shared';
	import { SYMBOL_SIZE } from '../game/constants';

	type Props = {
		bulletCount: number;
		onLoadComplete?: () => void;
		onFireComplete?: () => void;
	};

	const props: Props = $props();

	// Animation state
	let phase = $state<'loading' | 'loaded' | 'firing'>('loading');
	const cylinderRotation = new Tween(0);
	const cylinderScale = new Tween(0.5);

	// Track fired bullets
	let firedBullets = $state(0);

	// Configuration
	const CYLINDER_RADIUS = SYMBOL_SIZE * 0.6;
	const BULLET_SIZE = SYMBOL_SIZE * 0.15;
	const ROTATION_SPEED = 300; // ms per rotation

	// Generate bullet positions around cylinder
	const bulletPositions = Array.from({ length: props.bulletCount }, (_, i) => {
		const angle = (i / props.bulletCount) * Math.PI * 2;
		return {
			index: i,
			angle,
			x: Math.cos(angle) * CYLINDER_RADIUS,
			y: Math.sin(angle) * CYLINDER_RADIUS,
		};
	});

	// Play loading animation
	export const playLoadAnimation = async () => {
		phase = 'loading';
		// Scale up the cylinder with rotation
		await cylinderScale.set(1, { duration: 600 / stateBetDerived.timeScale() });
		// Spin it while loading
		await cylinderRotation.set(Math.PI * 2, { duration: 800 / stateBetDerived.timeScale() });
		phase = 'loaded';
		props.onLoadComplete?.();
	};

	// Fire a bullet (rotate and remove)
	export const fireBullet = async () => {
		if (firedBullets >= props.bulletCount) return;

		phase = 'firing';
		// Rotate cylinder to next position
		const nextAngle = ((firedBullets + 1) / props.bulletCount) * Math.PI * 2;
		await cylinderRotation.set(nextAngle, { duration: 300 / stateBetDerived.timeScale() });

		firedBullets += 1;
		phase = firedBullets >= props.bulletCount ? 'loaded' : 'loaded';

		props.onFireComplete?.();
	};

	// Visibility for fired bullets
	const isBulletVisible = (index: number) => index >= firedBullets;
</script>

<Container x={0} y={0} scale={cylinderScale.current} rotation={cylinderRotation.current}>
	<!-- Cylinder center cap -->
	<Circle
		x={0}
		y={0}
		radius={SYMBOL_SIZE * 0.08}
		fill={0x2c2c2c}
	/>

	<!-- Bullet chambers -->
	{#each bulletPositions as bullet (bullet.index)}
		{#if isBulletVisible(bullet.index)}
			<Container x={bullet.x} y={bullet.y}>
				<!-- Bullet casing (gold/brass color) -->
				<Circle
					x={0}
					y={0}
					radius={BULLET_SIZE * 0.4}
					fill={0xd4af37}
				/>

				<!-- Bullet tip (silver) -->
				<Circle
					x={0}
					y={-BULLET_SIZE * 0.2}
					radius={BULLET_SIZE * 0.3}
					fill={0xc0c0c0}
				/>
			</Container>
		{/if}
	{/each}

	<!-- Cylinder body (subtle circle outline) -->
	<Circle
		x={0}
		y={0}
		radius={CYLINDER_RADIUS + BULLET_SIZE * 0.5}
		fill={0x000000}
		fillAlpha={0}
		stroke={0x666666}
		strokeWidth={2}
	/>
</Container>
