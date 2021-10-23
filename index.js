const { fileURLToPath } = require('url')
const { dirname, join, resolve } = require('path')
const { readFile, pathExists } = require('fs-extra')

function vitePluginBlueprint ({ prefix, root, files }) {
  const roots = {
    blueprint: root((...args) => resolve(urlJoin(...args))),
    app: null,
  }
  return {
    name: 'vite-plugin-blueprint',
    configResolved (config) {
      roots.app = config.root
    },
    async resolveId (id) {
      const [, shadow] = id.split(`${prefix}/`)
      if (shadow) {
        const [, overrides] = files.find(([file]) => shadow === file)
        for (const override of overrides) {
          const overridePath = resolve(roots.app, override)
          if (await pathExists(overridePath)) {
            return overridePath
          }
        }
        return id
      }
    },
    async load (id) {
      const [, shadow] = id.split(`${prefix}/`)
      if (shadow) {
        return {
          code: await readFile(resolve(roots.blueprint, `${shadow}.js`), 'utf8'),
          map: null,
        }
      }
    },
  }
}

module.exports = vitePluginBlueprint

// Props to https://github.com/mcollina/desm

function urlDirname (url) {
  return dirname(fileURLToPath(url))
}

function urlJoin (url, ...str) {
  return join(urlDirname(url), ...str)
}
