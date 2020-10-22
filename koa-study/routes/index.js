const combineRoutes = require('koa-combine-routers')

const demo1Routes = require('./demo1.js')
const demo2Routes = require('./demo2.js')

module.exports = combineRoutes(demo1Routes,demo2Routes)