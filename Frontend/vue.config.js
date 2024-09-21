const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: "./",
      externals: ["node-schedule"], 
      nodeModulesPath: ['./node_modules'], 
    //  extraResources: ['./src/background.js'],
      nodeIntegration: true,
      contextIsolation: false
    }
  }
})
