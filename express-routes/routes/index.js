
const express = require('express')
const router = express.Router()

router.get('/test', async (req, res) => {
  res.json({
    test: 123
  })
})

module.exports = router