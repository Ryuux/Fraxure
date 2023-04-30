const mongoose = require('mongoose')

module.exports = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Connected to database!')
  } catch (err) {
    console.error(`Error connecting to database: ${err.message}`)
    process.exit(1)
  }
}
