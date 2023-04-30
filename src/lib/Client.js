const { Client, Collection } = require('discord.js')
const { CLIENT_OPTIONS } = require('../config')
const fs = require('fs')
const path = require('path')

module.exports = class Fraxure extends Client {
  constructor () {
    super(CLIENT_OPTIONS)

    this.commands = new Collection()
    this.aliases = new Collection()
    this.config = require('../config')
    this.loadCommands()

    this.on('ready', () => {
      console.log(`Ready ${this.user.tag}`)
    })

    this.on('messageCreate', async message => {
      if (!message.author || message.author.bot) return
      const args = message.content.split(/ +/)
      const prefix = '?'
      if (!args[0].startsWith(prefix)) return

      const commandName = args[0].slice(prefix.length).toLowerCase()
      const command = this.commands.get(commandName) || this.commands.get(this.aliases.get(commandName))
      if (!command) return

      const commandArgs = args.slice(1)

      try {
        await command.run(message, this, commandArgs)
      } catch (err) {
        console.error(err)
        message.reply('Ocurrió un error al ejecutar el comando.')
      }
    })
  }

  loadCommands () {
    const commandsPath = path.join(__dirname, '..', 'commands')
    const commandFiles = fs.readdirSync(commandsPath)

    for (const file of commandFiles) {
      const command = require(path.join(commandsPath, file))

      if (!command.name) return

      this.commands.set(command.name, command)

      if (command.aliases && Array.isArray(command.aliases)) {
        for (const alias of command.aliases) {
          this.aliases.set(alias, command.name)
        }
      }
    }
  }

  /**
   * Starts the bot with the given token.
   * @param {string} token - The bot token.
   */
  start (token) {
    this.login(token).catch(console.error)
  }
}
