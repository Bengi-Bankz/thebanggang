import { createAsset } from 'pixi-svelte';

export const m = createAsset({
	img: new URL('./m.webp', import.meta.url).href,
	preload: true,
});

export default m;
