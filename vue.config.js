const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: "./",
      externals: ['mongoose',"node-schedule", "serialport"], 
      nodeModulesPath: ['./node_modules'], 
    //  extraResources: ['./src/background.js'],
      nodeIntegration: true,
      contextIsolation: false
    }
  }
})
