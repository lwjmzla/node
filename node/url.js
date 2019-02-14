const url = require('url')

const demoUrl = 'http://www.gaohangip.com/search/?scope=2&q=专家'

console.log(url.parse(demoUrl, true))