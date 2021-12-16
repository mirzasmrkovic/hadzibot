const Telegraf = require('telegraf').Telegraf
const bot = new Telegraf(process.env.TG_BOT_TOKEN)
const axios = require('axios')

bot.command('open', async ctx => {
  // ctx.chat.id === ???
  if (true) {
    await axios({
      method: 'post',
      url: process.env.API_URL + 'd=o',
    })
  }
  ctx.reply(`opened hi for ${ctx.from.username} ${ctx.chat.id}`)
})

bot.command('close', async ctx => {
  // ctx.chat.id === ???
  if (true) {
    await axios({
      method: 'post',
      url: process.env.API_URL + 'd=c',
    })
  }
  ctx.reply(`close hi for ${ctx.from.username} ${ctx.chat.id}`)
})

bot.command('intercom', async ctx => {
  // ctx.chat.id === ???
  if (true) {
    await axios({
      method: 'post',
      url: process.env.API_URL + 'i=o',
    })
  }
  ctx.reply(`buzzed intercom for ${ctx.from.username} ${ctx.chat.id}`)
})

bot.command('ping', ctx => {
  return ctx.replyWithMarkdown('*Pong!*')
})

module.exports = bot
