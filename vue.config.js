// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ContextReplacementPlugin = require('webpack').ContextReplacementPlugin

module.exports = {
  configureWebpack: {
    plugins: [
      // new BundleAnalyzerPlugin(),
      new ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb/)
    ]
  },
  pwa: {
    name: 'Know the Meta',
    themeColor: '#9acadc',
    msTileColor: '#2c3653',
    manifestOptions: {
      background_color: '#2c3653'
    }
  }
}
