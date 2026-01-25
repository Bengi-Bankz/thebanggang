import { createAsset } from 'pixi-svelte';

import h1Img from './h1.webp';
import h1Atlas from './h1.webp.json';
import h2Img from './h2.webp';
import h2Atlas from './h2.webp.json';
import h3Img from './h3.webp';
import h3Atlas from './h3.webp.json';
import h4Img from './h4.webp';
import h4Atlas from './h4.webp.json';
import h5Img from './h5.webp';
import h5Atlas from './h5.webp.json';
import l1Img from './l1.webp';
import l1Atlas from './l1.webp.json';
import l2Img from './l2.webp';
import l2Atlas from './l2.webp.json';
import l3Img from './l3.webp';
import l3Atlas from './l3.webp.json';
import l4Img from './l4.webp';
import l4Atlas from './l4.webp.json';
import mImg from './m.webp';
import mAtlas from './m.webp.json';
import sImg from './s.webp';
import sAtlas from './s.webp.json';

export const h1 = createAsset({ img: h1Img, atlas: h1Atlas, preload: true });
export const h2 = createAsset({ img: h2Img, atlas: h2Atlas, preload: true });
export const h3 = createAsset({ img: h3Img, atlas: h3Atlas, preload: true });
export const h4 = createAsset({ img: h4Img, atlas: h4Atlas, preload: true });
export const h5 = createAsset({ img: h5Img, atlas: h5Atlas, preload: true });
export const l1 = createAsset({ img: l1Img, atlas: l1Atlas, preload: true });
export const l2 = createAsset({ img: l2Img, atlas: l2Atlas, preload: true });
export const l3 = createAsset({ img: l3Img, atlas: l3Atlas, preload: true });
export const l4 = createAsset({ img: l4Img, atlas: l4Atlas, preload: true });
export const m = createAsset({ img: mImg, atlas: mAtlas, preload: true });
export const s = createAsset({ img: sImg, atlas: sAtlas, preload: true });

export default {
	h1,
	h2,
	h3,
	h4,
	h5,
	l1,
	l2,
	l3,
	l4,
	m,
	s,
};
