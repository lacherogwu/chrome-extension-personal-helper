export async function getCurrentTab() {
	const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
	if (!activeTab) throw new Error('No active tab found');
	return activeTab;
}

export async function executeScript<T>(tabId: number, cb: () => T) {
	const result = await chrome.scripting.executeScript<any[], T>({
		target: { tabId },
		func: cb,
	});
	return result[0].result as T;
}

export async function executeScriptCurrentTab<T>(cb: () => T) {
	const tab = await getCurrentTab();
	if (!tab.id) throw new Error('No active tab found');
	return executeScript(tab.id, cb);
}
