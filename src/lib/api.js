import { Util } from './util'
import { Dom } from './dom'

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
      let apiUrl = _.get(sjs.config, 'apiUrl', 'https://api.zaphq.io/api/v0.3')

      window
        .fetch(`${apiUrl}/public/users/${sjs.config.userName}/pay`, payload)
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
        let apiUrl = _.get(sjs.config, 'apiUrl', 'https://api.zaphq.io/api/v0.3')
        window
          .fetch(`${apiUrl}/public/receive/${quoteId}`)
          .then(Api.checkStatus)
          .then(response => {
            return response.json().then(payment => {
              Util.logDebug('Api.paymentRequest res:', payment)
              $("#strikeInvoice").html(payment.expirySecond);
              if (_.includes(['PAID', 'EXPIRED'], payment.result)) {
                if (payment.result === 'EXPIRED') {
                  $("#paymentRequestRefresh").show();
                  // Add class to QrSlider for bluring the request and freeze
                  $("#QrSlider").addClass('qrCodeExpired')
                  // Add overlay message of expiration
                  $("#QrCodeLoader").html('Expired')
                }
                $("#paymentInfo, #paymentRequestInvoiceCopy").hide();
                clearInterval(interval)
                resolve(payment)

                if (payment.result === 'PAID' &&  _.get(sjs.config, 'redirectUrl', false)) {
                  Dom.navigateTo(sjs.config.redirectUrl)
                }
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
