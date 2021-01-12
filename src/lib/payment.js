/* eslint-disable no-undef */

'use strict'

import { Dom } from './dom'
import { Util } from './util'
import { api } from './api'

export class Payment {
  /**
   * Handle the submit Request
   */
  handleSubmit() {
    Util.startLoading()
    return this.process()
      .then(() => Util.logDebug('payment.handleSubmit: success'))
      .catch(err => Util.logError(`payment.handleSubmit: error: ${err.message}`, err))
  }

  /**
   * Initialize the Payment Request for SJS
   */
  init() {
    console.log('Setting the defaults for payment page')
  }

  /**
   * Process the {Payment}
   */
  process() {
    return new Promise((resolve, reject) => {
      // First we disable the inputs
      Util.disableInputs()
      console.log("processing the payment request and show the QR code")

      const payParams = {
        amountUsd: Dom.getElementValue(sjs.fields['amount']),
        description: "Strike-JS : Payment Request"
      }

      api.paymentRequest(payParams)
        .then(res => {
          Util.logDebug('payment: pay request success, generating QRCode:', res)
          return Dom.generateQrCode(res.paymentConfig)
        })
        .then(quoteId => {
          Util.logDebug(`payment: QrCode generation success, quoteId : ${quoteId} awaiting payment status.`)
          return api.paymentStatus(quoteId)
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
            Util.logDebug(`payment.process: payment request failed: ${err.message}`, err)
            const errorMsg = `<b>Something went wrong, please try again after some time.</b>`
            Util.showError(errorMsg)
            resolve()
          })
        })
  }
}

const payment = new Payment()

export { payment }
