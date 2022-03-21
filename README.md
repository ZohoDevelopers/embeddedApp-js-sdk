CDN URL
---
	https://live.zwidgets.com/js-sdk/1.2/ZohoEmbededAppSDK.min.js

To register Listeners with EmbededApp
--

	ZOHO.embeddedApp.on("DialerActive",function(){
		console.log("Dialer Activated");
	});
	
	ZOHO.embeddedApp.on("Dial",function(data){
		console.log("Number Dialed");
	});
	
	ZOHO.embeddedApp.on("PageLoad",function(data){
		console.log(data);
	});

	ZOHO.embeddedApp.on("Notify", function (data) {
		console.log("Client Script flyout notification", data);
	});

	ZOHO.embeddedApp.on("NotifyAndWait", function (data) {
		console.log("Client Script synchronous flyout notification", data);
		ZDK.Client.sendResponse(data.id, { choice: 'mail', value: 'example@zoho.com' });
	});

	// Prints
	-----------------------------
	RelatedList
	-----------------------------
	{
	  "Entity": "Leads",
	  "EntityId": "3000000032096"
	}
	-----------------------------
	Buttons
	-----------------------------
	{
	  "EntityId": [
	    "3000000040011",
	    "3000000032101",
	    "3000000032096",
	    "3000000032091",
	    "3000000032009"
	  ],
	  "Entity": "Leads",
	  "ButtonPosition": "ListView"
	}
	
Description
--
	DialerActive 	- Triggered everytime softphone window is toggled
	Dial 			- Triggered when Call icon inside ZohoCRM is clicked
	PageLoad 		- Triggered When ever an entity Page (Detail page) is loaded

Example
--
	/*
	 * Subscribe to the EmbeddedApp onPageLoad event before initializing 
	 */
	 
	ZOHO.embeddedApp.on("PageLoad",function(data)
	{
		console.log(data);
		//Custom Bussiness logic goes here
	})

	/*
	 * initializing the widget.
	 */
	ZOHO.embeddedApp.init();
