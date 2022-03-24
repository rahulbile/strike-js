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
    ReactDOM.render(<Box className="strikeInvoiceCardBox strike-payment-loader">
    <svg height="40px" viewBox="0 0 140 42" width="120px"><path d="M53.015 41.206c4.823 0 8.388-2.866 8.388-6.813 0-1.786-.755-3.406-2.097-4.486-1.048-.79-2.936-1.744-5.242-2.575-1.468-.54-2.055-1.039-2.055-1.62 0-.582.545-.997 1.3-.997.503 0 1.216.166 1.803.415l.545.208 1.09.498c.588.208 1.091.333 1.51.374 1.343.083 2.643-1.288 2.643-2.783 0-2.41-3.104-4.237-7.13-4.237-4.613 0-8.01 2.866-8.01 6.771 0 1.786.587 3.24 1.72 4.237.964.79 2.935 1.703 5.913 2.7 1.3.457 1.803.872 1.803 1.495 0 .79-.587 1.246-1.636 1.246-.67 0-1.51-.207-2.138-.54l-1.007-.498-.545-.29c-.713-.375-1.342-.54-1.93-.54-1.425 0-2.767 1.37-2.767 2.824 0 2.326 3.858 4.61 7.842 4.61zm15.77-.25c1.928 0 3.145-1.329 3.145-3.447V25.712h1.51c2.222 0 3.438-.997 3.438-2.908 0-1.994-1.132-2.95-3.439-2.95h-1.51v-3.862c0-2.119-1.216-3.448-3.145-3.448-1.97 0-3.145 1.33-3.145 3.448v3.863h-.462c-2.264 0-3.397.955-3.397 2.949 0 1.952 1.133 2.908 3.397 2.908h.462v11.797c0 2.118 1.216 3.447 3.145 3.447zm12.33.042c1.886 0 3.103-1.33 3.103-3.448v-8.058c0-.623.125-1.288.377-1.828.294-.706.755-1.08 1.971-1.495 4.194-1.62 3.104-1.205 3.355-1.288 1.133-.499 1.594-1.288 1.594-2.575 0-1.62-1.468-3.033-3.104-3.033-1.467 0-2.81.706-4.403 2.368-.671-1.662-1.426-2.243-2.894-2.243-1.971 0-3.187 1.288-3.187 3.448V37.55c0 2.119 1.216 3.448 3.187 3.448zm14.552-23.054c2.18 0 3.69-1.495 3.69-3.614 0-2.118-1.551-3.655-3.648-3.655-2.14 0-3.69 1.537-3.69 3.614 0 2.118 1.55 3.655 3.648 3.655zm.042 22.97c1.887 0 3.103-1.328 3.103-3.447v-14.58c0-2.118-1.216-3.448-3.103-3.448-1.971 0-3.188 1.288-3.188 3.448v14.58c0 2.16 1.175 3.448 3.188 3.448zm21.175.042c1.72 0 3.061-1.287 3.061-2.949 0-1.08-.251-1.537-2.097-3.78l-.377-.457-4.068-5.109 2.936-2.99c2.013-2.12 1.467-1.538 1.677-1.787.587-.665.713-.997.713-1.62 0-1.578-1.3-3.032-2.768-3.032-1.174 0-2.055.498-3.607 2.16l-.838.914-3.985 4.153V13.998c0-2.119-1.216-3.448-3.145-3.448-1.174 0-2.223.582-2.768 1.495-.293.54-.377.914-.377 1.953v23.51c0 2.16 1.174 3.448 3.145 3.448s3.145-1.329 3.145-3.447v-6.48l4.069 5.234.754.996c2.223 2.95 3.104 3.697 4.53 3.697zm13.47.208c2.39 0 4.697-.581 6.752-1.703 1.678-.955 2.517-2.035 2.517-3.24 0-1.454-1.175-2.742-2.559-2.742-.42 0-1.048.167-1.635.457l-.462.208-.419.208-.461.249-.546.25c-1.174.456-1.845.622-2.893.622-2.307 0-3.817-1.121-4.362-3.198H137.4c1.887 0 2.6-.748 2.6-2.659 0-1.91-.545-3.863-1.51-5.524-1.887-3.157-4.865-4.86-8.597-4.86-6.25 0-10.527 4.652-10.527 11.464 0 6.19 4.53 10.468 10.988 10.468zM18.49.601l17.748 6.46c.071.026.14.055.207.087.159.05.317.104.476.162 5.655 2.058 8.59 8.256 6.557 13.844-2.034 5.587-8.267 8.448-13.922 6.39l-18.43-6.708c-1.131-.412-1.719-1.652-1.312-2.77.407-1.117 1.653-1.689 2.784-1.277l10.24 3.727a10.656 10.656 0 01-.37-4.718L1.443 8.146C.312 7.734-.275 6.494.132 5.376.538 4.26 1.785 3.688 2.916 4.1l21.024 7.65a10.656 10.656 0 013.316-3.376L17.017 4.648c-1.13-.411-1.718-1.651-1.311-2.769C16.113.762 17.359.19 18.49.601zm111.487 23.74c2.097 0 3.397 1.205 3.774 3.614h-7.8c.629-2.368 2.013-3.614 4.026-3.614zm-102.83-9.135c-1.226 3.367.537 7.099 3.936 8.336 3.4 1.237 7.148-.489 8.374-3.856 1.225-3.367-.537-7.099-3.936-8.336-3.4-1.237-7.149.489-8.374 3.856z" fill="currentColor"></path></svg>
    <Box></Box><Box></Box><Box></Box><Box></Box><Box></Box><Box></Box><Box></Box><Box></Box></Box>, jQuery(config.element)[0])
    return new Promise((resolve, reject) => {
      var currenTime = new Date();
      let expirationTime
      let invoiceId
      var timeStamp = Math.round((new Date()).getTime() / 1000);
      // generate correlationId using SJS version and Provided value
      let correlationId = 'SJS-' + timeStamp + '-' + _.get(config, 'correlationId', 'standalone');
      const payParams = {
        amount: {
          'amount': _.get(config, 'amount'),
          'currency': _.get(config, 'currency', 'USD')
        },
        correlationId: correlationId.substring(0, 40),
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
