var app = new Vue({
    el: '#app',
    data: {
        globalEnabled: true,
        matchGroups: [{
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
        addMatchGroup: function () {
            this.matchGroups.push({
                matchRegex: '',
                queryParams: []
            })
            this.save();
        },
        removeMatcher: function(matchGroupIndex) {
            this.matchGroups.splice(matchGroupIndex, 1);
            this.save();
        },
        addQueryParam: function(matchGroupIndex) {
            this.matchGroups[matchGroupIndex].queryParams.push({
                enabled: true
            })
            this.save();
        },
        removeQueryParam: function(matchGroupIndex, item) {
            let index = this.matchGroups[matchGroupIndex].queryParams.indexOf(item)
            this.matchGroups[matchGroupIndex].queryParams.splice(index, 1)
            this.save();
        },
        save: function() {
            chrome.storage.sync.set({
                globalEnabled: this.globalEnabled,
                matchGroups: this.matchGroups
            });
        },
        load: function() {
            chrome.storage.sync.get(['globalEnabled', 'matchGroups'], ({globalEnabled, matchGroups}) => {
                this.globalEnabled = globalEnabled ?? this.globalEnabled;
                this.matchGroups = matchGroups ?? this.matchGroups;
            });            
        } 
    }
})