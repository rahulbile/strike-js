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
   * Submit a payment request
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
   * Track payment status
   */
  paymentStatus(quoteId) {
    Util.logDebug(`Api.paymentStatus: checking status for quoteId : ${quoteId}`)

    const interval = setInterval(() => {
      const promise = new Promise((resolve, reject) => {
        window
          .fetch(`https://api-dev.zaphq.io/api/v0.3/public/receive/${quoteId}`)
          .then(Api.checkStatus)
          .then(response => {
            return response.json().then(payment => {
              Util.logDebug('Api.paymentRequest res:', payment)
              $("#strikeInvoice").html(payment.expirySecond);
              if (_.includes(['PAID', 'EXPIRED'], payment.result)) {
                if (payment.result === 'EXPIRED') {
                  $("#paymentRequestRefresh").show();
                }
                $("#paymentInfo, #paymentRequestInvoiceCopy").hide();
                clearInterval(interval)
                resolve(payment)
              }
            })
          })
      })
      promise.then(payment => payment)
    }, 1000)
  }
}

const api = new Api()

export { api }
