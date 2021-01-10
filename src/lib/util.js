import { Bootstrap } from './bootstrap'
import log from 'loglevel'

export class Util {
  /**
   * Helper method to send data to logging
   * @param level The  log level (log/info/warn/error)
   * @param msg The message we want to be logged
   * @param data data object to send with the log entry
   */

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
 }
