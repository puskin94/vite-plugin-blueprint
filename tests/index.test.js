const {describe, it} = require('node:test');
const assert = require('node:assert')

const vitePluginBlueprint = require('../index');

describe('vitePluginBlueprint', () => {
    describe('load', () => {
        it('returns nothing if the id does not contain the prefix', async () => {
            const plugin = vitePluginBlueprint({
                prefix: 'tests',
                root: () => {},
                files: [],
            });

            const result = await plugin.load('some-id');

            assert.strictEqual(result, undefined);
        });

        it('returns the content of the tests/test-file if the id contains the prefix', async () => {
            const plugin = vitePluginBlueprint({
                prefix: 'tests',
                root: () => __dirname,
                files: [],
            });

            const result = await plugin.load('tests./test-file');

            assert.strictEqual(result.code, 'test-file\n');
            assert.strictEqual(result.map, null);
        });
    });
});
