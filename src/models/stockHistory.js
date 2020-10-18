const mongoose = require('mongoose')

const StockHistorySchema = new mongoose.Schema(
  {
    history: [
      {
        name: {
          type: String,
          required: true,
        },
        value: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    capped: {
      size: 340000,
      max: 1000,
    },
  }
)

const stockHistory = mongoose.model('stockHistory', StockHistorySchema)
module.exports = stockHistory
