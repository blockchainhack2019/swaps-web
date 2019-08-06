import MiniCssExtractPlugin from 'mini-css-extract-plugin'


const isDev     = process.env.NODE_ENV === 'development'
const loaders   = []

if (isDev) {
  loaders.push('style-loader')
}
else {
  loaders.push(MiniCssExtractPlugin.loader)
}

loaders.push({
  loader: 'css-loader',
  options: {
    onlyLocals: false,
  },
})


export default [
  {
    test: /\.css$/,
    use: loaders,
  },
]
