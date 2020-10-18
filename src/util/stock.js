var stock = {
  randomAroundZero: () => (Math.random() > 0.5 ? 1 : -1),
  getStockPrice: ({ start, rate, variance }) =>
    start * rate + variance * stock.randomAroundZero(),
}

module.exports = stock
