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
  strikeInvoiceCopyButton,
  strikeInvoiceCopyButtonDark,
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
     const redirectMessage = _.get(config, 'redirectMessage', 'Thanks for payment.')
     const redirectCallback = _.get(config, 'redirectCallback', false)

     if(redirectCallback) {
       Util.logDebug('Util.paymentSuccessCard: calling redirect callback', redirectCallback)
       window[redirectCallback]({invoiceId, 'status': 'success'})
     } else if (redirectMessage) {
       Util.logDebug('Util.paymentSuccessCard: showing redirect message', true)
       ReactDOM.render(
         <Box bg='#000000' position='relative' borderRadius={30} padding={20} width={280}>
           <h4 align="center" style={{ fontWeight: "bold", color: '#FFFFFF', lineHeight: 2.2 }}>
             {redirectMessage}
            </h4>
          </Box>,
        $(_.get(config,'element', ''))[0])
     }
   }

   static addPaymentCard(data, amount, element = '#strikeInvoice', expiration) {
     Util.logDebug('Util.addPaymentCard', data)
     // Here currency could be passed as _.get(amount, 'currency')
     const formattedAmount = new Intl.NumberFormat("en-US", {
       style: "currency",
       currency: "USD",
       currencyDisplay: "symbol"
     }).format(_.get(amount, 'amount'))
     expiration = (new Date(expiration).getTime() - new Date().getTime()) / 1000;
     const brandColor = '#CCFF00';
     const size = 280;
     let isCopied = false
     const copyCodeText = data.slice(0,16) + '...'
    // const [isCopied, setIsCopied] = useState(false);
     Util.logDebug('Util.addPaymentCard', true)
     ReactDOM.render(<Box
       bg='#000000' position='relative' borderRadius={30} padding={20} width={280}
       >
      <h4 class="strikeInvoiceTitle">
       Invoice
      </h4>
      <Box position='absolute'>
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
                  $('.strikeInvoiceRefresh').css('display', 'block')
                  $('.invoiceQR').css('filter','blur(2px)')
                  $('.strikeInvoiceInfo').text('Invoice has expired')
                  $('.invoiceCountdown').attr('stroke', '#333333')
                  $('.strikeInvoiceAnimate').css('display', 'none')
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
        w={size}
        h={size}
        bg='#333333'
        borderRadius={30}
        alignItems='center'
        justifyContent='center'
      >
        <Center bg='white' borderRadius={15} boxSizing='border-box' p={15}>
          <QRCodeReact includeMargin={true}
          className="invoiceQR" value={data} size={208} />
        </Center>
      </Flex>
      <h6 class="strikeInvoiceInfo">
       Pay with a Lightning Wallet
      </h6>
      <Box className="strikeInvoiceCopy">
        {copyCodeText}
        <CopyToClipboard
          onCopy={() => { isCopied = true }}
          className="strikeInvoiceCopyButton strikeInvoiceCopyButtonDark"
          text={data} >
          <button class="copyInvoiceButton" type="button" aria-label="Copy to Clipboard">
            {isCopied ? <FaRegClipboard color="#FFFFFF" size="1em" /> : <VscCopy color='#FFFFFF' size="1em" />}
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
          $('.invoiceQR').css('filter','none')
          $('.strikeInvoiceInfo').text('Pay with a Lightning Wallet')
          $('.strikeInvoiceRefresh').css('display', 'none')
          $('.invoiceCountdown').attr('stroke', brandColor)
          $('.strikeInvoiceAnimate').css('display', 'block')
        }}
        style={{ display: "none" }}width={size - 4} class="strikeInvoiceRefresh"> Refresh </Button>
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
