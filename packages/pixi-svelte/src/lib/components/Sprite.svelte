<script lang="ts" module>
	import * as PIXI from 'pixi.js';

	import { type Props as BaseProps } from './BaseSprite.svelte';

	export type Props = Omit<BaseProps, 'texture'> & {
		debug?: boolean;
		key: string;
	};
</script>

<script lang="ts">
	import BaseSprite from './BaseSprite.svelte';
	import { getContextApp } from '../context.svelte';
	import type { LoadedSprite } from '../types';

	const { debug, key, ...baseSpriteProps }: Props = $props();
	const context = getContextApp();
	const texture = $derived(
		(context.stateApp.loadedAssets?.[key] || PIXI.Texture.EMPTY) as LoadedSprite,
	);

	const missingKeysLogged = new Set<string>();
	$effect(() => {
		if (debug) return;
		if (texture === PIXI.Texture.EMPTY && !missingKeysLogged.has(key)) {
			missingKeysLogged.add(key);
			console.warn(`Sprite: key "${key}" is not found in the loadedAssets`);
		}
	});
</script>

{#if debug}
	{console.log('Sprite loadedAssets', $state.snapshot(context.stateApp).loadedAssets)}
{/if}

<BaseSprite {...baseSpriteProps} {texture} />
