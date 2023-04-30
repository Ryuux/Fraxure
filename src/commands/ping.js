module.exports = {
  name: 'ping',
  aliases: ['pong'],
  description: 'Pong!',
  category: 'Utilities',
  run (message, client, args) {
    message.channel.send({ content: 'xd' })
  }
}
