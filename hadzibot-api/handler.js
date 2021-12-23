'use strict'
const bot = require('./bot.js')

module.exports.webhook = async event => {
  // using a try/catch block
  try {
    // process event data
    const body = JSON.parse(event.body)

    // bot handles processed data from the event body
    await bot.handleUpdate(body)

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'SUCCESS!' }),
    }
    // return an Ok response
  } catch (err) {
    console.log(err)
    // handle any errors
    // return any Err responses
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'FAILED: ' + err }),
    }
  }
}

// setWebhook function handles initial webhook setup for Telegram
module.exports.setWebhook = async event => {
  // using a try/catch block
  try {
    // process webhook url based on event data
    let url =
      'https://' +
      event.headers.Host +
      '/' +
      event.requestContext.stage +
      '/' +
      process.env.TG_BOT_TOKEN

    // use bot methods to set the webhook url
    await bot.telegram.setWebhook(url)
    return { statusCode: 200 }

    // return an Ok response
  } catch (err) {
    return { statusCode: 400 }
    // handle any errors
    // return any Err responses
  }
}
