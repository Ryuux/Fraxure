const { EmbedBuilder } = require('discord.js')
const User = require('../lib/database/models/User')

module.exports = {
  name: 'bal',
  description: 'Check your balance.',
  category: 'Economy',
  cooldown: 5,
  async run (message, client, args) {
    const user = await User.findOne({ userId: message.author.id })

    const { balance, bank } = user
    const totalBalance = balance + bank

    const embedBal = new EmbedBuilder()
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
      .addFields(
        { name: 'Coins:', value: `${balance}`, inline: true },
        { name: 'Bank:', value: `${bank}`, inline: true },
        { name: 'Total:', value: `${totalBalance}`, inline: true }
      )
      .setTimestamp()

    return message.reply({ embeds: [embedBal] })
  }
}
