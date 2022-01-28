require('dotenv').config()
import { Telegraf, Markup } from 'telegraf'
import express from 'express'
import axios from 'axios'

const app = express()
const port = 3000

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

const denyAccess = async (chatID, username) => {
  Markup.removeKeyboard()

  return await bot.telegram.sendMessage(
    chatID,
    `Denied access for *${username}*`,
    { parse_mode: 'MarkdownV2' }
  )
}

bot.command('hadzibrava', async ctx => {
  const chatID = ctx.chat.id
  const username = ctx.from.username

  try {
    await ctx.deleteMessage()
    if (chatID === parseInt(process.env.HADZIBRAVA_ID)) {
      return await bot.telegram.sendMessage(
        chatID,
        `*${username}* is interacting with hadzibrava`,
        {
          parse_mode: 'MarkdownV2',
          ...Markup.keyboard([['Open HI', 'Close', 'Interfon'], ['Cancel']])
            .oneTime(true)
            .resize(),
        }
      )
    } else {
      await denyAccess(chatID, username)
    }
  } catch (error) {
    console.error(error)
    return await bot.telegram.sendMessage(chatID, 'something failed')
  }
})

bot.hears('Open HI', async ctx => {
  const chatID = ctx.chat.id
  const username = ctx.from.username

  try {
    await ctx.deleteMessage()
    if (chatID === parseInt(process.env.HADZIBRAVA_ID)) {
      await axios({
        method: 'post',
        url: process.env.API_URL + 'd=o',
      })
      Markup.removeKeyboard()

      return await bot.telegram.sendMessage(
        chatID,
        `opened hi for *${username}*`,
        { parse_mode: 'MarkdownV2' }
      )
    } else {
      await denyAccess(chatID, username)
    }
  } catch (error) {
    console.error(error)
    return await bot.telegram.sendMessage(chatID, 'something failed')
  }
})

bot.hears('Close', async ctx => {
  const chatID = ctx.chat.id
  const username = ctx.from.username

  try {
    await ctx.deleteMessage()
    if (chatID === parseInt(process.env.HADZIBRAVA_ID)) {
      await axios({
        method: 'post',
        url: process.env.API_URL + 'd=c',
      })
      Markup.removeKeyboard()
      return await bot.telegram.sendMessage(
        chatID,
        `closed hi for *${username}*`,
        { parse_mode: 'MarkdownV2' }
      )
    } else {
      await denyAccess(chatID, username)
    }
  } catch (error) {
    console.error(error)
    return await bot.telegram.sendMessage(chatID, 'something failed')
  }
})

bot.hears('Interfon', async ctx => {
  const chatID = ctx.chat.id
  const username = ctx.from.username

  try {
    await ctx.deleteMessage()
    if (chatID === parseInt(process.env.HADZIBRAVA_ID)) {
      await axios({
        method: 'post',
        url: process.env.API_URL + 'i=o',
      })
      Markup.removeKeyboard()
      return await bot.telegram.sendMessage(
        chatID,
        `buzzed interfon for *${username}*`,
        { parse_mode: 'MarkdownV2' }
      )
    } else {
      await denyAccess(chatID, username)
    }
  } catch (error) {
    console.error(error)
    return await bot.telegram.sendMessage(chatID, 'something failed')
  }
})

bot.hears('Cancel', async ctx => {
  const chatID = ctx.chat.id
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.error(error)
    return await bot.telegram.sendMessage(chatID, 'something failed')
  }
  Markup.removeKeyboard()
})

bot.hears('Cancel', async ctx => {
  await ctx.deleteMessage()
  Markup.removeKeyboard()
})

bot.hears('PING', async ctx => {
  Markup.removeKeyboard()
  return bot.telegram.sendMessage(ctx.chat.id, '*PONG!*', {
    parse_mode: 'MarkdownV2',
  })
})

const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

const drawTeams = ctx => {
  const text = ctx.message.text
  if (text.length >= 300) throw 'PREVISE IGRACA'
  const pool = text.split(' ')
  pool.shift()

  const size = parseInt(pool.shift())
  if (isNaN(size)) {
    throw "FIRST PARAM ISN'T A NUMBER"
  }
  shuffle(pool)

  const teams = []
  if (size < 1 || size > 30) throw 'BROJ IGRACA MORA BITI 1 ILI VISE'
  for (let i = 0; i < pool.length; ) {
    const temp = []
    for (let j = 0; j < size && i < pool.length; j++) {
      temp.push(pool[i])
      i++
    }
    teams.push(temp)
  }

  return teams
}

bot.command('timovi', async ctx => {
  const chatID = ctx.chat.id

  try {
    const teams = drawTeams(ctx)

    for (let i = 0; i < teams.length; i++) {
      let response = i + 1 + '\\. '
      for (let j = 0; j < teams[i].length; j++) {
        let name = `*${teams[i][j]}*`
        if (j !== teams[i].length - 1) name += ', '
        response += name
      }
      await bot.telegram.sendMessage(chatID, response, {
        parse_mode: 'MarkdownV2',
      })
    }
    return
  } catch (error) {
    return await bot.telegram.sendMessage(
      chatID,
      '*UPOTREBA*: /timovi \\[velicina tima\\] \\[imena igraca\\]',
      {
        parse_mode: 'MarkdownV2',
      }
    )
  }
})

bot.launch()
app.listen(port, () => console.log(`Listening on ${port}`))
