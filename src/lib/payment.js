/* eslint-disable no-undef */

'use strict'

import { Util } from './util'

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
      console.log("processing the payment and redirecting to the thankyou page")
    })
  }
}

const payment = new Payment()

export { payment }
