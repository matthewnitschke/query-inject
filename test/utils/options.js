
const selectors = require('./selectors.js');

module.exports = {
    clearOptions: async function() {
        await page.goto('chrome-extension://icadkknfmlcmfidfkgmofdepnempdcem/src/options/index.html');
    
        await page.evaluate(() => {
            let elements = document.getElementsByClassName('delete-button');
            for (let element of elements)
                element.click();
        });

        await page.click(`${selectors.globalEnabledCheckbox}:not(:checked)`)
        await page.click(`${selectors.removeDisabledParams}:checked`)
    
    },

    setupOptions: async function({
        globalEnabled,
        queryParams,
        urlMatchers,
        removeDisabledParams,
    }) {
        await page.goto('chrome-extension://icadkknfmlcmfidfkgmofdepnempdcem/src/options/index.html');
        
        if (globalEnabled) {
            await page.click(selectors.globalEnabledCheckbox)
        }
        
        if (queryParams) {
            for (let {key, value, isDisabled} of queryParams) {
                await page.click(selectors.queryParams.addButton);
                
                await page.type(selectors.queryParams.last.key, key)
                await page.type(selectors.queryParams.last.value, value)
                if (isDisabled) {
                    await page.click(selectors.queryParams.last.disableCheckbox);
                }
            }
        }
        
        await page.click(selectors.settingsDetails);

        if (urlMatchers) {
            for (let url of urlMatchers) {
                await page.click(selectors.urlMatchers.addButton);
                await page.type(selectors.urlMatchers.last.url, url);
            }
        }

        if (removeDisabledParams) {
            await page.click(selectors.removeDisabledParams);
        }
    },

    getUrlParams: function() {
        const url = new URL(page.url())
        const urlSearchParams = new URLSearchParams(url.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        return params;
    }

}




