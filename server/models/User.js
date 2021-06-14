const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your login!']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 1,
      select: false
    },
    lastLoginAt : {
      type: Date,
    },
    createdAt: {
      type: Date,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    }
  }
);

userSchema.pre('save', function(next){
  this.createdAt = Date.now() - 1000;
  this.lastLoginAt = Date.now() - 1000;
  next()
})


userSchema.pre('update', function(next){
  this.lastLoginAt = Date.now();
  next()
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema)

module.exports = User;
