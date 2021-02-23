var app = new Vue({
    el: '#app',
    data: {
        globalEnabled: true,
        matchers: [{
            matchRegex: 'http://www.google.com',
            queryParams: [{
                enabled: true,
                key: 'debug',
                value: 'false'
            }]
        }],
    },
    mounted: function() {
        this.load();
    },
    methods: {
        addMatcher: function () {
            this.matchers.push({
                matchRegex: '',
                queryParams: []
            })
            this.save();
        },
        removeMatcher: function(matcherIndex) {
            this.matchers.splice(matcherIndex, 1);
            this.save();
        },
        addQueryParam: function(matcherIndex) {
            this.matchers[matcherIndex].queryParams.push({
                enabled: true
            })
            this.save();
        },
        removeQueryParam: function(matcherIndex, item) {
            let index = this.matchers[matcherIndex].queryParams.indexOf(item)
            this.matchers[matcherIndex].queryParams.splice(index, 1)
            this.save();
        },
        save: function() {
            console.log('saved');
            chrome.storage.sync.set({
                globalEnabled: this.globalEnabled,
                matchGroups: this.matchers
            });
        },
        load: function() {
            chrome.storage.sync.get(['globalEnabled', 'matchGroups'], ({globalEnabled, matchGroups}) => {
                this.globalEnabled = globalEnabled ?? this.globalEnabled;
                this.matchers = matchGroups ?? this.matchers;
            });            
        } 
    }
})