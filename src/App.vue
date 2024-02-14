<script setup lang="ts">
import { ref } from 'vue';
import { executeScriptCurrentTab } from './utils';

const copiedPrIds = ref(false);
let copiedPrIdsTimeout: number;

async function handleCopyPrIds() {
	const urls = await executeScriptCurrentTab(() => {
		const prsContainerEl = getPRContainerEl();
		if (!prsContainerEl) return [];

		const els = prsContainerEl.querySelectorAll<HTMLAnchorElement>('a[href*="github.com"');
		return Array.from(els).map(el => el.href);

		function getPRContainerEl() {
			const els = document.querySelectorAll('div.title');

			for (const el of els) {
				const title = el.textContent;
				if (title?.includes('Pull Requests')) {
					return el.parentElement?.parentElement;
				}
			}
		}
	});

	const prIds = urls.map(url => url.slice(url.lastIndexOf('/') + 1)).sort((a, b) => +a - +b);
	if (!prIds.length) return;
	clearTimeout(copiedPrIdsTimeout);
	navigator.clipboard.writeText(prIds.join(' '));
	copiedPrIds.value = true;
	copiedPrIdsTimeout = setTimeout(() => (copiedPrIds.value = false), 2000);
}
</script>

<template>
	<h2 class="text-3xl font-medium mb-4">Personal Helper</h2>
	<button class="mb-1" @click="handleCopyPrIds">Copy ClickUp PR IDs</button>
	<p v-show="copiedPrIds" class="text-green-600">copied</p>
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
