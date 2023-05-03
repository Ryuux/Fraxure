const { EmbedSend } = require('../lib/helpers/embeds')
const User = require('../lib/database/models/User')

module.exports = {
  name: 'register',
  description: 'Register your account.',
  category: 'Economy',
  cooldown: 5,
  async run (message, client, args) {
    const userId = message.author.id
    const filter = { userId }
    const update = { userId, $setOnInsert: { balance: 0, bank: 0 } }
    const options = { upsert: true, new: true }

    if (!userId) {
      return EmbedSend(message, 'There was an error registering your account.')
    }

    const { upserted } = await User.findOneAndUpdate(filter, update, options)

    if (upserted) {
      return EmbedSend(message, 'You have been successfully registered!')
    } else {
      return EmbedSend(message, 'You have already registered!')
    }
  }
}
