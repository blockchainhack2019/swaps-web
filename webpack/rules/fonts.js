const options = process.env.NODE_ENV === 'development' ? {
  name: 'fonts/[name].[ext]',
} : {
  name: '[name].[ext]',
  outputPath: 'fonts/',
  publicPath: `/fonts/`,
}


export default [
  {
    test: /fonts.*\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'url-loader',
    options: {
      ...options,
      limit: 10000,
      mimetype: 'application/font-woff',
    },
  },
  {
    test: /fonts.*\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader',
    options,
  },
]
