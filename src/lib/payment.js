/* eslint-disable no-undef */

'use strict'

import _ from 'lodash'
import { Dom } from './dom'
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Box } from "@chakra-ui/react";
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
      // First we disable the inputs
    Util.disableInputs()
    console.log("processing the payment request and show the QR code")
    const payParams = {
      'amount': parseFloat(Dom.getElementValue(sjs.fields['amount'])),
      'currency': _.get(sjs, 'config.currency'),
      'element': _.get(sjs, 'config.element')
    }
    return this.generateInvoice(payParams)
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
    ReactDOM.render(<Box className="strikeInvoiceCardBox strike-payment-loader"><Box></Box><Box></Box><Box></Box><Box></Box><Box></Box><Box></Box><Box></Box><Box></Box></Box>, $(config.element)[0])
    return new Promise((resolve, reject) => {
      var currenTime = new Date();
      let expirationTime
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
          expirationTime = _.get(res.paymentConfig, 'expiration', '')
          return Util.addPaymentCard(lnInvoice, _.get(payParams, 'amount'), config.element, expirationTime)
        })
        .then(res => {
          Util.logDebug(`payment: QrCode generation success for invoice : ${invoiceId} awaiting payment status.`)
          return api.paymentStatus(invoiceId, expirationTime)
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
