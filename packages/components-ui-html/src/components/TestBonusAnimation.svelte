<script lang="ts">
	import { stateMetaDerived } from 'state-shared';

	const buyList = $derived(
		stateMetaDerived.betModeMetaList().filter((item) => item.type === 'buy'),
	);
</script>

<div class="test-container">
	<div class="animation-display">
		<h2>Buy List Animation Test</h2>
		<pre>{JSON.stringify(buyList, null, 2)}</pre>
	</div>
</div>

<style lang="scss">
	.test-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
	}

	.animation-display {
		background: rgba(0, 0, 0, 0.9);
		border: 2px solid rgba(255, 165, 0, 0.5);
		border-radius: 10px;
		padding: 2rem;
		max-width: 600px;
		max-height: 80vh;
		overflow: auto;
		color: white;
		text-align: center;

		h2 {
			margin-top: 0;
			color: rgba(255, 165, 0, 1);
			font-family: 'Crimes Times Six', sans-serif;
		}

		pre {
			text-align: left;
			background: rgba(0, 0, 0, 0.5);
			padding: 1rem;
			border-radius: 5px;
			overflow-x: auto;
			font-size: 0.875rem;
		}
	}
</style>
