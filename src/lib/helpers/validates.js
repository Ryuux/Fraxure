const validAmount = (num) => {
  if (isNaN(num)) return false

  if (num < 0 || num % 1 !== 0) return false

  return true
}

const validUser = async (client, userId) => {
  if (!client || !userId) return false
  try {
    const user = await client.users.fetch(userId)
    return user
  } catch (err) {
    if (err.message === 'Unkown User') return false
    return false
  }
}

module.exports = { validAmount, validUser }
