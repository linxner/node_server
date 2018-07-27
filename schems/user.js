const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

const UserSchema = new mongoose.Schema({
    name: {
        // unique: true,
        type: String
    },
    password: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})



UserSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    // console.log(this)
    var user = this
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err)
        }
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return next(err)
            }
            user.password = hash
            // console.log(UserSchema.password)
            next()
        })
    })
})

UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) {
                return cb(err)
            }
            cb(null, isMatch)
        })
    }
}



// UserSchema.static = {
//     fetch: function (cb) {
//         return this.find({}).sort('meta.updateAt').exec(cb)
//     },
//     findById: function (id, cb) {
//         return this.findOne({
//                 _id: id
//             }).exec(cb)
//     }
// }

module.exports = UserSchema