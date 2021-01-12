import _ from 'lodash'

export class Dom {

  /**
   * Set amount listener
   */
  static setAmountListener() {

  }


  /**
   * Get an element
   */
  static getElement(element) {
    return $("[data-strikejs=" + element + "]")
  }

  /**
   * Get length of an element
   */
  static getElementLength(element) {
    return $("[data-strikejs=" + element + "]").length
  }

  /**
   * Get element value
   */
  static getElementValue(element) {
    const elementType = element.attr('type')

    if (elementType === 'radio') {
      element.selector = element.filter(':checked')
      let elementValue = $(element.selector).val()

      if (typeof elementValue === 'undefined') {
        elementValue = ''
      }
      return elementValue
    }

    if (elementType === 'checkbox') {
      if ($(element).is(':checked')) {
        return 'Yes'
      }
      return 'No'
    }

    return element.val()
  }

  /**
   * Get element value
   */
  static generateQrCode(params) {
    $("#submitButton,#amountBox").hide();

    const QRCodeOptions = {
      width: 227,
      height: 227,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    }

    if (params.lnInvoice) {
      const lnOptions = _.assign(QRCodeOptions, {text: `lightning:${params.lnInvoice}`});
      var lnQrcode = new QRCode(document.getElementById("lnQrcode"), lnOptions);
    }

    if (params.onchainAddress) {
      const btcOptions = _.assign(QRCodeOptions, {text: `bitcoin:${params.onchainAddress}?amount=${params.size}`});
      var btcQrcode = new QRCode(document.getElementById("onChainQrcode"), btcOptions);
    }

    return params.quoteId
  }
}
