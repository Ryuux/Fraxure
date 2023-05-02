const { EmbedSend } = require('../lib/helpers/embeds')
const User = require('../lib/database/models/User')

const SLOT_EMOJIS = [':gem:', ':moneybag:', ':money_with_wings:', ':tada:', ':lemon:', ':seven:', ':cherries:']

module.exports = {
  name: 'slots',
  description: 'Bet your coins on a slot machine and win prizes.',
  category: 'Economy',
  async run (message, client, args) {
    const userId = message.author.id
    const user = await User.findOne({ userId })

    const betAmount = parseInt(args[0])

    if (isNaN(betAmount) || betAmount < 1) {
      return EmbedSend(message, 'Invalid bet amount. Please enter a number greater than 0.')
    }

    if (betAmount > user.balance) {
      return EmbedSend(message, 'You don\'t have enough coins to make that bet.')
    }

    const slot1 = SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)]
    const slot2 = SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)]
    const slot3 = SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)]

    let winnings = 0
    let messageText = ''

    if (slot1 === slot2 && slot2 === slot3) {
      winnings = betAmount * 10
      user.balance += winnings
      messageText = `JACKPOT! ${slot1} | ${slot2} | ${slot3} \n\nYou won ${winnings} coins!`
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      winnings = betAmount * 2
      user.balance += winnings
      messageText = `${slot1} | ${slot2} | ${slot3} \n\nCongratulations! You won ${winnings} coins!`
    } else {
      user.balance -= betAmount
      messageText = `${slot1} | ${slot2} | ${slot3} \n\nI'm sorry! You lost ${betAmount} coins.`
    }

    await user.save()

    return EmbedSend(message, messageText)
  }
}
