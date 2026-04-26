<script lang="ts">
	import { browser } from '$app/environment';
	import '../app.css';

	let { children } = $props();

	let userId = $state('');

	if (browser) {
		const match = document.cookie.match(/(?:^|;\s*)user_id=([^;]+)/);
		if (match) userId = decodeURIComponent(match[1]);
	}
</script>

<nav>
	<a href="/" class="brand">The Can Cup</a>
	<span class="nav-spacer"></span>
	{#if userId}
		<span class="user-chip">{userId}</span>
		<a href="/rate">My Ratings</a>
	{/if}
	<a href="/scoreboard">Scoreboard</a>
</nav>

{@render children()}
