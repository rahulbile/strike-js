'use strict'

import { Util } from './util'
import log from 'loglevel'

export class StrikeJS {
  /**
   * StrikeJS main initialization
   * @param config
   * @returns {Promise}
   */
  constructor(config) {
    if (typeof config.debug !== 'undefined' && config.debug) {
      log.setLevel('debug')
    } else {
      log.setLevel('info')
    }

    Util.logDebug('StrikeJS init', config)
    Util.createErrorOverlay()
    Util.startLoading()
  }
}
