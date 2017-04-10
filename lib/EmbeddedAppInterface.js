var ZOHO={};
ZOHO.embededApp=(function(){
	var config={
			ID:undefined,
			AllowedOrigins : new RegExp("^https?:\/\/[a-zA-Z0-9-_]*.(csez.zohocorpin.com|zoho.com|zohoplatform.com|zohosandbox.com)(:[0-9]{0,4})?$"),
			TargetOrigin:undefined
	};
	var callBackMap={};
	var initPromise = undefined;
	function isValidObject(obj)
	{
		if(obj && "object" === typeof(obj))
		{
			return true;
		}
		return false;
	}
	function generateCallBackID()
	{
		var randomRange = Math.random().toString(36).substr(2, 16);
		return randomRange;
	}
	return{
		events : {
			
		},
		on : function(event, fn ){
			/*
			 * Create list of functions subscribed to an event
			 * Trigger all subscribers whenever an event is fired
			 */
			if(!this.events[event]){
				this.events[event] = new Array();
			}
			this.events[event].push(fn);
		},
		init	:	function()
		{
			var promiseResolve;
			var promiseReject;
			var promise = new Promise(function(resolve, reject){
				
				promiseResolve = resolve;
				promiseReject = reject;
			});
			
			this.initPromise = {
					resolve : promiseResolve,
					reject : promiseReject
			}
			return promise;
		},
		isAllowedOrigin : function(origin)
		{
			if(!config.AllowedOrigins.test(origin))
			{
				console.error("Ignoring Message from:"+origin+" with Data:"+event.data);
				return false;
			}
			return true;
		},
		handlePostMessage	:	function(data)
		{
			if(data)
			{
				if("WIDGET.CONFIG"===data.type)
				{
					config.ID = data.config.WidgetID;
					config.TargetOrigin = data.config.TargetOrigin
					/*
					 * Trigger onReady function
					 */
					if(this.initPromise && this.initPromise.resolve){
						this.initPromise.resolve();
					}
				}
				else
				{
					this.handleMsg(data);
				}
			}
		},
		handleMsg	:	function(message)
		{
			var eventName = message.Event;
			var widgetData = message.wd;

			if('WIDGET.EVENT' === message.type)
			{
				var fns = ZOHO.embededApp.events[eventName];
				if("object"=== typeof(fns))
				{
					fns.forEach(function(fn){
						if("function" === typeof(fn))
						{
						    setTimeout(function(){
						    	fn(widgetData);
						    	console.log(new Date());
						    }, 0);
						}
					})
				}
			}
			else if('WIDGET.CALL_BACK' === message.type)
			{
				var callBackID = message.callBackID;
				var callBackObj = callBackMap[callBackID];
				
				var promise = callBackObj.promise;
				promise(widgetData);
			}
			else if ('WIDGET.CALL_BACK.EXCEPTION' === message.type)
			{
				var callBackID = message.callBackID;
				var callBackObj = callBackMap[callBackID];
				
				var reject = callBackObj.reject;
				reject(widgetData);
			}
		},
		request : function(data)
		{
			var callBackID = generateCallBackID();
			var message = 
					{
						"MESSAGE.FROM":"EMBEDDED_APP",//no i18n
						WidgetID:config.ID,
						CallBackID:callBackID,
						Data:data
					};
			window.parent.postMessage(message,config.TargetOrigin)
			
			var promiseResolve;
			var promiseReject;
			var promise = new Promise(function(resolve,reject)
			{
				promiseResolve = resolve;
				promiseReject = reject;
			});	
			callBackMap[callBackID] = {
					promise	: promiseResolve,	
					reject : promiseReject
			}
			return promise;
		}
	};
})();


/*
 * AddEvent Message event listener
 */
window.addEventListener("message", function receiveMessage(event)
{
	if(event)
	{
		/*
		 * obtain origin of the post message and validate
		 */
		var origin = event.origin || event.originalEvent.origin;
		if(!ZOHO.embededApp.isAllowedOrigin(origin)){
			return;
		}
		/*
		 * Verify if message is for EmbeddedApp
		 */
		var data = event.data;
		if( "object" === typeof(data) && data["MESSAGE.TO"] === "EMBEDDED_APP")
		{
			var message = data["MESSAGE.CONTENT"];
			ZOHO.embededApp.handlePostMessage(message);
		}
		
	}
});