const { expect, it, afterAll } = require("@jest/globals");
const {getUrlParams, setupOptions, clearOptions} = require('./utils/options.js');

const defaultOptions = {
    urlMatchers: ['https://www.google.com*'],
    queryParams: [
        {
            key: 'dev', 
            value: 'true',
            isDisabled: true
        },
        {
            key: 'alpha', 
            value: 'false',
        }
    ],
}

describe('Remove Disabled Params', () => {
    afterEach(async () => {
        await clearOptions()
    })

    it('keep disabled params when false', async () => {
        await setupOptions(defaultOptions)
        await page.goto('https://www.google.com/?dev=true');
        
        const params = getUrlParams();
        expect(params).toEqual({ dev: 'true' , alpha: 'false'});
    });

    it('remove disabled params when true', async () => {
        await setupOptions({
            ...defaultOptions,
            removeDisabledParams: true
        })
        await page.goto('https://www.google.com/?dev=true');
        
        const params = getUrlParams();
        expect(params).toEqual({ alpha: 'false' });
    });
});