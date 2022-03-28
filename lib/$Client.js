/**
 * @namespace $Client
 */
const $Client = (function() {
	var zdksdk = self._zdksdk;
	return {
    /**
      * @description Close Widget rendered from Client Script
      * @memberof $Client
      * @function
      * @param {Any} [response] - response to be passed into the client script
      * @example <caption>Sample</caption>
      * $Client.close({ choice: 'mail', value: 'example@zoho.com' });
      */
		close: function (response) {
			return zdksdk.getContext().Event.Trigger('ZDK_EVENT', {
				action: 'close_widget', // No i18n
				response
			}, true);
		}
	}
})(self);