import http from 'http'
import path from 'path'
import express from 'express'
import webpack from 'webpack'
import historyApiFallback from 'connect-history-api-fallback'
import webpackMiddleware from 'webpack-dev-middleware'

import webpackConfig from '../../webpack/development'


const compiler = webpack(webpackConfig)
const app = express()

app.use(historyApiFallback())
app.use(webpackMiddleware(compiler, webpackConfig.devServer))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.static('/assets/'))

app.get('/assets/web3.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../../assets/web3.min.js'))
})


const httpServer = http.createServer(app)

httpServer.listen(5000, () => {
  console.log('App running on localhost:5000')
})
