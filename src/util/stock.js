var stock = {
  randomAroundZero: () => (Math.random() > 0.5 ? 1 : -1),
  getStockPrice: ({ startingPoint, rate, variance }) =>
    startingPoint * rate + variance * stock.randomAroundZero(),
}

module.exports = stock
