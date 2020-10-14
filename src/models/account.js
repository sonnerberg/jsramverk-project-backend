const mongoose = require('mongoose')

const AccountSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      min: 0,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Account = mongoose.model('Account', AccountSchema)
module.exports = Account
