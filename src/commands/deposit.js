const { EmbedBuilder } = require('discord.js')
const User = require('../lib/database/models/User')

module.exports = {
  name: 'deposit',
  description: 'Deposit coins to your bank account.',
  category: 'Economy',
  async run (message, client, args) {
    const userId = message.author.id
    const user = await User.findOne({ userId })

    const depositAmount = parseInt(args[0])

    if (isNaN(depositAmount) || depositAmount < 1) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription('please provide a valid positive number to deposit.')
          .setTimestamp()
        ]
      })
    }

    const { balance } = user

    if (balance < depositAmount) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription(`you don't have enough coins to deposit ${depositAmount} coins.`)
          .setTimestamp()
        ]
      })
    }

    user.balance -= depositAmount
    user.bank += depositAmount
    await user.save()

    return message.reply({
      embeds: [new EmbedBuilder()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setDescription(`you deposited ${depositAmount} coins to your bank account.`)
        .setTimestamp()
      ]
    })
  }
}
