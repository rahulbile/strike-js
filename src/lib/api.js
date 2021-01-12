import { Util } from './util'

export class Api {

  /**
   * Check the status of the response from api request
   */
  static checkStatus(response) {
    if (response.statusCode >= 500) {
      const err = new Error(response.statusText)

      err.response = response
      throw err
    }
    return response
  }

  /**
   * Submit a paymnet request
   */
  paymentRequest(data) {
    return new Promise((resolve, reject) => {
      const payload = {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;; charset=utf-8',
        },
        body: JSON.stringify(data),
      }

      window
        .fetch(`https://api-dev.zaphq.io/api/v0.3/public/users/${sjs.config.userName}/pay`, payload)
        .then(Api.checkStatus)
        .then(response => {
          response.json().then(content => {
            Util.logDebug('Api.paymentRequest res:', content)
            resolve({
              paymentConfig: content
            })
          })
        })
        .catch(err => {
          Util.logDebug(`Api.paymentRequest err: ${err.message}`, err)
          reject(err)
        })
    })
  }

  /**
   * Submit a paymnet request
   */
  paymentStatus(quoteId) {
    Util.logDebug(`Api.paymentStatus: checking status for quoteId : ${quoteId}`)
    return true
  }
}

const api = new Api()

export { api }
