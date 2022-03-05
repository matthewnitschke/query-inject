function injectParams(queryParams) {
	let searchParams = new URLSearchParams(window.location.search);

	console.groupCollapsed('Injecting Query Parameters');

	let enabledParameters = queryParams
		.filter(({enabled}) => enabled)
		.reduce((acc, {key, value}) => {
			searchParams.set(key, value);
			console.log(`${key}: '${value}'`);
			return [...acc, key];
		}, []);

	console.group("Params Deleted from URL");
	queryParams
		.filter(({key, enabled}) => !enabled && !enabledParameters.hasOwnProperty(key))
		.forEach(({key, value}) => {
			searchParams.delete(key, value);
			console.log(`${key}: '${value}'`)
		});
	
	console.groupEnd();
	console.groupEnd();

	setUrlSearchParams(searchParams);
}

function clearInjectedParams(queryParams) {
	let searchParams = new URLSearchParams(window.location.search);

	queryParams
		.forEach(({key, value}) => searchParams.delete(key, value))

	setUrlSearchParams(searchParams);
}

chrome.storage.sync.get(['globalEnabled', 'queryParams', 'urlMatchers'], ({globalEnabled, queryParams, urlMatchers}) => {
	if (!history.pushState) return;

	let matchers = (urlMatchers ?? []);

    if (!globalEnabled || matchers.length <= 0) {
        return;
    }

	const {
		enabledUrls,
		disabledUrls,
	} = urlMatchers.reduce((acc, {enabled, matchStr}) => {
		if (enabled) {
			acc.enabledUrls.push(matchStr)
		} else {
			acc.disabledUrls.push(matchStr)
		}
		return acc
	}, {enabledUrls: [], disabledUrls: []});

	if (doesUrlMatch(window.location.href, enabledUrls)) {
		// if the current url matches any of the enabledUrls, inject the params
		injectParams(queryParams);
	} else if (doesUrlMatch(window.location.href, disabledUrls)) {
		// if the current url matches any of the disabledUrls (and non of the enabled urls), clear all params
		clearInjectedParams(queryParams)
	}
});

// ------------------------------------ Utils ------------------------------------

function setUrlSearchParams(searchParams) {
	let newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

	if (searchParams.toString().trim().length > 0) {
		newUrl += `?${searchParams.toString()}`
	}

	// add the hash, contains the '#' character
	newUrl += window.location.hash

	window.history.pushState({path: newUrl}, '', newUrl);
}

function doesUrlMatch(url, matchUrls) {
	const regexUrl = `(${matchUrls.join(')|(')})`
		.replace(/\//g, '\\/') // escape '/' charachters
		.replace(/\*/g, '.*'); // convert '*' into '.*' for match all

	return RegExp(`^${regexUrl}$`, 'i').test(url)
}
