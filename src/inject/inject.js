function generateNewUrl(url, searchParams) {
	let newUrl = `${url.protocol}//${url.host}${url.pathname}`;

	if (searchParams.toString().trim().length > 0) {
		newUrl += `?${searchParams.toString()}`
	}

	// add the hash, contains the '#' character
	newUrl += url.hash

	return newUrl
}

function injectParams(url, queryParams) {
	let searchParams = new URLSearchParams(url.search);

	queryParams
		.filter(param => param.enabled)
		.forEach(({key, value}) => searchParams.set(key, value))
	
	queryParams
		.filter(param => !param.enabled)
		.forEach(({key, value}) => searchParams.delete(key, value))

	return generateNewUrl(url, searchParams);
}

function clearInjectedParams(url, queryParams) {
	let searchParams = new URLSearchParams(url.search);

	queryParams
		.forEach(({key, value}) => searchParams.delete(key, value))

	return generateNewUrl(url, searchParams);
}

function doesUrlMatch(url, matchUrls) {
	const regexUrl = `(${matchUrls.join(')|(')})`
		.replace(/\//g, '\\/') // escape '/' charachters
		.replace(/\*/g, '.*'); // convert '*' into '.*' for match all

	return RegExp(`^${regexUrl}$`, 'i').test(url)
}

export default function getInjectedUrl({
	globalEnabled, 
	queryParams, 
	urlMatchers,
	currentUrl,
}) {
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

	if (doesUrlMatch(currentUrl.href, enabledUrls)) {
		// if the current url matches any of the enabledUrls, inject the params
		return injectParams(currentUrl, queryParams);
	} else if (doesUrlMatch(currentUrl.href, disabledUrls)) {
		// if the current url matches any of the disabledUrls (and non of the enabled urls), clear all params
		return clearInjectedParams(currentUrl, queryParams)
	}
}
