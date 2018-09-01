const express = require('express')
const bodyparser = require('body-parser')
const generate = require('./generate')
const puppeteer = require('puppeteer')
const path = require('path')
const redis = require('redis')
const client = redis.createClient()
const cache = require('express-redis-cache')({ client })
const cors = require('cors')
const qs = require('qs')

cache.on('connected', function () {
  console.log('connected')
})

cache.on('message', function (message) {
  console.log('message', message)
})

const app = express()

let browser

app.engine('pug', require('pug').__express)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// app.use(cors())
app.use(bodyparser.json())
app.use(express.static('public'))

app.get('/oscar/api/generate', async (req, res, next) => {
  const text = generate.text(req.query)
  const emojis = generate.emoji(req.query)

  res.render('index', { text, emojis })
})

app.get('/oscar/api/get', (req, res, next) => {
  const startDate = new Date()

  ;(async () => {
    const page = await browser.newPage()
    page.setViewport({
      width: 600,
      height: 350
    })

    page.once('load', async () => {
      console.log('page loaded', new Date() - startDate + 'ms')
      const screenshot = await page.screenshot()
      const endDate = new Date()

      res.end(screenshot, 'binary')

      page.close()

      console.log('ready', endDate - startDate + 'ms')
    })

    await page.goto('http://localhost/oscar/api/generate?' + qs.stringify(req.query))
  })()
})

;(async () => {
  browser = await puppeteer.launch()

  app.listen(3011, (err) => {
    if (err) console.log(err)
    console.log('browser initialized')
  })
})()
