process.env.NODE_ENV = 'test'
const chai = require('chai')
const chaiHttp = require('chai-http')
const { application, interval } = require('../src/index')
const assert = require('assert')
const { expect } = require('chai')
const db = require('../src/db')
const { after } = require('mocha')

chai.should()

chai.use(chaiHttp)
let token
let stock
const username = 'mochatest'
const email = 'mocha@test.com'
const password = '123456789'
const balanceQuery = {
  operationName: null,
  query: `query
        balance
          { balance }`,
  variables: null,
}

const meQuery = {
  operationName: null,
  query: `query
        me
          { me {
                username
                email
                id
                avatar
              }
        }`,
  variables: null,
}
const signUpQuery = {
  operationName: null,
  query: `mutation
      signUp(
          $username: String!
          $email: String!
          $password: String!
          )
          {
            token: signUp(
            username: $username
            email: $email
            password: $password
            )
          }`,
  variables: {
    username,
    email,
    password,
  },
}

const usersQuery = {
  operationName: null,
  query: `query
        user( $username: String!)
          { user( username: $username) {
                username
                email
                id
                avatar
              }
        }`,
  variables: {
    username,
  },
}

const addFundsQuery = {
  operationName: null,
  query: `mutation
    addFunds (
      $amount: Int!,
      )
          {
            funds: addFunds (
            amount: $amount
            )
          }`,
  variables: {
    amount: 9999,
  },
}

const loginQueryEmail = {
  operationName: null,
  query: `mutation
    signIn(
      $email: String,
      $password: String!)
          {
            token: signIn(
            email: $email
            password: $password
            )
          }`,
  variables: {
    email,
    password,
  },
}

const loginQueryUsername = {
  operationName: null,
  query: `mutation
    signIn(
      $username: String,
      $password: String!)
          {
            token: signIn(
            username: $username
            password: $password
            )
          }`,
  variables: {
    username,
    password,
  },
}

const signUpQueryWithShortPassword = Object.assign({}, signUpQuery)
signUpQueryWithShortPassword.variables = {
  username: 'iHaveShortPassword',
  email: 'iHaveShortPassword@test.com',
  password: '123',
}

const signInWithWrongUsername = Object.assign({}, loginQueryUsername)
signInWithWrongUsername.variables = {
  username: 'iHaveShortPassword',
  email: 'iHaveShortPassword@test.com',
  password: '12345',
}

const signInWithWrongPassword = Object.assign({}, loginQueryUsername)
signInWithWrongPassword.variables = {
  username,
  password: '12345',
}

const addNegativeFundsQuery = Object.assign({}, addFundsQuery)
addNegativeFundsQuery.variables = {
  amount: -1,
}

const getMyStocks = {
  operationName: null,
  query: `query
    myStocks {
        myStocks {
            name
            amount
          }
  }`,
  variables: null,
}

const getStocks = {
  operationName: null,
  query: `query
  allStocks {
      stocks {
          name
          startingPoint
        }
  }`,
  variables: null,
}

const getPriceOfStocks = {
  operationName: null,
  query: `query
priceNow {
        priceNow {
    createdAt
    updatedAt
    history {
      name
      value
    }
  }}`,
  variables: null,
}

const getPriceHistoryNoLimit = {
  operationName: null,
  query: `query stockHistory($limit: Int) {
  stockHistory(limit: $limit) {
    createdAt
    updatedAt
    	history {
        name
        value
      }
  }
}`,
  variables: null,
}

const buyStock = {
  operationName: null,
  query: `mutation
    buyStock(
      $stock: String!,
      $amount: Float!
      )
          {
            buyStock(
            stock: $stock
            amount: $amount
            ) {
              name
              amount
            }
          }`,
  variables: null,
}

const sellStock = {
  operationName: null,
  query: `mutation
    sellStock(
      $stock: String!,
      $amount: Float!
      )
          {
            sellStock(
            stock: $stock
            amount: $amount
            ) {
              name
              amount
            }
          }`,
  variables: null,
}

describe('Register twice', function () {
  describe('When no users are registered', function () {
    it('database is empty', function (done) {
      chai
        .request(application)
        .post('/api')
        .send({ query: '{ users { id } }' })
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.should.have.property('data')
          res.body.should.be.an('object')
          assert.strictEqual(res.body.data.users.length, 0)

          done(err)
        })
    })

    it('register user', function (done) {
      chai
        .request(application)
        .post('/api')
        .send(signUpQuery)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.should.be.an('object')
          res.body.should.have.property('data')
          res.body.data.should.have.property('token')

          done(err)
        })
    })

    it('user in database', function (done) {
      chai
        .request(application)
        .post('/api')
        .send(usersQuery)
        .end((err, res) => {
          assert.strictEqual(res.body.data.user.username, username)
          assert.strictEqual(res.body.data.user.email, email)

          done()
        })
    })

    it('register user again', function (done) {
      chai
        .request(application)
        .post('/api')
        .send(signUpQuery)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.errors.should.be.an('array')

          done(err)
        })
    })

    it('register user with short password', function (done) {
      chai
        .request(application)
        .post('/api')
        .send(signUpQueryWithShortPassword)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.errors.should.be.an('array')

          done(err)
        })
    })

    it('database has one entry', function (done) {
      chai
        .request(application)
        .post('/api')
        .send({ query: '{ users { id } }' })
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.should.have.property('data')
          res.body.should.be.an('object')
          assert.strictEqual(res.body.data.users.length, 1)

          done(err)
        })
    })

    it('user cannot login with wrong username', function (done) {
      chai
        .request(application)
        .post('/api')
        .send(signInWithWrongUsername)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.errors.should.be.an('array')

          done()
        })
    })

    it('user cannot login with wrong password', function (done) {
      chai
        .request(application)
        .post('/api')
        .send(signInWithWrongPassword)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.errors.should.be.an('array')

          done()
        })
    })

    it('user can login with username', function (done) {
      chai
        .request(application)
        .post('/api')
        .send(loginQueryUsername)
        .end((err, res) => {
          token = res.body.data.token
          expect(res.status).to.be.equal(200)
          res.body.should.be.an('object')
          res.body.should.have.property('data')
          res.body.data.should.have.property('token')

          done()
        })
    })

    it('user can login with email', function (done) {
      chai
        .request(application)
        .post('/api')
        .send(loginQueryEmail)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.should.be.an('object')
          res.body.should.have.property('data')
          res.body.data.should.have.property('token')

          done()
        })
    })

    it('get details about myself', function (done) {
      chai
        .request(application)
        .post('/api')
        .set('Authorization', token)
        .send(meQuery)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.should.be.an('object')
          res.body.should.have.property('data')
          res.body.data.should.have.property('me')
          res.body.data.me.should.have.property('username')
          res.body.data.me.should.have.property('email')
          res.body.data.me.should.have.property('id')
          res.body.data.me.should.have.property('avatar')

          done()
        })
    })

    it('check balance in account', function (done) {
      chai
        .request(application)
        .post('/api')
        .set('Authorization', token)
        .send(balanceQuery)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.should.be.an('object')
          res.body.should.have.property('data')
          res.body.data.should.have.property('balance')
          assert.strictEqual(res.body.data.balance, 0)

          done()
        })
    })

    it('check balance in account without token', function (done) {
      chai
        .request(application)
        .post('/api')
        .send(balanceQuery)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.errors.should.be.an('array')

          done()
        })
    })

    it('check balance in account with malformed token', function (done) {
      chai
        .request(application)
        .post('/api')
        .set(
          'Authorization',
          'eyJhbGciOiJIUzI1NiIsInR4cCI5IkpXVCJ9.eyJpZCI6IjVmODc0MzE5YmVmMTdmMjBmMGFjZmQ5NiIsImlhdCI6MTYwMjcwMDA1N30.fhmjnWuq6nHFdY5SCA4Xe165BaIhHXfffxTCNaFd1zE'
        )
        .send(balanceQuery)
        .end((err, res) => {
          expect(res.status).to.be.equal(500)
          res.body.errors.should.be.an('array')

          done()
        })
    })

    it('add funds to account', function (done) {
      chai
        .request(application)
        .post('/api')
        .set('Authorization', token)
        .send(addFundsQuery)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.should.be.an('object')
          res.body.should.have.property('data')
          res.body.data.should.have.property('funds')
          assert.strictEqual(
            res.body.data.funds,
            addFundsQuery.variables.amount
          )

          done()
        })
    })

    it('check balance in account after adding funds', function (done) {
      chai
        .request(application)
        .post('/api')
        .set('Authorization', token)
        .send(balanceQuery)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.should.be.an('object')
          res.body.should.have.property('data')
          res.body.data.should.have.property('balance')
          assert.strictEqual(
            res.body.data.balance,
            addFundsQuery.variables.amount
          )

          done()
        })
    })

    it('add negative funds to account', function (done) {
      chai
        .request(application)
        .post('/api')
        .set('Authorization', token)
        .send(addNegativeFundsQuery)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.errors.should.be.an('array')

          done()
        })
    })

    it('add funds to account with malformed token', function (done) {
      chai
        .request(application)
        .post('/api')
        .set(
          'Authorization',
          'eyJhbcciOiJIUzI1NiIsInR4cCI5IkpXVCJ9.eyJpZCI6IjVmODc0MzE5YmVmMTdmMjBmMGFjZmQ5NiIsImlhdCI6MTYwMjcwMDA1N30.fhmjnWuq6nHFdY5SCA4Xe165BaIhHXfffxTCNaFd1zE'
        )
        .send(addFundsQuery)
        .end((err, res) => {
          expect(res.status).to.be.equal(500)
          res.body.errors.should.be.an('array')

          done()
        })
    })

    it('get a list of my non existent stocks', function (done) {
      chai
        .request(application)
        .post('/api')
        .set('Authorization', token)
        .send(getMyStocks)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.should.be.an('object')
          res.body.should.have.property('data')
          res.body.data.should.have.property('myStocks')
          res.body.data.myStocks.should.be.an('array')
          assert.strictEqual(res.body.data.myStocks.length, 0)

          done()
        })
    })

    it('get a list of stocks', function (done) {
      chai
        .request(application)
        .post('/api')
        .send(getStocks)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.should.be.an('object')
          res.body.should.have.property('data')
          res.body.data.should.have.property('stocks')
          res.body.data.stocks.should.be.an('array')
          stock = res.body.data.stocks[0].name

          done()
        })
    })

    it('get current prices', function (done) {
      chai
        .request(application)
        .post('/api')
        .send(getPriceOfStocks)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.should.be.an('object')
          res.body.should.have.property('data')
          res.body.data.priceNow.should.be.an('object')
          res.body.data.should.have.property('priceNow')
          res.body.data.priceNow.should.have.property('createdAt')
          res.body.data.priceNow.should.have.property('updatedAt')
          res.body.data.priceNow.should.have.property('history')
          res.body.data.priceNow.history.should.be.an('array')

          done()
        })
    })

    it('get historic prices', function (done) {
      chai
        .request(application)
        .post('/api')
        .send(getPriceHistoryNoLimit)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.should.be.an('object')
          res.body.should.have.property('data')
          res.body.data.stockHistory.should.be.an('array')
          res.body.data.should.have.property('stockHistory')
          res.body.data.stockHistory[0].should.have.property('createdAt')
          res.body.data.stockHistory[0].should.have.property('updatedAt')
          res.body.data.stockHistory[0].should.have.property('history')
          res.body.data.stockHistory[0].history.should.be.an('array')

          done()
        })
    })

    it('buy stock without token', function (done) {
      const buyStockWithoutToken = Object.assign({}, buyStock)
      buyStockWithoutToken.variables = {
        stock,
        amount: 1,
      }
      chai
        .request(application)
        .post('/api')
        .send(buyStockWithoutToken)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.errors.should.be.an('array')

          done(err)
        })
    })

    it('buy stock with insufficient funds', function (done) {
      const buyStockWithoutFunds = Object.assign({}, buyStock)
      buyStockWithoutFunds.variables = {
        stock,
        amount: 10000,
      }
      chai
        .request(application)
        .post('/api')
        .set('Authorization', token)
        .send(buyStockWithoutFunds)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.errors.should.be.an('array')
          assert.strictEqual(res.body.errors[0].message, 'Insufficient funds')

          done(err)
        })
    })

    it('buy stock that does not exist', function (done) {
      const buyStockThatDoesNotExist = Object.assign({}, buyStock)
      buyStockThatDoesNotExist.variables = {
        stock: 'kjasfkjlhsadlfkjdsalkjfhalkjdshfkljdsahflkjadshflkjadsh',
        amount: 1,
      }
      chai
        .request(application)
        .post('/api')
        .set('Authorization', token)
        .send(buyStockThatDoesNotExist)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.errors.should.be.an('array')
          assert.strictEqual(res.body.errors[0].message, 'Stock does not exist')

          done(err)
        })
    })

    it('buy stock that does exist', function (done) {
      const buyStockThatDoesExist = Object.assign({}, buyStock)
      buyStockThatDoesExist.variables = {
        stock,
        amount: 1,
      }
      chai
        .request(application)
        .post('/api')
        .set('Authorization', token)
        .send(buyStockThatDoesExist)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          // res.body.errors.should.be.an('array')
          // assert.strictEqual(res.body.errors[0].message, 'Stock does not exist')
          assert.strictEqual(res.body.data.buyStock.name, stock)
          assert.strictEqual(res.body.data.buyStock.amount, 1)

          done(err)
        })
    })

    it('buy stock that does exist again', function (done) {
      const buyStockThatDoesExist = Object.assign({}, buyStock)
      buyStockThatDoesExist.variables = {
        stock,
        amount: 1,
      }
      chai
        .request(application)
        .post('/api')
        .set('Authorization', token)
        .send(buyStockThatDoesExist)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          assert.strictEqual(res.body.data.buyStock.name, stock)
          assert.strictEqual(res.body.data.buyStock.amount, 2)

          done(err)
        })
    })

    it('sell stock that does exist', function (done) {
      const sellStockThatDoesExist = Object.assign({}, sellStock)
      sellStockThatDoesExist.variables = {
        stock,
        amount: 1,
      }
      chai
        .request(application)
        .post('/api')
        .set('Authorization', token)
        .send(sellStockThatDoesExist)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          assert.strictEqual(res.body.data.sellStock.name, stock)
          assert.strictEqual(res.body.data.sellStock.amount, 1)

          done(err)
        })
    })

    it('sell too much stock that does exist again', function (done) {
      const sellStockThatDoesExist = Object.assign({}, sellStock)
      sellStockThatDoesExist.variables = {
        stock,
        amount: 999,
      }
      chai
        .request(application)
        .post('/api')
        .set('Authorization', token)
        .send(sellStockThatDoesExist)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.errors.should.be.an('array')
          assert.strictEqual(res.body.errors[0].message, 'Not enough stock')

          done(err)
        })
    })

    it('sell stock that does exist again', function (done) {
      const sellStockThatDoesExist = Object.assign({}, sellStock)
      sellStockThatDoesExist.variables = {
        stock,
        amount: 1,
      }
      chai
        .request(application)
        .post('/api')
        .set('Authorization', token)
        .send(sellStockThatDoesExist)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          assert.strictEqual(res.body.data.sellStock.name, stock)
          assert.strictEqual(res.body.data.sellStock.amount, 0)

          done(err)
        })
    })

    it('sell stock that is not owned', function (done) {
      const sellStockThatDoesExist = Object.assign({}, sellStock)
      sellStockThatDoesExist.variables = {
        stock,
        amount: 1,
      }
      chai
        .request(application)
        .post('/api')
        .set('Authorization', token)
        .send(sellStockThatDoesExist)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.errors.should.be.an('array')
          assert.strictEqual(res.body.errors[0].message, 'Stock not owned')

          done(err)
        })
    })

    it('sell stock that does not exist', function (done) {
      const sellStockThatDoesNotExist = Object.assign({}, sellStock)
      sellStockThatDoesNotExist.variables = {
        stock: 'asdfadsfjkjasdfdsakfjadsgfs',
        amount: 1,
      }
      chai
        .request(application)
        .post('/api')
        .set('Authorization', token)
        .send(sellStockThatDoesNotExist)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.errors.should.be.an('array')
          assert.strictEqual(res.body.errors[0].message, 'Stock does not exist')

          done(err)
        })
    })
  })
})

after(function (done) {
  db.close()
  clearInterval(interval)
  done()
})
