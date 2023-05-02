const { EmbedBuilder } = require('discord.js')
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

    const embedWork = new EmbedBuilder()
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
      .setDescription(`You worked hard and earned ${earnedMoney} coins! Your new balance is ${user.balance} coins.`)
      .setTimestamp()

    return message.reply({ embeds: [embedWork] })
  }
}
