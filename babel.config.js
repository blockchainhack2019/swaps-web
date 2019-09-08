const config = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          browsers: [
            'last 2 versions',
            'Safari >= 9',
            'IE >= 11',
            'iOS >= 9',
          ],
          node: 'current',
        },
        useBuiltIns: 'entry',
        corejs: '2',
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
  ],
}

if (process.env.ENV === 'production') {
  config.plugins.push('transform-react-remove-prop-types')
}


module.exports = config
