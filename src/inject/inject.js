function injectParams(queryParams) {
	console.log(`Injecting Parameters: ${JSON.stringify(queryParams)}`);

	let searchParams = new URLSearchParams(window.location.search);

	queryParams
		.filter(param => param.enabled)
		.forEach(({key, value}) => searchParams.set(key, value))
	
	queryParams
		.filter(param => !param.enabled)
		.forEach(({key, value}) => searchParams.delete(key, value))

	setUrlSearchParams(searchParams);
}

function clearInjectedParams(queryParams) {
	let searchParams = new URLSearchParams(window.location.search);
	
	queryParams
		.forEach(({key, value}) => searchParams.delete(key, value))

	setUrlSearchParams(searchParams);
}

function setUrlSearchParams(searchParams) {
	let newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

	if (searchParams.toString().trim().length > 0) {
		newUrl += `?${searchParams.toString()}`
	}

	window.history.pushState({path: newUrl}, '', newUrl);
}

function doesUrlMatch(url, matchUrls) {
	const enabledUrls = matchUrls
		.filter(({enabled}) => enabled)
		.map(({matchStr}) => matchStr);

	const regexUrl = `(${enabledUrls.join(')|(')})`
		.replace(/\//g, '\\/') // escape '/' charachters
		.replace(/\*/g, '.*'); // convert '*' into '.*' for match all

	return RegExp(`^${regexUrl}$`, 'i').test(url)
}

chrome.storage.sync.get(['globalEnabled', 'queryParams', 'urlMatchers'], ({globalEnabled, queryParams, urlMatchers}) => {
	if (!history.pushState) return;

	let matchers = (urlMatchers ?? []);

    if (!globalEnabled || matchers.length <= 0) {
        return;
    }

	if (doesUrlMatch(window.location.href, matchers)) {
		injectParams(queryParams);
	} else {
		clearInjectedParams(queryParams);
	}
});
