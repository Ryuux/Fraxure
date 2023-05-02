const { EmbedSend } = require('../lib/helpers/embeds')
const User = require('../lib/database/models/User')

module.exports = {
  name: 'work',
  description: 'Earn some money by working.',
  category: 'Economy',
  async run (message, client, args) {
    const userId = message.author.id
    const user = await User.findOne({ userId })

    const earnedMoney = Math.floor(Math.random() * (500 - 100 + 1)) + 100

    user.balance += earnedMoney

    await user.save()

    return EmbedSend(message, `You worked hard and earned ${earnedMoney} coins! Your new balance is ${user.balance} coins.`)
  }
}
