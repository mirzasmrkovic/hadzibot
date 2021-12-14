require('dotenv').config()
import { Telegraf } from 'telegraf'
import express from 'express'
const path = require('path')
const app = express()
const port = 3000

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname + '/index.html'))
// })

bot.command('start', ctx => {
  console.log(ctx.from)
  bot.telegram.sendMessage(ctx.chat.id, 'hey motherfucker', {})
})

bot.launch()
app.listen(port, () => console.log(`Listening on ${port}`))
