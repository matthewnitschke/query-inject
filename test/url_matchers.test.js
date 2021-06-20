const { expect, it, afterAll } = require("@jest/globals");
const {getUrlParams, setupOptions, clearOptions} = require('./utils/options.js');

const testParams = { dev: 'true' }
const defaultOptions = {
    queryParams: [{
        key: 'dev', 
        value: 'true',
    }]
}

describe('Url Matchers', () => {
    afterEach(async () => {
        await clearOptions()
    })

    it('should inject for exact url match', async () => {
        await setupOptions({
            ...defaultOptions,
            urlMatchers: ['https://www.google.com/'],
        })
        await page.goto('https://www.google.com/');
        
        const params = getUrlParams();
        expect(params).toEqual(testParams)
    });

    it('should not inject for no match', async () => {
        await setupOptions({
            ...defaultOptions,
            urlMatchers: ['https://www.foo.com*'],
        })

        await page.goto('https://www.google.com');
        
        const params = getUrlParams();
        expect(params).not.toEqual(testParams)
    });

    it('should inject for multiple different matches', async () => {
        await setupOptions({
            ...defaultOptions,
            urlMatchers: [
                'https://developer.mozilla.org*',
                'https://www.google.com*',
            ],
        })
        
        await page.goto('https://developer.mozilla.org');
        await page.waitForTimeout(1000);
        let params = getUrlParams();
        expect(params).toEqual(testParams)

        await page.goto('https://www.google.com');
        await page.waitForTimeout(1000);
        params = getUrlParams();
        expect(params).toEqual(testParams)

    }, 10000);
});