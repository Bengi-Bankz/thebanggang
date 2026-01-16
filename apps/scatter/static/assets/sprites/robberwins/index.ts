import { createAsset } from 'pixi-svelte';

import img from './robberwins.webp';
import atlas from './robberwins.webp.json';

export default createAsset({ img, atlas, preload: true });
