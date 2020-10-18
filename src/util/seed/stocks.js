const seedStocks = async () => {
  console.log('Seeding stocks')

  const princesstarta = {
    name: 'Princesstårta',
    rate: 1.002,
    variance: 0.2,
    startingPoint: 20,
  }

  const kanelbulle = {
    name: 'Kanelbulle',
    rate: 1.001,
    variance: 0.2,
    startingPoint: 20,
  }

  const dammsugare = {
    name: 'Dammsugare',
    rate: 1.001,
    variance: 0.2,
    startingPoint: 20,
  }

  const mandelkubb = {
    name: 'Mandelkubb',
    rate: 1.003,
    variance: 0.2,
    startingPoint: 20,
  }

  const stocks = [princesstarta, mandelkubb, dammsugare, kanelbulle]

  return stocks
}

module.exports = seedStocks
