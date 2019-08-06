import autoprefixer from 'autoprefixer'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'


const isDev           = process.env.NODE_ENV === 'development'
const localIdentName  = isDev ? '[local]__[hash:base64:3]' : '[hash:base64:6]'
const loaders         = []

if (isDev) {
  loaders.push('style-loader')
}
else {
  loaders.push(MiniCssExtractPlugin.loader)
}

loaders.push(
  {
    loader: 'css-loader',
    options: {
      sourceMap: !isDev,
      onlyLocals: false,
      importLoaders: 2,
      modules: {
        context: __dirname,
        localIdentName,
      },
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [
        autoprefixer([
          'Android >= 4',
          'iOS >= 8',
          'Chrome >= 30',
          'Firefox >= 30',
          'Explorer >= 10',
          'Safari >= 8',
          'Opera >= 20',
        ]),
      ],
    },
  },
  'sass-loader',
)


export default [
  {
    test: /\.scss$/,
    use: loaders,
  },
]
