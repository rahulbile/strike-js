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
    let apiUrl = _.get(sjs.config, 'apiUrl', 'https://api.strike.me/v1')
    let apiKey = _.get(sjs.config, 'apiKey', null)
    return new Promise((resolve, reject) => {
      const payload = {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;; charset=utf-8',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(data),
      }

      window
        .fetch(`${apiUrl}/invoices`, payload)
        .then(Api.checkStatus)
        .then(response => {
          return response.json().then(content => {
            Util.logDebug('Api.paymentRequest res:', content)
            return content
          })
        })
        .then(invoice => {
          Util.logDebug('Api.paymentRequest res: invoice generated', invoice.invoiceId)
          window
            .fetch(`${apiUrl}/invoices/${invoice.invoiceId}/quote`, payload)
            .then(Api.checkStatus)
            .then(response => {
              response.json().then(content => {
                content.invoiceId = invoice.invoiceId
                Util.logDebug('Api.paymentRequest res: guote generated', content)
                resolve({
                    paymentConfig: content
                })
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
  paymentStatus(invoiceId, expiration) {
    Util.logDebug(`Api.paymentStatus: checking status for invoice : ${invoiceId}`)
    let apiUrl = _.get(sjs.config, 'apiUrl', 'https://api.strike.me/v1')
    let apiKey = _.get(sjs.config, 'apiKey', null)
    const payload = {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;; charset=utf-8',
        'Authorization': `Bearer ${apiKey}`
      },
    }

    const interval = setInterval(() => {
      const promise = new Promise((resolve, reject) => {
        window
          .fetch(`${apiUrl}/invoices/${invoiceId}`, payload)
          .then(Api.checkStatus)
          .then(response => {
            return response.json().then(payment => {
              Util.logDebug('Api.paymentRequest res:', payment)
              if (_.includes(['PAID', 'UNPAID'], payment.state)) {
                if (payment.state === 'PAID' &&  _.get(sjs.config, 'redirectUrl', false)) {
                  clearInterval(interval)
                  resolve(payment)
                } else if (payment.state === 'PAID' &&  !_.get(sjs.config, 'redirectUrl', false)) {
                  // no redirect url specified so just show completion tick
                  Util.logDebug('Util.paymentSuccessCard', invoiceId)
                  resolve(payment)
                  Util.paymentSuccessCard(sjs.config, invoiceId)

                }
                if (payment.state === 'UNPAID') {
                  // Check if the quote is expired or no
                  var currenTime = new Date();
                  var timeleft = (new Date(expiration).getTime() - currenTime.getTime()) / 1000;
                  if (timeleft < 2) {
                    clearInterval(interval)
                    resolve(payment)
                  }
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
