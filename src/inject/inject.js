function injectParams(queryParams) {
	if (!history.pushState) return;

	console.log(`Injecting Parameters: ${JSON.stringify(queryParams)}`);

	let searchParams = new URLSearchParams(window.location.search);

	queryParams
		.filter(param => param.enabled)
		.forEach(({key, value}) => searchParams.set(key, value))

	queryParams
		.filter(param => !param.enabled)
		.forEach(({key, value}) => searchParams.delete(key, value))

	let newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

	if (searchParams.toString().trim().length > 0) {
		newUrl += `?${searchParams.toString()}`
	}

	window.history.pushState({path: newUrl}, '', newUrl);
}

chrome.storage.sync.get(['globalEnabled', 'queryParams', 'urlMatches'], ({globalEnabled, queryParams, urlMatches}) => {
    if (!globalEnabled || (urlMatches ?? '').length <= 0) {
        return;
    }

	let reg = new RegExp(urlMatches)
	if (!window.location.href.match(reg)) {
		return
	}

	injectParams(queryParams);
});
