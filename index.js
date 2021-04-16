'use strict';

const {serializeError} = require('serialize-error');
const fetch = require('node-fetch');
require('dotenv').config()
const coin_api_key = process.env.COIN_API_KEY


const getAverage = (array) => {
  let [sum, count] = [0, 0]
  array.forEach(number => {
    if(typeof number == 'number'){
      sum += number
      count ++
    }
  })
  return sum / count
  }


const createRequest = async (input, urls, callback) => {
  
  let responses = await Promise.all([ 
                                          fetch(urls[0]),
                                          fetch(urls[1]),
                                          fetch(urls[2])
                                        ]).then(responses => {
                                              return Promise.all(responses.map(response =>  {
                                                return response.json()
                                              }));
                                              }).then(data => {
                                                  let responseData = [data[0]?.USD, data[1].quotes?.USD?.price, data[2][0]?.price_usd]
                                                  let average = getAverage(responseData)
                                                    if(typeof average !== 'number'){
                                                      average = 'One or more of the data endpoints are either down, could not be reached, or could not recieve a response from. Please retry again later.'
                                                    }
                                                    callback(200, {status: 'success', value: average})
                                              }).catch(err => {
                                                    callback(500, {status: 'error', message: JSON.stringify(serializeError(err))})
                                              })

}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
module.exports.handlerv2 = (event, context, callback) => {
  
  let urls = ['https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD', 'https://api.coinpaprika.com/v1/tickers/btc-bitcoin', `http://rest.coinapi.io/v1/assets/BTC;ETH?apikey=${coin_api_key}`]
  createRequest(JSON.parse(event.body), urls, event, (statusCode, data) => {
      callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
      })
    })
}

module.exports.createRequest = createRequest
module.exports.getAverage = getAverage