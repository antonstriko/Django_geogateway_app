const BundleTracker = require("webpack-bundle-tracker");

module.exports = {
    publicPath:"/static/geogateway_django_app/bundles/",
    // baseUrl: "http://0.0.0.0:8080/",
    outputDir: '../geogateway_django_app/static/geogateway_django_app/bundles',

    devServer: {
        disableHostCheck: true
    },
  configureWebpack: {
    optimization: {
      /*
       * Force creating a vendor bundle so we can load the 'app' and 'vendor'
       * bundles on development as well as production using django-webpack-loader.
       * Otherwise there is no vendor bundle on development and we would need
       * some template logic to skip trying to load it.
       * See also: https://bitbucket.org/calidae/dejavu/src/d63d10b0030a951c3cafa6b574dad25b3bef3fe9/%7B%7Bcookiecutter.project_slug%7D%7D/frontend/vue.config.js?at=master&fileviewer=file-view-default#vue.config.js-27
       */
      splitChunks: {
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial'
          },
        // there is only one entry point so common chunk isn't needed
        //   common: {
        //     name: 'chunk-common',
        //     minChunks: 2,
        //     priority: -20,
        //     chunks: 'initial',
        //     reuseExistingChunk: true
        //   }
        }
      }
    }
  },

    chainWebpack: config => {

config
    .plugin('BundleTracker')
    .use(BundleTracker, [{filename: '../geogateway_django_app/static/geogateway_django_app/bundles/webpack-stats.json'}])

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
