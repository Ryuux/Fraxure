const { EmbedSend } = require('../lib/helpers/embeds')
const User = require('../lib/database/models/User')

module.exports = {
  name: 'withdraw',
  description: 'Withdraw coins from your bank account.',
  category: 'Economy',
  async run (message, client, args) {
    const userId = message.author.id
    const user = await User.findOne({ userId })

    let withdrawAmount
    if (args[0] && args[0].toLowerCase() === 'all') {
      withdrawAmount = user.bank
    } else {
      withdrawAmount = parseInt(args[0])
    }

    if (isNaN(withdrawAmount) || withdrawAmount < 1) {
      return EmbedSend(message, 'please provide a valid positive number to withdraw.')
    }

    if (user.bank < withdrawAmount) {
      return EmbedSend(message, `you don't have enough coins in your bank to withdraw ${withdrawAmount} coins.`)
    }

    if (user.balance + withdrawAmount > Number.MAX_SAFE_INTEGER) {
      return EmbedSend(message, 'you cannot withdraw this amount, your balance would exceed the maximum safe integer value.')
    }

    user.bank -= withdrawAmount
    user.balance += withdrawAmount

    await user.save()

    return EmbedSend(message, `you withdrew ${withdrawAmount} coins from your bank account.`)
  }
}
