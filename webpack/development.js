import webpack from 'webpack'
import basePath from 'base-path'

import webpackConfig from './default'


const globals = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
}


webpackConfig.target = 'web'
webpackConfig.devtool = 'cheap-module-source-map'

webpackConfig.output = {
  path: basePath('build'),
  filename: '[name].js',
  chunkFilename: '[id].chunk.js',
  publicPath: '/',
}

webpackConfig.devServer = {
  publicPath: '/',
  stats: 'errors-only',
  noInfo: true,
  lazy: false,
}

webpackConfig.plugins.push(
  new webpack.DefinePlugin(globals),
)


export default webpackConfig
