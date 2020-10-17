const seedStocks = async () => {
  console.log('Seeding stocks')

  const princessTarta = {
    name: 'Princesstårta',
    rate: 1.002,
    variance: 0.6,
    startingPoint: 20,
  }

  const mandelKubb = {
    name: 'Mandel kubb',
    rate: 1.001,
    variance: 0.4,
    startingPoint: 20,
  }

  const stocks = [princessTarta, mandelKubb]

  return stocks
}

module.exports = seedStocks
