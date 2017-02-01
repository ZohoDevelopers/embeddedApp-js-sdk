var ZOHO={};
ZOHO.embededApp=(function(){
	var config={
			ID:undefined,
			AllowedOrigins : new RegExp("^https?:\/\/[a-zA-Z0-9-_]*.(csez.zohocorpin.com|zoho.com|zohoplatform.com|zohosandbox.com)(:[0-9]{0,4})?$"),
			TargetOrigin:undefined
	};
	this.callBackMap={};
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
		isAllowedOrigin : function(origin){
			if(!config.AllowedOrigins.test(origin))
			{
				console.error("Ignoring Message from:"+origin+" with Data:"+event.data);
				return false;
			}
			return true;
		},
		events: 
		{
			/*
			 * Sample Implementations
			 */
			DialerActive : function(widgetData)
			{
				console.info("DialerActive:"+JSON.stringify(widgetData));//no i18n
			},
			Dial : function(widgetData)
			{
				console.info("Dial : "+JSON.stringify(widgetData));//no i18n
			},
			onPageLoad : function(widgetData)
			{
				console.info("onPageLoad : "+JSON.stringify(widgetData));//no i18n
			}
		},
		customEvents:
		{
			
		},
		init	:	function(config)
		{
			/*
			 * validate config object and process
			 */
			if(isValidObject(config))
			{
				/*
				 * Bind default event 
				 */
				var config_events = config.events;
				if(isValidObject(config_events))
				{
					for(temp in config_events)
					{
						if(this.events[temp])
						{
							this.events[temp] = config_events[temp];
						}
					}
				}
				/*
				 * Bind custom event and respective functions to handler  
				 */
				var config_customEvents = config.customEvents;
				if(isValidObject(config_customEvents))
				{
					for(temp in config_customEvents)
					{
						this.customEvent[temp] = config_customEvents[temp];
					}
				}
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
		},
		handlePostMessage	:	function(data)
		{
			if(data)
			{
				if("WIDGET.CONFIG"===data.type)
				{
					config.ID = data.config.WidgetID;
					config.TargetOrigin = data.config.TargetOrigin
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
				var fn = ZOHO.embededApp.events[eventName];
				if("function"=== typeof(fn))
				{
					fn(widgetData);
				}
			}
			else if('WIDGET.CUSTOM_EVENT' === message.type)
			{
				var fn = ZOHO.embededApp.customEvents[eventName];
				if("function"=== typeof(fn))
				{
					fn(widgetData);
				}
			}
			else if('WIDGET.CALL_BACK' === message.type)
			{
				var callBackID = message.callBackID;
				var callBackObj = callBackMap[callBackID];
				
				var promise = callBackObj.promise;
				promise(widgetData);
			}
		},
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