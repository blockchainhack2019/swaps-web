import webpack from 'webpack'
import chalk from 'chalk'
import _debug from 'debug'

import webpackConfig from '../../webpack/production'


const debug           = _debug('app:bin:compile')
const compiler        = webpack(webpackConfig)

debug('\nWebpack compilation started!')

compiler.run((err, stats) => {
  const jsonStats = stats.toJson()
  const { errors, warnings } = jsonStats

  debug('Webpack compilation finished!')

  console.log(stats.toString({
    colors: true,
    children: false,
    chunks: false,
  }))

  if (err) {
    debug(chalk.red(err))
    process.exit(1)
  }
  else if (errors && errors.length) {
    debug(chalk.red(jsonStats.errors))
    process.exit(1)
  }
  else if (warnings && warnings.length) {
    // debug(chalk.yellow(jsonStats.warnings))
  }

  debug('All done - everything is good to go.')
  process.exit(0)
})
