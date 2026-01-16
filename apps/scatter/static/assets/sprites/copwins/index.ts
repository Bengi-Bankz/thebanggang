import { createAsset } from 'pixi-svelte';

import img from './copwins.webp';
import atlas from './copwins.webp.json';

export default createAsset({ img, atlas, preload: true });
