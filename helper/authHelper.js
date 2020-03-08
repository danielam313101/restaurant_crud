const bcrypt = require('bcryptjs')

module.exports = {
  hashPassword: (password, cb) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        return cb(hash)
      })
    })
  }
}