import { payment } from './payment'
import "@fontsource/montserrat/500.css"
import "@fontsource/montserrat/700.css"
import "@fontsource/source-code-pro"
import { Bootstrap } from './bootstrap'
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Center, Box, Button, Flex, Text } from "@chakra-ui/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaRegClipboard } from "react-icons/fa";
import { VscCopy } from "react-icons/vsc"
import QRCodeReact from "qrcode.react";
import { Dom } from './dom'
import log from 'loglevel'
import {
  strikeInvoiceCopy,
  strikeInvoiceCopyButton
} from "../css/style.sass";

export class Util {
  /**
   * Helper method to send data to logging
   * @param level The  log level (log/info/warn/error)
   * @param msg The message we want to be logged
   * @param data data object to send with the log entry
   */

   static paymentSuccessCard(config, invoiceId) {
     Util.logDebug('Util.paymentSuccessCard: Payment success', true)
     const redirectMessage = _.get(config, 'redirectMessage', false)
     const redirectCallback = _.get(config, 'redirectCallback', false)
     const redirectUrl = _.get(config, 'redirectUrl', false)

     if(redirectCallback) {
       Util.logDebug('Util.paymentSuccessCard: calling redirect callback', redirectCallback)
       window[redirectCallback]({invoiceId, 'status': 'success'})
     } else if (redirectMessage) {
       Util.logDebug('Util.paymentSuccessCard: showing redirect message', true)
       ReactDOM.render(
         <Box className="strikeInvoiceInfo" bg='#000000' position='relative' borderRadius={30} padding={20} >
           <h4>
             {redirectMessage}
            </h4>
          </Box>,
        jQuery(_.get(config,'element'))[0])
     } else if (redirectUrl) {
       Util.logDebug('Util.paymentSuccessCard: calling redirect url', redirectUrl)
       Dom.navigateTo(redirectUrl)
     }
   }

   static addPaymentCard(data, amount, element = '#strikeInvoice', expiration) {
     // Here currency could be passed as _.get(amount, 'currency')
     const formattedAmount = new Intl.NumberFormat("en-US", {
       style: "currency",
       currency: "USD",
       currencyDisplay: "symbol"
     }).format(_.get(amount, 'amount'))
     expiration = (new Date(expiration).getTime() - new Date().getTime()) / 1000;
     const brandColor = '#CCFF00';
     const size = 232;
     const copyCodeText = data.slice(0,16) + '...  '
     Util.logDebug('Util.addPaymentCard', true)
     ReactDOM.render(<Box className="strikeInvoiceCardBox"
       bg='#000000' position='relative' borderRadius={30} maxWidth={280}
       >
      <Box className="strikeInvoiceData">
        <h4 class="strikeInvoiceTitle">
         Invoice
        </h4>
        <Box className="strikeInvoiceQR" position='absolute'>
          <a href={`lightning:${data}`}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <rect
                class="invoiceCountdown"
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
                  onAnimationEnd={() => {
                    jQuery('.invoiceQR').css('filter','blur(2px)')
                    jQuery('.strikeInvoiceRefresh').css('display', 'block')
                    jQuery('.strikeInvoiceInfo').text('Invoice has expired')
                    jQuery('.invoiceCountdown').attr('stroke', '#333333')
                    jQuery('.strikeInvoiceAnimate').css('display', 'none')
                  }}
                  className="strikeInvoiceAnimate"
                  x='2'
                  y='2'
                  width={size - 4}
                  height={size - 4}
                  fill='none'
                  stroke='#333333'
                  strokeWidth='6'
                  strokeDashoffset={size * 4}
                  strokeDasharray={size * 4}
                  rx='28'
                  style={{
                    animationDuration: `${expiration}s`,
                  }}
                />
              </svg>
            </Box>
          </a>
        </Box>
        <Flex
          h={size}
          w={size}
          bg='#333333'
          borderRadius={30}
          alignItems='center'
          justifyContent='center'
        >
          <Center bg='white' borderRadius={15} boxSizing='border-box' p={15}>
            <QRCodeReact includeMargin={true}
            className="invoiceQR" value={data} size={175} />
          </Center>
        </Flex>
        <h6 class="strikeInvoiceInfo">
         Pay with a Lightning Wallet
        </h6>
        <Box className="strikeInvoiceCopy">
          {copyCodeText}
          <CopyToClipboard
            className="strikeInvoiceCopyButton"
            text={data} >
            <button class="copyInvoiceButton" type="button" aria-label="Copy to Clipboard">
              <VscCopy style= {{ display: "inline" }} size="1em" />
            </button>
          </CopyToClipboard>
        </Box>
        <hr class="strikeInvoiceSeperator"/>
        <Box className="strikeInvoiceAmountContainer">
          <h4 class="strikeInvoiceAmountLabel">
           Amount
          </h4>
          <h4 class="strikeInvoiceAmount">
           {formattedAmount}
          </h4>
        </Box>
        <Button
          onClick={() => {
            // Process new request
            payment.generateInvoice({
              'amount': _.get(amount, 'amount'),
              'currency': _.get(amount, 'currency'),
              element
            })
            // toggle qr blur and refresh
            jQuery('.invoiceQR').css('filter','none')
            jQuery('.strikeInvoiceInfo').text('Pay with a Lightning Wallet')
            jQuery('.strikeInvoiceRefresh').css('display', 'none')
            jQuery('.invoiceCountdown').attr('stroke', brandColor)
            jQuery('.strikeInvoiceAnimate').css('display', 'block')
          }}
          style= {{ display: "none" }} width={size - 4} class="strikeInvoiceRefresh"> Refresh </Button>
        </Box>
    </Box>, jQuery(element)[0])
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
     jQuery('.strike-loading-overlay').fadeIn(250)
   }

   static stopLoading() {
     Util.enableInputs()
     Util.logDebug('StrikeJS.stopLoading')
     jQuery('.strike-loading-overlay').fadeOut(500)
   }

   /**
    * Create and handle error overlay
    */
   static createErrorOverlay() {
     if (jQuery('#strikeErrorOverlay').length) {
       Util.logDebug('StrikeJS.createErrorOverlay already exists')
       return true
     }
     Util.logDebug('StrikeJS.createErrorOverlay')
     const overlay = jQuery('<div>', {
       id: 'strikeErrorOverlay',
       class: 'strike-error-overlay strike-overlay',
     })
     const message = jQuery('<div>', {
       class: 'strike-error-message',
     })

     overlay.append(message)
     overlay.on('click', () => Util.hideError())
     jQuery('body').prepend(overlay)
     return null
   }

   static showError(msg) {
     Util.logDebug('StrikeJS.showError')
     jQuery('.strike-loading-overlay').hide()
     jQuery('.strike-error-overlay').fadeIn(250)
     jQuery('.strike-error-overlay .strike-error-message').html(msg)
   }

   static hideError() {
     Util.enableInputs()
     Util.logDebug('StrikeJS.hideError')
     jQuery('.strike-error-overlay').fadeOut(500)
     jQuery(sjs.config.submitButton).removeClass('disabled')
   }

   /**
    * Enable and disable all inputs
    */
   static disableInputs() {
     Util.logDebug('StrikeJS.disableInputs')
     jQuery('[id^=strike-]').attr('disabled', true)
   }

   static enableInputs() {
     Util.logDebug('StrikeJS.enableInputs')
     jQuery('[id^=strike-]').attr('disabled', false)
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
