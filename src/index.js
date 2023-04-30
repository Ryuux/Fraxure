const Client = require('./lib/Client')
const dotenv = require('dotenv')
dotenv.config()

const Fraxure = new Client()

Fraxure.start(process.env.TOKEN)
