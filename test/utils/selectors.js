module.exports = {
    globalEnabledCheckbox: '#globalEnabledCheckbox',

    queryParams: {
        addButton: '#addQueryParamButton',
        last: {
            disableCheckbox: '#queryParams div:last-child input:nth-child(1)',
            key: '#queryParams div:last-child input:nth-child(2)',
            value: '#queryParams div:last-child input:nth-child(3)',
            deleteButton: '#queryParams div:last-child input:nth-child(4)',
        }
    },

    settingsDetails: '#settingsDetails',

    urlMatchers: {
        addButton: '#addUrlMatcherButton',
        last: {
            disableCheckbox: '#urlMatchers div:last-child input:nth-child(1)',
            url: '#urlMatchers div:last-child input:nth-child(2)',
            deleteButton: '#urlMatchers div:last-child input:nth-child(4)',
        }
    },

    removeDisabledParams: '#removeDisabledParamsCheckbox'
}