import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import basePath from 'base-path'

import rulesMap from './rules'


const rules = Object.keys(rulesMap)
  .map((k) => rulesMap[k])
  .map((rule) => Array.isArray(rule) ? rule : (rule.default || rule[process.env.NODE_ENV]))
  .reduce((result, rule) => result.concat(rule), [])

const webpackConfig = {
  mode: process.env.NODE_ENV,
  entry: {
    client: basePath('site/index'),
  },
  module: {
    rules,
  },
  resolve: {
    modules: [ 'local_modules', 'node_modules', 'site' ],
    extensions: [ '.js', '.scss' ],
    plugins: [],
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /moment[/\\]locale$/,
      /en-gb|es/
    ),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: basePath('site/index.html'),
      templateParameters: {
        web3Path: process.env.NODE_ENV === 'development' ? 'assets/web3.min.js' : 'https://cdn.jsdelivr.net/npm/web3-min-js@1.0.0/web3.min.js'
      },
      inject: 'body',
    }),
  ],
}


export default webpackConfig
