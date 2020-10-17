const mongoose = require('mongoose')

const StockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: { unique: true },
    },
    rate: {
      type: Number,
      required: true,
    },
    variance: {
      type: Number,
      required: true,
    },
    startingPoint: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const stock = mongoose.model('stock', StockSchema)
module.exports = stock
