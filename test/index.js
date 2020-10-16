process.env.NODE_ENV = 'test'
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../src/index')
const assert = require('assert')
const { expect } = require('chai')
const db = require('../src/db')
const { after } = require('mocha')

chai.should()

chai.use(chaiHttp)
let token
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
    amount: 100,
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

describe('Register twice', function () {
  describe('When no users are registered', function () {
    it('database is empty', function (done) {
      chai
        .request(server)
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
        .request(server)
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
        .request(server)
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
        .request(server)
        .post('/api')
        .send(signUpQuery)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.errors.should.be.an('array')

          done(err)
        })
    })

    it('register user with short password', function (done) {
      const signUpQueryWithShortPassword = Object.assign({}, signUpQuery)
      signUpQueryWithShortPassword.variables = {
        username: 'iHaveShortPassword',
        email: 'iHaveShortPassword@test.com',
        password: '123',
      }
      chai
        .request(server)
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
        .request(server)
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
      const signInWithWrongUsername = Object.assign({}, loginQueryUsername)
      signInWithWrongUsername.variables = {
        username: 'iHaveShortPassword',
        email: 'iHaveShortPassword@test.com',
        password: '12345',
      }
      chai
        .request(server)
        .post('/api')
        .send(signInWithWrongUsername)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.errors.should.be.an('array')

          done()
        })
    })

    it('user cannot login with wrong password', function (done) {
      const signInWithWrongPassword = Object.assign({}, loginQueryUsername)
      signInWithWrongPassword.variables = {
        username,
        password: '12345',
      }
      chai
        .request(server)
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
        .request(server)
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
        .request(server)
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
        .request(server)
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
        .request(server)
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
        .request(server)
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
        .request(server)
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
        .request(server)
        .post('/api')
        .set('Authorization', token)
        .send(addFundsQuery)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.should.be.an('object')
          res.body.should.have.property('data')
          res.body.data.should.have.property('funds')
          assert.strictEqual(res.body.data.funds, 100)

          done()
        })
    })

    it('check balance in account after adding funds', function (done) {
      chai
        .request(server)
        .post('/api')
        .set('Authorization', token)
        .send(balanceQuery)
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          res.body.should.be.an('object')
          res.body.should.have.property('data')
          res.body.data.should.have.property('balance')
          assert.strictEqual(res.body.data.balance, 100)

          done()
        })
    })

    it('add funds to account', function (done) {
      const addNegativeFundsQuery = Object.assign({}, addFundsQuery)
      addNegativeFundsQuery.variables = {
        amount: -1,
      }
      chai
        .request(server)
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
        .request(server)
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
  })
})

after(async function (done) {
  db.close()
  done()
})
