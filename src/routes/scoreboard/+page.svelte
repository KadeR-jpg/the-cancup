<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Scoreboard — The Can Cup</title>
</svelte:head>

<main>
	<h1>Scoreboard</h1>
	<p class="subtitle">Ranked by weighted average across all raters</p>

	{#if data.entries.length === 0}
		<div class="empty">
			<p>No ratings yet.</p>
			<p><a href="/rate">Be the first to rate!</a></p>
		</div>
	{:else}
		<div class="board">
			{#each data.entries as entry, i (entry.drink_id)}
				<div class="board-row" class:top3={i < 3}>
					<span class="rank">#{i + 1}</span>
					<span class="drink-name">{entry.name}</span>
					<span class="stars-display" title="{entry.avg_stars} average">
						{#each [1, 2, 3, 4, 5] as s}
							<span class:s-filled={s <= Math.round(entry.avg_stars)} class:s-empty={s > Math.round(entry.avg_stars)}>★</span>
						{/each}
						<span class="avg">{entry.avg_stars.toFixed(2)}</span>
					</span>
					<span class="count">{entry.rating_count} {entry.rating_count === 1 ? 'rating' : 'ratings'}</span>
				</div>
			{/each}
		</div>
	{/if}
</main>
