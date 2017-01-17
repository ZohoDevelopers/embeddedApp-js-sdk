var ZOHO={
}
ZOHO.embededApp=(function(){
	var config={
			id:undefined,
			target:"https://crmplugins.zoho.com"
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
			if(config.target != origin)
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
				console.info("TelephonyInit:"+JSON.stringify(widgetData));//no i18n
			},
			Dial : function(widgetData)
			{
				console.info("TelephonyCall : "+JSON.stringify(widgetData));//no i18n
			},
			PageLoad : function(widgetData)
			{
				console.info("EntityPageLoad : "+JSON.stringify(widgetData));//no i18n
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
						WidgetID:config.id,
						CallBackID:callBackID,
						Data:data
					};
			window.parent.postMessage(message,config.target)
			
			var promiseResolve;
			var promise = new Promise(function(resolve,reject)
			{
				promiseResolve = resolve;
			});	
			callBackMap[callBackID] = {
					promise	: promiseResolve	
			}
			return promise;
		},
		handleEvent	:	function(event)
		{
			if("Config"==event.data.type)
			{
				config.id = event.data.config.widgetID;
			}
			else
			{
				this.handleMsg(event.data);
			}
		},
		handleMsg	:	function(message)
		{
			var eventName = message.Event;
			var widgetData = message.wd;

			if('Event' === message.type)
			{
				var fn = ZOHO.embededApp.events[eventName];
				if("function"=== typeof(fn))
				{
					fn(widgetData);
				}
			}
			else if('CustomEvent' === message.type)
			{
				var fn = ZOHO.embededApp.customEvents[eventName];
				if("function"=== typeof(fn))
				{
					fn(widgetData);
				}
			}
			else if('CallBack' === message.type)
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
window.addEventListener("message", function receiveMessage(event){
	/*
	 * obtain origin of the post message and validate
	 */ 
	var origin = event.origin || event.originalEvent.origin;
	if(!ZOHO.embededApp.isAllowedOrigin(origin)){
		return;
	}
	if(event && "object" === typeof(event.data))
	{
		ZOHO.embededApp.handleEvent(event);
	}
});