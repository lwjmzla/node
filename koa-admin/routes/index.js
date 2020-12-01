const combineRoutes = require('koa-combine-routers')

const publicRoutes = require('./publicRouter.js')
const memberRoutes = require('./member.js')

module.exports = combineRoutes(publicRoutes,memberRoutes)