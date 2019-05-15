const {parseString} = require('xml2js')
module.exports = {
  getUserDataAsync (req) {
    return new Promise((resolve, reject) => {
      let xmlData = ''
      req.on('data', (data) => {
        xmlData += data
      })
      req.on('end', () => {
        resolve(xmlData)
      })
    })
  },
  parseXML (xmlData) {
    let jsData
    parseString(xmlData, {trim: true}, (err, data) => {
      if (err) {
        console.log('parseXML' + err)
      } else {
        jsData = data
      }
    })
    return jsData
  },
  formatMessage (jsData) {
    jsData = jsData.xml
    let obj = {}
    for (let key in jsData) {
      obj[key] = jsData[key][0]
    }
    return obj
  }
}