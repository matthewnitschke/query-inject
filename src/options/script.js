let root = document.body;

let globalEnabled = true;
let queryParams = [];
let urlMatchers = [];

chrome.storage.sync.get(['globalEnabled', 'queryParams', 'urlMatchers'], (storage) => {
    globalEnabled = storage.globalEnabled ?? true;
    queryParams = storage.queryParams ?? [];
    urlMatchers = storage.urlMatchers ?? [];

    refreshExtensionIcon();
    runApp();
});

function runApp() {
    m.mount(root, {
        onupdate: function() {
            chrome.storage.sync.set({
                globalEnabled,
                queryParams,
                urlMatchers,
            });
        },
        view: function() {
            return m('main', [
                m('h2', 'Query Inject'),
                m('div', { class: 'global-enabled-wrapper' }, [
                    m('input', {
                        type:'checkbox', 
                        id: 'globalEnabled', 
                        checked: globalEnabled, 
                        onchange: (e) => { 
                            globalEnabled = e.target.checked;
                            chrome.storage.sync.set({ globalEnabled });
                            refreshExtensionIcon();
                        } 
                    }),
                    m('label', { for: 'globalEnabled' }, ['Enabled'])
                ]),
    
                m('div', {class: globalEnabled ? '' : 'disabled'}, [
                    m('h3', 'Query Params to Inject'),
                    
                    queryParams.map((queryParam) => 
                        m('div', {class: hasDuplicateKey(queryParam) ? 'duplicate-key-warning' : ''}, [
                            m('div', {class: 'input-param-wrapper'}, [
                                m('input', { 
                                    type: 'checkbox', 
                                    checked: queryParam.enabled,
                                    onchange: (e) => queryParam.enabled = e.target.checked,
                                }),
                                m('input', { 
                                    type: 'text',
                                    placeholder: 'key',
                                    value: queryParam.key ?? '',
                                    onchange: (e) => queryParam.key = e.target.value,
                                }),
                                m('input', {
                                    type: 'text',
                                    placeholder: 'value',
                                    style: 'flex-shrink: 2',
                                    value: queryParam.value ?? '',
                                    onchange: (e) => queryParam.value = e.target.value
                                }),
                                m('input', {
                                    type: 'button', 
                                    value: '✕', 
                                    class: 'delete-button',
                                    onclick: () => queryParams = queryParams.filter((p) => p !== queryParam),
                                }),
                            ])
                        ]),
                    ),
                    m('input', {
                        type: 'button',
                        class: 'button',
                        value: '+',
                        onclick: () => {
                            queryParams.push({ enabled: true })
                        }
                    }),
    
                    m('h3', 'Url Matchers'),
                    urlMatchers.map((urlMatcher) => 
                        m('div', {class: 'input-param-wrapper'}, [
                            m('input', { 
                                type: 'checkbox', 
                                checked: urlMatcher.enabled,
                                onchange: (e) => urlMatcher.enabled = e.target.checked,
                            }),
                            m('input', { 
                                type: 'text',
                                placeholder: 'key',
                                value: urlMatcher.matchStr ?? '',
                                onchange: (e) => urlMatcher.matchStr = e.target.value,
                            }),
                            m('input', {
                                type: 'button', 
                                value: '✕', 
                                class: 'delete-button',
                                onclick: () => urlMatchers = urlMatchers.filter((m) => m !== urlMatcher)
                            }),
                        ])
                    ),
                    m('input', {
                        type: 'button',
                        class: 'button',
                        value: '+',
                        onclick: () => {
                            urlMatchers.push({ enabled: true })
                        }
                    }),
                ]),
            ])
        }
    })
}

function hasDuplicateKey(item) {
    return queryParams
        .filter(({key}) => item.key == key)
        .length > 1;
}

function refreshExtensionIcon() {
    const iconPath = '../../icons'
    const iconText = globalEnabled ? 'enabled' : 'disabled';
    chrome.action.setIcon({ 
        path: {
            '16': `${iconPath}/16-${iconText}.png`,
            '48': `${iconPath}/48-${iconText}.png`,
            '128': `${iconPath}/128-${iconText}.png` 
        } 
    })
}