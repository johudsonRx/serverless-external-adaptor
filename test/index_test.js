const assert = require('chai').assert
const createRequest = require('../index.js').createRequest

describe('createRequest', () => {
  const jobID = '1'

  context('successful calls', () => {
    const requests = [
      { name: 'id not supplied', testData: { data: { "symbol": "AAPL" } } },
      { name: 'ticker', testData: { id: jobID, data: { "ticker": "AAPL" } } },
      { name: 'name', testData: { id: jobID, data: { "name": "AAPL" } } },
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 200)
          assert.equal(data.jobRunID, jobID)
          assert.equal(data.result, "Apple Inc.")
          assert.isNotEmpty(data.data)
          done()
        })
      })
    })
  })

  context('error calls', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: {data: {}} },
      { name: 'unknown parameter', testData: { id: jobID, data: { foo: 'AAPL' } } },
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 500)
          assert.equal(data.jobRunID, jobID)
          assert.equal(data.status, 'errored')
          assert.isNotEmpty(data.error)
          done()
        })
      })
    })
  })
})
