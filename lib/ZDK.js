//$Id$
//	eslint-disable-next-line webperf/no-global-variables, zohocrm/no-unused-vars
/**
 * @module ZDK
 */
const ZDK = {
  /**
   * @namespace ZDK.Client
   */
	Client : (function() {
		var zdksdk = self._zdksdk;
		function _newRequestPromise(data) {
			return zdksdk.getContext().Event.Trigger('ZDK_EVENT', data, true); // no i18n
		}
		return {
      /**
      * @summary Send response to Client Script
      * @memberof ZDK.Client
      * @function
      * @param {String} request_uuid - unique id received in 'notify_and_wait' event of the widget
      * @param {Any} [data] - response to be passed
      * @example <caption>Sample</caption>
      * ZDK.Client.sendResponse('0deec96f-2d55-4349-ace9-d45499fd004c', { choice: 'mail', value: 'example@zoho.com' });
      */
			sendResponse: function (request_uuid, data) {
				return _newRequestPromise({
					action: 'notify_response', // No i18n
					message: { data, uuid: request_uuid }
				});
			},

      /**
      * @summary Close Widget rendered from Client Script
      * @memberof ZDK.Client
      * @function
      * @param {Any} [response] - response to be passed into the client script
      * @example <caption>Sample</caption>
      * ZDK.Client.closeSelf({ choice: 'mail', value: 'example@zoho.com' });
      */
			closeSelf : function (response) {
				return _newRequestPromise({
					action: 'close_widget', // No i18n
					response
				});
			}
		}
	})(self)
};
