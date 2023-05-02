const { Client, Collection } = require('discord.js')
const { CLIENT_OPTIONS } = require('../config')
const fs = require('fs')
const path = require('path')

module.exports = class Fraxure extends Client {
  constructor () {
    super(CLIENT_OPTIONS)

    this.aliases = new Collection()
    this.cooldowns = new Collection()
    this.commands = new Collection()
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

      const now = Date.now()
      const cooldownAmount = (command.cooldown || 3) * 1000
      const userCooldowns = this.cooldowns.get(message.author.id) || new Collection()
      const expirationTime = userCooldowns.get(commandName) || 0

      if (now < expirationTime) {
        const timeLeft = Math.ceil((expirationTime - now) / 1000)
        return message.reply(`Please wait ${timeLeft} second(s) before using the \`${commandName}\` command again.`)
      }

      userCooldowns.set(commandName, now + cooldownAmount)
      this.cooldowns.set(message.author.id, userCooldowns)

      try {
        await command.run(message, this, commandArgs)
      } catch (error) {
        console.error(error)
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
