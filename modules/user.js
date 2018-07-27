const mongoose = require('mongoose')

const UserSchema = require('../schems/user')

const User = mongoose.model('User', UserSchema)

module.exports = User