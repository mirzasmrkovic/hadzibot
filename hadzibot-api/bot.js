const Telegraf = require('telegraf').Telegraf
const Markup = require('telegraf').Markup
const bot = new Telegraf(process.env.TG_BOT_TOKEN)
const axios = require('axios')

const denyAccess = async (chatID, username) => {
  Markup.removeKeyboard()

  return await bot.telegram.sendMessage(
    chatID,
    `Denied access for *${username}*`,
    { parse_mode: 'Markdown' }
  )
}

bot.command('hadzibrava', async ctx => {
  if (ctx.chat.id === parseInt(process.env.HADZIBRAVA_ID)) {
    await ctx.deleteMessage()
    return await bot.telegram.sendMessage(
      ctx.chat.id,
      `*${ctx.from.username}* is interacting with hadzibrava`,
      {
        parse_mode: 'Markdown',
        ...Markup.keyboard([['Open HI', 'Close', 'Interfon'], ['Cancel']])
          .oneTime(true)
          .resize(),
      }
    )
  } else {
    await ctx.deleteMessage()
    await denyAccess(ctx.chat.id, username)
  }
})

bot.hears('Open HI', async ctx => {
  const chatID = ctx.chat.id
  const username = ctx.from.username

  if (chatID === parseInt(process.env.HADZIBRAVA_ID)) {
    await ctx.deleteMessage()
    await axios({
      method: 'post',
      url: process.env.API_URL + 'd=o',
    })
    Markup.removeKeyboard()

    return await bot.telegram.sendMessage(
      chatID,
      `opened hi for *${username}*`,
      { parse_mode: 'Markdown' }
    )
  } else {
    await ctx.deleteMessage()
    await denyAccess(chatID, username)
  }
})

bot.hears('Close', async ctx => {
  const chatID = ctx.chat.id
  const username = ctx.from.username

  if (chatID === parseInt(process.env.HADZIBRAVA_ID)) {
    await ctx.deleteMessage()
    await axios({
      method: 'post',
      url: process.env.API_URL + 'd=c',
    })
    Markup.removeKeyboard()
    return await bot.telegram.sendMessage(
      chatID,
      `closed hi for *${username}*`,
      { parse_mode: 'Markdown' }
    )
  } else {
    await ctx.deleteMessage()
    await denyAccess(chatID, username)
  }
})

bot.hears('Interfon', async ctx => {
  const chatID = ctx.chat.id
  const username = ctx.from.username

  if (chatID === parseInt(process.env.HADZIBRAVA_ID)) {
    await ctx.deleteMessage()
    await axios({
      method: 'post',
      url: process.env.API_URL + 'i=o',
    })
    Markup.removeKeyboard()
    return await bot.telegram.sendMessage(
      chatID,
      `buzzed interfon for *${username}*`,
      { parse_mode: 'Markdown' }
    )
  } else {
    await ctx.deleteMessage()
    await denyAccess(chatID, username)
  }
})

bot.hears('Cancel', async ctx => {
  await ctx.deleteMessage()
  Markup.removeKeyboard()
})

bot.hears('PING', async ctx => {
  Markup.removeKeyboard()
  return bot.telegram.sendMessage(ctx.chat.id, '*PONG!*', {
    parse_mode: 'Markdown',
  })
})

module.exports = bot
