const assert = require('chai').assert
const createRequest = require('../index.js').createRequest
const getAverage = require('../index.js').getAverage
let coin_api_key = process.env.COIN_API_KEY


describe('createRequest', () => {
  const jobID = '1'

  context('successful calls', () => {
    const requestBody = { "action": "getBTCPrice"}

  let urls = ['https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD', 'https://api.coinpaprika.com/v1/tickers/btc-bitcoin', `http://rest.coinapi.io/v1/assets/BTC;ETH?apikey=${coin_api_key}`]
  let SHOULD_EXECUTE_SUCCESSFUL_REQUEST = "Test for a proper 200 response from running the request"
  it(SHOULD_EXECUTE_SUCCESSFUL_REQUEST, (done) => {
    createRequest(requestBody, urls, (statusCode, data) => {
      assert.equal(statusCode, 200)
      assert.isNotNull(data.value)
      assert.equal(data.status, "success")
      done()
    })
  })

  let SHOULD_RETURN_AVERAGE_WHEN_THERES_ONE_OR_TWO_DATA_RESPONSES = "Should return an average when one or two of the three responses are returned"
  it(SHOULD_RETURN_AVERAGE_WHEN_THERES_ONE_OR_TWO_DATA_RESPONSES, (done) => {
    let prices = [3, 3, '', undefined, null, 'NaN' ]
    let average = getAverage(prices)
    assert.equal(average, 3)
    assert.isNumber(average)
    assert.isNotNull(average)
    done()
    })

  let SHOULD_NOT_RETURN_AVERAGE_WITH_NO_DATA_RETURNED = "Should not return a number with no data returned"
  it(SHOULD_NOT_RETURN_AVERAGE_WITH_NO_DATA_RETURNED, (done) => {
    let prices = [undefined, null, '3']
    let average = getAverage(prices)
    assert.isNaN(average)
    done()
    })
  
  })

  context('error calls', () => {
    const requestBody = {id: jobID, data:{ "ticker": "AAPL"}} 
    let urls = ['https://min-api.cryptocompare.com/SOME_PATH_THAT_GOT_CHANGED_BY_THE_DATA_PROVIDER/price?fsym=BTC&tsyms=USD', 'https://api.coinpaprika.com/v1/tickers/btc-bitcoin', `http://rest.coinapi.io/v1/assets/BTC;ETH?apikey=${coin_api_key}`]
    let SHOULD_RETURN_ERROR_FOR_FALTY_URL = "Should return an error for a falty url"
    it(SHOULD_RETURN_ERROR_FOR_FALTY_URL, (done) => {
      createRequest(requestBody, urls, (statusCode, data) => {
        assert.equal(statusCode, 500)
        assert.isNotNull(data.message)
        assert.equal(data.status, "error")
        done()
        })
      })
    })
})  