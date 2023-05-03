const { EmbedSend } = require('../lib/helpers/embeds')
const User = require('../lib/database/models/User')

module.exports = {
  name: 'deposit',
  description: 'Deposit coins to your bank account.',
  category: 'Economy',
  cooldown: 5,
  async run (message, client, [depositAmount]) {
    const userId = message.author.id

    if (depositAmount && depositAmount.toLowerCase() === 'all') {
      const user = await User.findOne({ userId })
      depositAmount = user.balance
    } else {
      depositAmount = parseInt(depositAmount)
      if (isNaN(depositAmount) || depositAmount < 1) return EmbedSend(message, 'please provide a valid positive number to deposit.')
    }

    await User.findOneAndUpdate({ userId }, { $inc: { bank: depositAmount, balance: -depositAmount } })

    return EmbedSend(message, `you deposited ${depositAmount} coins to your bank account.`)
  }
}
