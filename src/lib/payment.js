/* eslint-disable no-undef */

'use strict'

import _ from 'lodash'
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
      let expiration = Date.now();
      const payParams = {
        amount: {
            'amount': Dom.getElementValue(sjs.fields['amount']),
            'currency': sjs.config.currency
					},
        description: "Strike-JS : Payment Request",
      }

      api.paymentRequest(payParams)
        .then(res => {
          Util.logDebug('payment: pay request success, generating QRCode:', res)
          expiration = _.get(res.paymentConfig, 'expiration', '')
          return Dom.generateQrCode(res.paymentConfig)
        })
        .then(invoiceId => {
          Util.logDebug(`payment: QrCode generation success for invoice : ${invoiceId} awaiting payment status.`)
          return api.paymentStatus(invoiceId, expiration)
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

  /**
   * Generate Invoice QR on request
   */
  generateInvoice(config) {
    return this.processGenerateInvoice(config)
      .then(() => Util.logDebug('payment.generateInvoice: success'))
      .catch(err => Util.logError(`payment.generateInvoice: error: ${err.message}`, err))
  }

  /**
   * Process the generateInvoice request
   */
  processGenerateInvoice(config) {
    return new Promise((resolve, reject) => {
      // First we disable the inputs
    //  Util.addPaymentCard("lnbc129530n1p3p4azxpp5n5v7yjnyjc7y9dc47u9dsuqd0vqfgjppcqtnzr7mhfdp93qymuesdqs2d68y6ttv5s9g6tscqzpgxqzr4fppquvkguxm47sue2ymwg2uz5y5446v9wcdvsp5w8nueuresj2ve3rfeqkpwk39pn72xard3hu4kfu4y27chhz93yfs9qyyssqhkrz3dpggeljk2fufs3dj8hgdkgydd9f2p5z8fmk6388fmfunfz47fy5w07fpqgwlscg4arskleq33kde3hspfmeh57z7qwggr55r6cpyggd23", config.element, 100)

      console.log("processing the payment request and show the QR code")
      var currenTime = new Date();
      let expiration = 100
      let invoiceId
      const payParams = {
        amount: {
            'amount': _.get(config, 'amount'),
            'currency': _.get(config, 'currency', 'USD')
          },
        description: _.get(config, 'description', '"Strike-JS : Payment Invoice Request"'),
      }

      api.paymentRequest(payParams)
        .then(res => {
          Util.logDebug('payment: pay request success, generating QRCode:', res)
          const lnInvoice = _.get(res.paymentConfig, 'lnInvoice', '')
          invoiceId =  _.get(res.paymentConfig, 'invoiceId', null)
          expiration = (new Date(_.get(res.paymentConfig, 'expiration', '')).getTime() - currenTime.getTime()) / 1000;
          return Util.addPaymentCard(lnInvoice, config.element, expiration)
        })
        .then(res => {
          Util.logDebug(`payment: QrCode generation success for invoice : ${invoiceId} awaiting payment status.`)
          return api.paymentStatus(invoiceId, expiration)
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
