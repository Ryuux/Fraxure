const { EmbedBuilder } = require('discord.js')
const User = require('../lib/database/models/User')

module.exports = {
  name: 'leaderboard',
  description: 'Shows the top 10 users by balance',
  category: 'Economy',
  cooldown: 5,
  async run (message, client, args) {
    const users = await User.find({}).sort({ balance: -1 }).limit(10).lean()
    if (!users.length) return message.reply('No users found.')

    const leaderboard = users.map((user, index) => `**${index + 1}.** ${client.users.cache.get(user.userId) ? client.users.cache.get(user.userId).username : 'Unknown User'} • 🪙 ${user.balance}`).join('\n')
    const userIndex = users.findIndex(u => u.userId === message.author.id)
    const userRank = userIndex !== -1 ? userIndex + 1 : 'N/A'

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: '• Leaderboard', iconURL: 'https://media.discordapp.net/attachments/1069664322818678847/1103127565809487893/1f3e6.png?width=640&height=640' })
          .setDescription(leaderboard)
          .setFooter({ text: `Your rank: ${userRank}` })
          .setColor(5763719)
      ]
    })
  }
}
