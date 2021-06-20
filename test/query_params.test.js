const { expect, it, afterAll } = require("@jest/globals");
const {getUrlParams, setupOptions, clearOptions} = require('./utils/options.js');

describe('Query Params', () => {
    afterEach(async () => {
        await clearOptions()
    })

    it('should inject "?dev=true&alpha=false"', async () => {
        await setupOptions({
            urlMatchers: ['https://www.google.com*'],
            queryParams: [
                {key: 'dev', value: 'true'},
                {key: 'alpha', value: 'false'}
            ]
        })

        await page.goto('https://www.google.com');
        
        const params = getUrlParams();
        expect(params).toEqual({dev: 'true', alpha: 'false'})
    });

    it('should not inject disabled params', async () => {
        await setupOptions({
            urlMatchers: ['https://www.google.com*'],
            queryParams: [
                {key: 'dev', value: 'true'},
                {key: 'alpha', value: 'false', isDisabled: true}
            ]
        })

        await page.goto('https://www.google.com');
        
        const params = getUrlParams();
        expect(params).toEqual({dev: 'true'})
    });

    it('should not inject when global enabled is false', async () => {
        await setupOptions({
            urlMatchers: ['https://www.google.com*'],
            queryParams: [
                {key: 'dev', value: 'true'},
            ],
            globalEnabled: false
        })

        await page.goto('https://www.google.com');
        
        const params = getUrlParams();
        expect(params).not.toEqual({dev: 'true'})
    });
});