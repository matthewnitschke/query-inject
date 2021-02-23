function insertUrlParam(key, value) {
	if (history.pushState) {
		let searchParams = new URLSearchParams(window.location.search);
		searchParams.set(key, value);
		let newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${searchParams.toString()}`;
		window.history.pushState({path: newurl}, '', newurl);
	}
}

function injectParams(queryParams) {
	console.log(`Injecting Parameters: ${JSON.stringify(queryParams)}`);

	let searchParams = new URLSearchParams(window.location.search);
	
	queryParams
		.filter(param => param.enabled)
		.forEach(({key, value}) => searchParams.set(key, value))

	queryParams
		.filter(param => !param.enabled)
		.forEach(({key}) => searchParams.delete(key))

	let newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${searchParams.toString()}`;
	window.history.pushState({path: newurl}, '', newurl);
}

chrome.storage.sync.get(['globalEnabled', 'matchGroups'], ({globalEnabled, matchGroups}) => {
    if (!globalEnabled) {
        return;
    }

	(matchGroups ?? []).forEach(({matchRegex, queryParams}) => {
		let reg = new RegExp(matchRegex)
		if (!window.location.href.match(reg)) {
			return
		}

		injectParams(queryParams);
	});
});
