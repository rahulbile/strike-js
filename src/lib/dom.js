import _ from 'lodash'
import { payment } from './payment'
import { Util } from './util'

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
    $("#paymentInfo, #QrSlider, #paymentRequestInvoiceCopy").show();
    $("#strikeInvoice").html('60');

    if (params.lnInvoice) {
      const lnOptions = _.assign(QRCodeOptions, {text: `lightning:${params.lnInvoice}`});
      var lnQrcode = new QRCode(document.getElementById("lnQrcode"), lnOptions);
      $("#lnQrcodeAmount").text('$' + params.priceUsd);
    }

    if (params.onchainAddress) {
      const btcOptions = _.assign(QRCodeOptions, {text: `bitcoin:${params.onchainAddress}?amount=${params.size}`});
      var btcQrcode = new QRCode(document.getElementById("onChainQrcode"), btcOptions);
      $("#onChainQrcodeAmount").text(params.size + ' BTC');
      $('.QrCodesSlider').unslider({
        keys: true,
        dots: true,
        arrows: false,
      });
    }

    // #TODO : Move to custom function
    let lnInvoice = document.getElementById('lnQrcode').title
    $("#paymentRequestInvoiceCopy").attr('data-clipboard-text',lnInvoice);
    $(document).on("click", 'li[data-slide="0"]', function() {
      $('#paymentRequestInvoiceCopy').html('Copy');
      $("#paymentRequestInvoiceCopy").attr('data-clipboard-text',lnInvoice);
    });
    if (params.onchainAddress) {
      $(document).on("click", 'li[data-slide="1"]', function() {
        $('#paymentRequestInvoiceCopy').html('Copy');
        let chainInvoice = document.getElementById('onChainQrcode').title
        $("#paymentRequestInvoiceCopy").attr('data-clipboard-text',chainInvoice);
      });
    }

    // bind the clipboard copy element
    // #TODO : Move to custom function
    var clipboard = new ClipboardJS('#paymentRequestInvoiceCopy');
    clipboard.on('success', function(e) {
      $('#paymentRequestInvoiceCopy').html('<svg height="15" viewBox="0 0 15 11" width="15"><path d="M14 1L7.178 9.354c-.584.715-1.69.858-2.47.32a1.498 1.498 0 01-.186-.148L1 6.292" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>');
      setTimeout(function(){
          $('#paymentRequestInvoiceCopy').html('Copy');
      }, 5000);
      e.clearSelection();
    });

    // bind the refresh element
    // #TODO : Move to custom function
    $(document).on("click", '#paymentRequestRefresh', function() {
      $("#lnQrcode, #onChainQrcode, .unslider-nav, #QrCodeLoader").html('')
       lnQrcode.clear();
       btcQrcode.clear();
       $("#QrSlider").removeClass('qrCodeExpired')
       $("#paymentRequestRefresh").hide();
       payment.process();
    });
    return params.quoteId
  }

  /**
   * Redirect the user to requested page
   */
  static navigateTo(page) {
    Util.logDebug(`Dom.navigateTo: ${page}`)
    window.location.assign(page)
  }
}
