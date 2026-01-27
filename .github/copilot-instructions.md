# Copilot Instructions for AI Coding Agents

## Project Overview
- This is a monorepo for building web games using Svelte 5, PixiJS 8, and TurboRepo, designed for integration with Stake Engine (https://engine.stake.com/).
- The architecture is modular: `/apps` contains game apps (e.g., lines, cluster), `/packages` contains reusable libraries (components, utils, state, config, etc.).
- All games and packages are TypeScript-first and use Svelte context for cross-component state and event management.

## Key Workflows
- **Install:** Use Node 22.16.0 and pnpm 10.5.0. Install dependencies with `pnpm install`.
- **Run Storybook:** `pnpm run storybook --filter=<MODULE_NAME>` (e.g., lines, cluster) to develop and test components/games in isolation.
- **Run Dev Server:** `pnpm run dev --filter=<MODULE_NAME>` to run a game app locally.
- **Build:** `pnpm run build --filter=<MODULE_NAME>` to generate static output for deployment.
- **Rebuild local packages** (e.g., pixi-svelte) after changes: `pnpm run build --filter=pixi-svelte`.

## Architectural Patterns
- **Event-driven:** Game logic is driven by `bookEvents` (from RGS) processed by handlers, which broadcast `emitterEvents` to Svelte components via a shared event emitter.
- **Task Breakdown:** Complex events are split into atomic emitterEvents for testability and maintainability. See `bookEventHandlerMap.ts` and component event handler maps.
- **Context Usage:** Svelte context is set at app/storybook entry points (see `setContext()` in each app) to provide event emitters, state machines (xstate), layout, and app state.
- **Monorepo Imports:** Local packages are referenced with `workspace:*` in dependencies for seamless cross-app/package usage.

## Conventions & Patterns
- **Naming:** Packages use `<type>-<specialization>` (e.g., components-pixi, utils-xstate). Shared packages are suffixed with `-shared`.
- **Testing:** Storybook stories are used for both atomic and integrated testing. Add new stories for each new event/component.
- **Types:** BookEvents and EmitterEvents use TypeScript union types for safety and intellisense. Update types in `typesBookEvent.ts` and `typesEmitterEvent.ts` when adding new events.
- **UI:** Use `components-ui-pixi` and `components-ui-html` as starting points for game UIs, but customize for branding.

## Integration Points
- **RGS (Remote Game Server):** Games consume books (JSON event sequences) from RGS. See `/apps/<game>/src/stories/data/` for book examples.
- **Authentication:** Handled in `Authenticate.svelte` in `components-shared`.
- **i18n:** Uses Lingui; see `lingui.config.ts` in each app/package.

## References
- See `/apps/lines` for a full-featured game example.
- See `/packages/utils-book`, `/packages/utils-event-emitter`, `/packages/utils-xstate`, `/packages/pixi-svelte` for core logic and context patterns.
- See `/apps/lines/src/game/bookEventHandlerMap.ts` and `/apps/lines/src/components/` for event-driven patterns.

## Tips for AI Agents
- Always update types and handler maps when adding new events.
- Use Storybook for rapid feedback and isolated testing.
- Prefer breaking down complex logic into small, testable emitterEvents.
- Reference the README for detailed workflow and architecture explanations.

## Asset Management (SvelteKit Static Assets)
- **Static Asset Referencing:** When adding new assets (images, JSON, etc.), always reference them using a path relative to the top of the monorepo, excluding the `static` folder. For example, if your asset is at `apps/cluster/static/assets/sprites/reelsFrame/reels_frame.png`, reference it in code as:
	```ts
	reelsFrame: {
		type: 'sprites',
		src: new URL('../../assets/sprites/reelsFrame/reels_frame.json', import.meta.url).href,
	},
	```
- **JSON + Image Bundling:** If you have a JSON file for the asset (e.g., a spritesheet), place it in the same folder as the image. Create an index file using `createAsset` from `pixi-svelte`:
	```ts
	import { createAsset } from 'pixi-svelte';
	import img from './reels_frame.png';
	import atlas from './reels_frame.json';
	export default createAsset({ img, atlas });
	```
- **Sprite Usage:** Use the asset by referencing the image key from the JSON in your `<Sprite key="..." />` component. Example:
	```svelte
	<Sprite key="frame_bg.png" ... />
	<Sprite key="frame_edge.png" ... />
	```
	These keys must match the image names defined in your asset's JSON.

---
_Last updated: 2026-01-26_
