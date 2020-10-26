const seedStocks = async () => {
  console.log('Seeding stocks')

  const princesstarta = {
    name: 'Princesstårta',
    rate: 1.001,
    variance: 6.0,
    startingPoint: 50,
  }

  const kanelbulle = {
    name: 'Kanelbulle',
    rate: 1.001,
    variance: 6.5,
    startingPoint: 15,
  }

  const dammsugare = {
    name: 'Dammsugare',
    rate: 1.001,
    variance: 4.8,
    startingPoint: 10,
  }

  const mandelkubb = {
    name: 'Mandelkubb',
    rate: 1.001,
    variance: 5.5,
    startingPoint: 5,
  }

  const stocks = [princesstarta, mandelkubb, dammsugare, kanelbulle]

  return stocks
}

module.exports = seedStocks
