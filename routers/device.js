const express = require('express')
const Mock = require('mockjs')
const router = express.Router()

// 定义网站主页的路由
router.get('/', function (req, res) {
  res.send('Birds home page')
})

// 定义 about 页面的路由
router.get('/devices/tokens', function (req, res) {
  res.json(Mock.mock({
    'data|1-9': [{
      'name|5-8': /[a-zA-Z]/,
      'id|+1': 1,
      'value|0-500': 20
    }]
  }))
})

module.exports = router
