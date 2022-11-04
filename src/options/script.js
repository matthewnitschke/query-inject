const iconPath = "../../icons"

var app = new Vue({
    el: '#app',
    data: {
        globalEnabled: true,
        queryParams: [],
        urlMatchers: []
    },
    mounted: function() {
        this.load();
    },
    watch: {
        globalEnabled: function(isEnabled) {
            const iconText = isEnabled ? 'enabled' : 'disabled';
            chrome.browserAction.setIcon({ 
                path: {
                    "16": `${iconPath}/16-${iconText}.png`,
                    "48": `${iconPath}/48-${iconText}.png`,
                   "128": `${iconPath}/128-${iconText}.png` 
                } 
            })
        }
    },
    methods: {
        hasDuplicateKey: function(item) {
            return this.queryParams
                .filter(({key}) => item.key == key)
                .length > 1;
        },
        addQueryParam: function () {
            this.queryParams.push({
                enabled: true
            })

            this.save();
        },
        removeQueryParam: function(item) {
            let index = this.queryParams.indexOf(item)
            this.queryParams.splice(index, 1)

            this.save();
        },
        addMatcher: function() {
            this.urlMatchers.push({
                enabled: true,
            });
            
            this.save();
        },
        removeUrlMatcher: function(item) {
            let index = this.urlMatchers.indexOf(item)
            this.urlMatchers.splice(index, 1)

            this.save();
        },
        save: function() {
            chrome.storage.sync.set({
                globalEnabled: this.globalEnabled,
                queryParams: this.queryParams,
                urlMatchers: this.urlMatchers
            });
        },
        load: function() {
            chrome.storage.sync.get(['globalEnabled', 'queryParams', 'urlMatchers'], ({globalEnabled, queryParams, urlMatchers}) => {
                this.globalEnabled = globalEnabled ?? this.globalEnabled;
                this.queryParams = queryParams ?? this.queryParams;
                this.urlMatchers = urlMatchers ?? this.urlMatchers;
            });            
        } 
    }
})