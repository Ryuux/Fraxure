const { EmbedBuilder } = require('discord.js')
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
      return message.reply({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription()
          .setTimestamp()
        ]
      })
    }

    if (betAmount > user.coins) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription(`you don't have enough coins to make that bet. Your current balance is ${user.coins}.`)
          .setTimestamp()
        ]
      })
    }

    const slot1 = SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)]
    const slot2 = SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)]
    const slot3 = SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)]

    let winnings = 0
    let messageText = ''

    if (slot1 === slot2 && slot2 === slot3) {
      winnings = betAmount * 10
      user.coins += winnings
      messageText = `JACKPOT! ${slot1} | ${slot2} | ${slot3} \n\nYou won ${winnings} coins!`
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      winnings = betAmount * 2
      user.coins += winnings
      messageText = `${slot1} | ${slot2} | ${slot3} \n\nCongratulations! You won ${winnings} coins!`
    } else {
      user.coins -= betAmount
      messageText = `${slot1} | ${slot2} | ${slot3} \n\nI'm sorry! You lost ${betAmount} coins.`
    }

    await user.save()

    return message.reply({
      embeds: [new EmbedBuilder()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setDescription(messageText)
        .setTimestamp()
      ]
    })
  }
}
