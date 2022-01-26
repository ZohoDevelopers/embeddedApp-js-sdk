JS SDK lib
---
	https://github.com/ZohoDevelopers/embeddedApp-js-sdk/releases
### Latest Docs
---
	https://help.zwidgets.com/help/latest/index.html
To register Listeners with EmbededApp
--

	ZOHO.embeddedApp.on("DialerActive",function(){
			console.log("Dialer Activated");
	})
	
	ZOHO.embeddedApp.on("Dial",function(data){
			console.log("Number Dialed");
	})
	
	ZOHO.embeddedApp.on("PageLoad",function(data){
			console.log(data);
	})
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
