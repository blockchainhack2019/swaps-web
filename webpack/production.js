import webpack from 'webpack'
import basePath from 'base-path'
import TerserPlugin from 'terser-webpack-plugin'
import AssetsPlugin from 'assets-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import webpackConfig from './default'


const globals = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
}

const output = basePath('build')


webpackConfig.target = 'web'
webpackConfig.devtool = 'source-map'

webpackConfig.output = {
  path: output,
  filename: 'js/[name].[contenthash:8].js',
  publicPath: '/',
}

webpackConfig.plugins.push(
  new webpack.DefinePlugin(globals),
  new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash:8].css',
  }),
  new AssetsPlugin({
    path: output,
    filename: 'assets.json',
    fullPath: false,
    update: true,
    prettyPrint: true,
  }),
)

webpackConfig.optimization = {
  minimize: true,
  splitChunks: {
    cacheGroups: {
      vendor: {
        test: /local_modules|node_modules/,
        name: 'vendor',
        chunks: 'all',
        priority: 1,
      },
      styles: {
        test: /\.s?css$/,
        name: 'styles',
        chunks: 'all',
        enforce: true,
      },
    },
  },
  minimizer: [
    new TerserPlugin({
      sourceMap: true,
      parallel: 4,
    }),
    new OptimizeCSSAssetsPlugin(),
  ],
}


export default webpackConfig
