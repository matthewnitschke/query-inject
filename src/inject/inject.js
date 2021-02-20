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
	queryParams
		.filter(param => param.enabled)
		.forEach(({key, value}) => insertUrlParam(key, value))
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
