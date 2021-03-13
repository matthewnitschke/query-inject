import getInjectedUrl from './inject.js';

chrome.storage.sync.get(
    ['globalEnabled', 'queryParams', 'urlMatchers'], 
    ({globalEnabled, queryParams, urlMatchers}) => {
        if (!history.pushState) return;

        let injectedUrl = getInjectedUrl({
            globalEnabled,
            queryParams,
            urlMatchers,
            currentUrl: window.location
        })

        if (injectedUrl !== null) {
            window.history.pushState({path: injectedUrl}, '', injectedUrl);
        }
    }
);
