const { CLIENT_OPTIONS } = require('../config')
const { Client, Collection } = require('discord.js')

const fs = require('fs')
const path = require('path')
const User = require('../lib/database/models/User')
const connectToDatabase = require('./database/connect')

module.exports = class Fraxure extends Client {
  constructor () {
    super(CLIENT_OPTIONS)
    connectToDatabase(process.env.MONGODB_URI)

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

      const userId = message.author.id
      const user = await User.findOne({ userId })
      if (!user && commandName !== 'register') {
        return message.reply('you must register first to be able to use any command.')
      }

      try {
        await command.run(message, this, commandArgs)
      } catch (err) {
        console.error(err)
        message.reply('An error occurred while executing the command.')
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
