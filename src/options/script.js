var app = new Vue({
    el: '#app',
    data: {
        globalEnabled: true,
        queryParams: [],
        urlMatches: ''
    },
    mounted: function() {
        this.load();
    },
    methods: {
        add: function () {
            this.queryParams.push({
                enabled: true
            })

            this.save();
        },
        remove: function(item) {
            let index = this.queryParams.indexOf(item)
            this.queryParams.splice(index, 1)

            this.save();
        },
        save: function() {
            chrome.storage.sync.set({
                globalEnabled: this.globalEnabled,
                queryParams: this.queryParams,
                urlMatches: this.urlMatches
            });
        },
        load: function() {
            chrome.storage.sync.get(['globalEnabled', 'queryParams', 'urlMatches'], ({globalEnabled, queryParams, urlMatches}) => {
                this.globalEnabled = globalEnabled ?? this.globalEnabled;
                this.queryParams = queryParams ?? this.queryParams;
                this.urlMatches = urlMatches ?? this.urlMatches;
            });            
        } 
    }
})