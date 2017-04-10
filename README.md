JS SDK lib
---
	https://github.com/ZohoDevelopers/embeddedApp-js-sdk/releases
To register Listeners with EmbededApp
--

	ZOHO.embeddedApp.on("DialerActive",function(){
			console.log("Dialer Activated");
	})
	ZOHO.embeddedApp.on("Dial",function(){
			console.log("Number Dialed");
	})
	ZOHO.embeddedApp.on("PageLoad",function(){
			console.log("Page Loaded");
	})
	
Description
--
	DialerActive 	- Triggered everytime softphone window is toggled
	Dial 			- Triggered when Call icon inside ZohoCRM is clicked
	PageLoad 		- Triggered When ever an entity Page (Detail page) is loaded

Example
--
	ZOHO.embeddedApp.init()
	.then(function(){
			return ZOHO.CRM.CONFIG.getCurrentUser()
	})
	.then(function(data){
		console.log(data);
	})