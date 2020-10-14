process.env.NODE_ENV = 'test'
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const assert = require('assert')
const { expect } = require('chai')

chai.should()

chai.use(chaiHttp)

describe('Register twice', function () {
  describe('Check to see that database is empty', function () {
    it('List no users', function (done) {
      chai
        .request(server)
        .post('/api')
        .send({ query: '{ users { id username email } }' })
        .end((err, res) => {
          console.log(res.body.data.users)
          assert.strictEqual(res.body.data.users.length, 0)

          done()
        })
    })
  })
})
