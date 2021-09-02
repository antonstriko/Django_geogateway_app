const BundleTracker = require("webpack-bundle-tracker");

module.exports = {
    publicPath:
        process.env.NODE_ENV === "development"
            ? "http://localhost:9000/static/geogateway_django_app/bundles/": "/static/geogateway_django_app/bundles/",
    outputDir: '../geogateway_django_app/static/geogateway_django_app/bundles',

    devServer: {
        disableHostCheck: true
    },
  configureWebpack: {
    optimization: {

      splitChunks: {
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial'
          },
        }
      }
    }
  },

    chainWebpack: config => {

config
    .plugin('BundleTracker')
    .use(BundleTracker, [{filename: 'webpack-stats.json', path: '../geogateway_django_app/static/geogateway_django_app/bundles/'}])

config.resolve.alias
    .set('__STATIC__', 'static')

config.devServer
    .public('http://0.0.0.0:9000')
    .host('0.0.0.0')
    .port(9000)
    .hotOnly(true)
    .watchOptions({poll: 1000})
    .https(false)
    .headers({"Access-Control-Allow-Origin": ["\*"]})
}
};
