var app = new Vue({
    el: '#app',
    data: {
        globalEnabled: true,
        queryParams: [],
        urlMatchers: [
            { enabled: true, matchStr: "http://www.google.com/*" }
        ]
    },
    mounted: function() {
        this.load();
    },
    methods: {
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