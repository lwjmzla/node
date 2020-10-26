const combineRoutes = require('koa-combine-routers')

const publicRoutes = require('./publicRouter.js')

module.exports = combineRoutes(publicRoutes)