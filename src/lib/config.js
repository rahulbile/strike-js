import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Util } from './util'
import { Payment } from './payment'

export class Config {
  init(config) {
    return new Promise((resolve, reject) => {
      if (typeof config === 'undefined') {
        return reject('No configuration found!')
      }

      Util.logDebug(`strikeJS version ${SJS_BUILD} SJS href ${window.location.href}`)

      // Check if the required fields are there
      const requiredKeys = [ 'userName' ]

      if ($(config.submitButton).length !== 1) {
        Util.logInfo(`strikeJS configuration error: submitButton ${config.submitButton} not found`)
      }

      // Check each required key
      requiredKeys.forEach(requiredKey => {
        if (typeof config[requiredKey] === 'undefined') {
          return reject(`Configuration error: Unable to find key ${requiredKey}`)
        }
        return null
      })

      let payment = new Payment()

      // Add predefined fields
      sjs.fields = Util.getPageFields(config)

      // Attach the creditcard submit button
      $(config.submitButton).on('click', event => {
        event.preventDefault()
        return payment.handleSubmit()
      })

      sjs.config = config

      // Create a variations array if it's not there
      if (!config.variations) {
        config.variations = []
      }

      sjs._pageConfigs = {}

      // Initialze the payment methods
      return payment.init()
    })
  }

  generateInvoice(config) {
    return new Promise((resolve, reject) => {
      if (typeof config === 'undefined') {
        return reject('No configuration found!')
      }

      Util.logDebug(`strikeJS version ${SJS_BUILD} SJS href ${window.location.href}`)

      // Check if the required fields are there
      const requiredKeys = ['element', 'apiKey', 'amount', 'currency']

      // Check each required key
      requiredKeys.forEach(requiredKey => {
        if (typeof config[requiredKey] === 'undefined') {
          return reject(`Configuration error: Unable to find key ${requiredKey}`)
        }
        return null
      })

      sjs.config = config
      let payment = new Payment()

      return payment.generateInvoice(config)
    })
  }

  Component
}

const config = new Config()

export { config }

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
export default MyApp
