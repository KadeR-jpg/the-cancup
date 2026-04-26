<script lang="ts">
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Intentionally capture initial server value; managed locally from here
	let ratingMap = $state<Record<number, number>>(untrack(() => ({ ...data.ratingMap })));
	let imgErrors = $state<Record<number, boolean>>({});

	function getRotation(id: number): number {
		return (((id * 37) % 9) - 4) * 0.45;
	}
</script>

<svelte:head>
	<title>Rate Your Cans — The Can Cup</title>
</svelte:head>

<main>
	<h1>Rate Your Cans</h1>
	<p class="subtitle">Rating as <strong style="color: var(--text)">{data.userId}</strong></p>

	<div class="sticker-grid">
		{#each data.drinks as drink (drink.id)}
			{@const hue = (drink.id * 47) % 360}
			{@const rotation = getRotation(drink.id)}
			<div class="sticker-card" style="--rotation: {rotation}deg; --hue: {hue}">
				<div class="sticker-img-wrap">
					{#if imgErrors[drink.id]}
						<div class="sticker-placeholder">
							{drink.name}
						</div>
					{:else}
						<img
							src="/stickers/{drink.slug}.png"
							alt={drink.name}
							class="sticker-img"
							onerror={() => {
								imgErrors[drink.id] = true;
							}}
						/>
					{/if}
				</div>

				<div class="drink-name">{drink.name}</div>

				<form
					method="POST"
					action="?/rate"
					use:enhance={() => async ({ update }) => update({ reset: false })}
				>
					<input type="hidden" name="drink_id" value={drink.id} />
					<div class="stars" role="group" aria-label="Rate {drink.name}">
						{#each [1, 2, 3, 4, 5] as star}
							<button
								type="submit"
								name="stars"
								value={ratingMap[drink.id] === star ? 0 : star}
								class="star"
								class:filled={star <= (ratingMap[drink.id] ?? 0)}
								onclick={() => {
									ratingMap[drink.id] = ratingMap[drink.id] === star ? 0 : star;
								}}
								aria-label="{star} star"
							>★</button>
						{/each}
					</div>
				</form>
			</div>
		{/each}
	</div>
</main>
