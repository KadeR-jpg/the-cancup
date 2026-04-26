<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let userId = $state('');
	let existing = $state(false);

	if (browser) {
		const match = document.cookie.match(/(?:^|;\s*)user_id=([^;]+)/);
		if (match) {
			userId = decodeURIComponent(match[1]);
			existing = true;
		}
	}

	function enter(e: Event) {
		e.preventDefault();
		const name = userId.trim();
		if (!name) return;
		document.cookie = `user_id=${encodeURIComponent(name)}; path=/; max-age=31536000`;
		goto('/rate');
	}
</script>

<svelte:head>
	<title>The Can Cup</title>
</svelte:head>

<div class="landing">
	<div>
		<h1>The Can Cup</h1>
		<p class="tagline">Settle the debate. Rate your cans.</p>
	</div>

	<div class="entry-card">
		{#if existing}
			<p class="welcome">Welcome back, <strong>{userId}</strong></p>
		{/if}
		<form onsubmit={enter}>
			<input
				bind:value={userId}
				placeholder="your name / handle"
				maxlength="32"
				required
				autocomplete="off"
			/>
			<button type="submit">{existing ? 'Continue' : "Let's go"}</button>
		</form>
		<a href="/scoreboard" class="score-link">View Scoreboard</a>
	</div>
</div>
