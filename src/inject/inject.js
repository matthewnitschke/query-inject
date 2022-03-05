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
	console.log(JSON.stringify({paramsToAdd, paramsToDelete}, null, 2));
	console.groupEnd();

	// Preform the injection/exclusion
	let searchParams = new URLSearchParams(window.location.search);
	paramsToAdd.forEach(({key, value}) => searchParams.set(key, value));
	paramsToDelete.forEach(({key}) => searchParams.delete(key));
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
		}, {enabledParams: {}, disabledParams: {}});

		let paramsToDelete = Object.keys(disabledParams)
			.filter(key => !enabledParams.hasOwnProperty(key))
			.reduce((acc, key) => (res[key] = disabledParams[key]), {})

		return {
			paramsToAdd: enabledParams,
			paramsToDelete
		}

	} else if (doesUrlMatch(currentUrl, disabledUrls)) {
		// if the current url matches any of the disabledUrls (and non of the enabled urls), clear all params
		return {
			paramsToAdd: {},
			paramsToDelete: queryParams.reduce((acc, {key, value}) => ({...acc, [key]: value}), {})
		}
	}
}

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

	console.groupCollapsed("Params Deleted from URL");
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
