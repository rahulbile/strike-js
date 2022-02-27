import { Bootstrap } from './bootstrap'
import React from 'react';
import ReactDOM from 'react-dom';
import { Center, Box, Flex } from "@chakra-ui/react";
import QRCodeReact from "qrcode.react";
import { Dom } from './dom'
import log from 'loglevel'

export class Util {
  /**
   * Helper method to send data to logging
   * @param level The  log level (log/info/warn/error)
   * @param msg The message we want to be logged
   * @param data data object to send with the log entry
   */

   static addPaymentCard(data, element = '#strikeInvoice', animationDuration = 100) {
     Util.logDebug('Util.addPaymentCard')
     const brandColor = '#CCFF00';
     const size = 280;
     ReactDOM.render(<Box position='relative' w={280}>
      <Box position='absolute'>
        <a href={`lightning:${data}`}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect
              x='2'
              y='2'
              width={size - 4}
              height={size - 4}
              fill='none'
              stroke={brandColor}
              strokeWidth='4'
              rx='28'
            />
          </svg>
          <Box position='absolute' top={0} left={0}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <rect
                className="rect"
                x='2'
                y='2'
                width={size - 4}
                height={size - 4}
                fill='none'
                stroke='#1A1A1A'
                strokeWidth='6'
                strokeDashoffset={size * 4}
                strokeDasharray={size * 4}
                rx='28'
                style={{
                  animationDuration: `${animationDuration}s`,
                }}
              />
            </svg>
          </Box>
        </a>
      </Box>
      <Flex
        w={size}
        h={size}
        bg='#1a1a1a'
        borderRadius={30}
        alignItems='center'
        justifyContent='center'
      >
        <Center bg='white' borderRadius={8} boxSizing='border-box' p={2}>
          <QRCodeReact value={data} size={208} />
        </Center>
      </Flex>
    </Box>, $(element)[0])
   }

   static logDebug(msg, obj) {
     log.debug('logDebug:', msg, obj)
   }

   static logError(msg, obj) {
     log.error('logError:', msg, obj)
   }

   static logInfo(msg, obj) {
     log.info('logInfo:', msg, obj)
   }

   static startLoading() {
     Util.disableInputs()
     Util.logDebug('StrikeJS.startLoading')
     $('.strike-loading-overlay').fadeIn(250)
   }

   static stopLoading() {
     Util.enableInputs()
     Util.logDebug('StrikeJS.stopLoading')
     $('.strike-loading-overlay').fadeOut(500)
   }

   /**
    * Create and handle error overlay
    */
   static createErrorOverlay() {
     if ($('#strikeErrorOverlay').length) {
       Util.logDebug('StrikeJS.createErrorOverlay already exists')
       return true
     }
     Util.logDebug('StrikeJS.createErrorOverlay')
     const overlay = $('<div>', {
       id: 'strikeErrorOverlay',
       class: 'strike-error-overlay strike-overlay',
     })
     const message = $('<div>', {
       class: 'strike-error-message',
     })

     overlay.append(message)
     overlay.on('click', () => Util.hideError())
     $('body').prepend(overlay)
     return null
   }

   static showError(msg) {
     Util.logDebug('StrikeJS.showError')
     $('.strike-loading-overlay').hide()
     $('.strike-error-overlay').fadeIn(250)
     $('.strike-error-overlay .strike-error-message').html(msg)
   }

   static hideError() {
     Util.enableInputs()
     Util.logDebug('StrikeJS.hideError')
     $('.strike-error-overlay').fadeOut(500)
     $(sjs.config.submitButton).removeClass('disabled')
   }

   /**
    * Enable and disable all inputs
    */
   static disableInputs() {
     Util.logDebug('StrikeJS.disableInputs')
     $('[id^=strike-]').attr('disabled', true)
   }

   static enableInputs() {
     Util.logDebug('StrikeJS.enableInputs')
     $('[id^=strike-]').attr('disabled', false)
   }

   /**
    * Validate and return the fields which are added on the page.
    * @returns {Object}
    */
   static getPageFields(config) {
     const fields = {}

     // loop through all supported fields types and add to the list
     const supportedFields = Util.getFields()

     Object.keys(supportedFields).forEach(field => {
       if (Dom.getElementLength(field)) {
         fields[field] = Dom.getElement(field)
       }
     })

     return fields
   }

   /**
    * Expected field defination
    * @returns {Object}
    */
   static getFields() {
    return {
      'qrCode': 'qRCode',
      'amount': 'amount',
    }
   }
 }
