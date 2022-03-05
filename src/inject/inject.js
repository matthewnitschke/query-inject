chrome.storage.sync.get([
	'globalEnabled',
	'queryParams',
	'urlMatchers',
], ({
	globalEnabled,
	queryParams,
	urlMatchers,
}) => {
	if (!history.pushState) return;

	let matchers = (urlMatchers ?? []);

    if (!globalEnabled || matchers.length <= 0) {
        return;
    }

	// Parse the params
	const {
		paramsToAdd,
		paramsToDelete
	} = parseParameters(window.location.href, matchers, queryParams);
	
	// Log what will happen
	console.groupCollapsed('Query Inject');
	console.log(JSON.stringify({
		injected: paramsToAdd, 
		deleted: paramsToDelete,
	}, null, 2));
	console.groupEnd();

	// Preform the injection/exclusion
	let searchParams = new URLSearchParams(window.location.search);
	paramsToAdd.forEach(({key, value}) => searchParams.set(key, value));
	paramsToDelete.forEach(searchParams.delete);
	setUrlSearchParams(searchParams);
});

function parseParameters(
	currentUrl,
	urlMatchers,
	queryParams,
) {
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


	if (doesUrlMatch(currentUrl, enabledUrls)) {		
		const {
			enabledParams,
			disabledParams
		} = queryParams.reduce((acc, {enabled, key, value}) => {
			if (enabled) {
				acc.enabledParams[key] = value
			} else {
				acc.disabledParams[key] = value
			}
			return acc;
		}, {enabledParams: {}, disabledParams: {}});

		let paramsToDelete = Object.keys(disabledParams)
			.filter(key => !enabledParams.hasOwnProperty(key));

		return {
			paramsToAdd: enabledParams,
			paramsToDelete
		}

	} else if (doesUrlMatch(currentUrl, disabledUrls)) {
		// if the current url matches any of the disabledUrls (and non of the enabled urls), clear all params
		return {
			paramsToAdd: {},
			paramsToDelete: queryParams.map(({key}) => key)
		}
	}
}

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
