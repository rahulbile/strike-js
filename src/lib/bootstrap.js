import _ from 'lodash'
import { config } from './config'
import { StrikeJS } from './strike'
import { Util } from './util'

export class Bootstrap {
  /**
   * Load the external dependencies
   */
  static loadDependencies(cb) {
    $.when(
      $.getScript('//cdnjs.cloudflare.com/ajax/libs/es6-promise/4.2.8/es6-promise.min.js'),
      $.getScript('//cdnjs.cloudflare.com/ajax/libs/validate.js/0.13.1/validate.min.js'),
      $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "//cdnjs.cloudflare.com/ajax/libs/unslider/2.0.3/css/unslider-dots.css"
      }).appendTo("head"),
      $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "//cdnjs.cloudflare.com/ajax/libs/unslider/2.0.3/css/unslider.css"
      }).appendTo("head"),
    )
      .done(() => {
        // Ensure that validate.js knows about our Promise implementation, which may have become
        // available only after validate.js initialized.
        window.validate.Promise = Promise
        cb()
      })
      .fail(cb)
  }

  /**
   * StrikeJS version info
   */
  static version() {
    return {
      name: SJS_NAME,
      version: SJS_VERSION,
      build: SJS_BUILD,
    }
  }

  /**
   * The main function
   */
  init(params, cb) {
    cb = cb || _.noop
    window.sjs = new StrikeJS(params)

    Bootstrap.loadDependencies(err => {
      if (err) {
        Util.logError('strike.js dependency error:', err)
        Util.showError('There was an error loading strikejs')
        return cb(err)
      }

      return config
        .init(params)
        .then(() => {
          Util.logInfo('strike.js loaded')
          Util.stopLoading()
          return cb()
        })
        .catch(err => {
          Util.logError('strike.js init error', err)
          Util.showError('There was an error loading strikejs')
          return cb(err)
        })
    })
  }

  /**
   * The generateInvoice function
   */
  generateInvoice(params, cb) {
    cb = cb || _.noop
    window.sjs = new StrikeJS(params)

    Bootstrap.loadDependencies(err => {
      if (err) {
        Util.logError('strike.js dependency error:', err)
        Util.showError('There was an error loading strikejs')
        return cb(err)
      }

      return config
        .generateInvoice(params)
        .then(() => {
          Util.logInfo('strike.js loaded')
          Util.stopLoading()
          return cb()
        })
        .catch(err => {
          Util.logError('strike.js init error', err)
          Util.showError('There was an error loading strikejs')
          return cb(err)
        })
    })
  }

}
