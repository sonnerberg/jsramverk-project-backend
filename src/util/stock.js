var stock = {
  randomAroundZero: () => (Math.random() > 0.5 ? 1 : -1),
  getStockPrice: ({ startingPoint, rate, variance }) => {
    let randomNumber = Number(
      startingPoint * rate + variance * stock.randomAroundZero()
    ).toFixed(2)

    if (randomNumber > 0) {
      return randomNumber
    }
    return -randomNumber
  },
}

module.exports = stock
