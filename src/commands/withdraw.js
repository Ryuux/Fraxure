const { EmbedBuilder } = require('discord.js')
const User = require('../lib/database/models/User')

module.exports = {
  name: 'withdraw',
  description: 'Withdraw coins from your bank account.',
  category: 'Economy',
  async run (message, client, args) {
    const userId = message.author.id
    const user = await User.findOne({ userId })

    const withdrawAmount = parseInt(args[0])

    if (isNaN(withdrawAmount) || withdrawAmount < 1) {
      return message.reply({
        embeds: new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription('please provide a valid positive number to withdraw.')
          .setTimestamp()
      })
    }

    if (user.bank < withdrawAmount) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription(`you don't have enough coins in your bank to withdraw ${withdrawAmount} coins.`)
          .setTimestamp()
        ]
      })
    }

    if (user.balance + withdrawAmount > Number.MAX_SAFE_INTEGER) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription('you cannot withdraw this amount, your balance would exceed the maximum safe integer value.')
          .setTimestamp()
        ]
      })
    }

    user.bank -= withdrawAmount
    user.balance += withdrawAmount

    await user.save()

    return message.reply({
      embeds: [new EmbedBuilder()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setDescription(`you withdrew ${withdrawAmount} coins from your bank account.`)
        .setTimestamp()
      ]
    })
  }
}
