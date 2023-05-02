const { EmbedBuilder } = require('discord.js')
const User = require('../lib/database/models/User')

module.exports = {
  name: 'register',
  description: 'Register your account.',
  category: 'Economy',
  async run (message, client, args) {
    const userId = message.author.id
    const filter = { userId }
    const update = { userId, $setOnInsert: { balance: 0, bank: 0 } }
    const options = { upsert: true, new: true }

    // Verificar que el objeto `update` tenga un valor no nulo para `userId`
    if (!userId) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription('There was an error registering your account.')
          .setColor(0xff0000)
          .setTimestamp()
        ]
      })
    }

    const { upserted } = await User.findOneAndUpdate(filter, update, options)

    if (upserted) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription('You have been successfully registered!')
          .setColor(5763719)
          .setTimestamp()
        ]
      })
    } else {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription('You have already registered!')
          .setColor(5763719)
          .setTimestamp()
        ]
      })
    }
  }
}
