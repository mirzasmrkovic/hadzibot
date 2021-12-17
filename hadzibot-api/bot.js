const Telegraf = require('telegraf').Telegraf
const bot = new Telegraf(process.env.TG_BOT_TOKEN)
const axios = require('axios')

bot.command('open', async ctx => {
  if (ctx.chat.id === parseInt(process.env.REZIJA_ID)) {
    await axios({
      method: 'post',
      url: process.env.API_URL + 'd=o',
    })
    ctx.reply(`opened hi for ${ctx.from.username}`)
  } else {
    ctx.reply(`denied access for ${ctx.from.username}`)
  }
})

bot.command('close', async ctx => {
  if (ctx.chat.id === parseInt(process.env.REZIJA_ID)) {
    await axios({
      method: 'post',
      url: process.env.API_URL + 'd=c',
    })
    ctx.reply(`closed hi for ${ctx.from.username}`)
  } else {
    ctx.reply(`denied access for ${ctx.from.username}`)
  }
})

bot.command('interfon', async ctx => {
  if (ctx.chat.id === parseInt(process.env.REZIJA_ID)) {
    await axios({
      method: 'post',
      url: process.env.API_URL + 'i=o',
    })
    ctx.reply(`buzzed interfon for ${ctx.from.username}`)
  } else {
    ctx.reply(`denied access for ${ctx.from.username}`)
  }
})

bot.command('ping', ctx => {
  return ctx.replyWithMarkdown('*Pong!*')
})

module.exports = bot
