const { EmbedBuilder } = require('discord.js')

const EmbedSend = (message, description) => {
  return message.reply({
    embeds: [new EmbedBuilder()
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
      .setDescription(description)
      .setColor(5763719)
      .setTimestamp()
    ]
  })
}

module.exports = { EmbedSend }
