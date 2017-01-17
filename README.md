JS SDK lib
---
	https://github.com/ZohoDevelopers/embeddedApp-js-sdk/releases
To register Listeners with EmbededApp
--
	ZOHO.embededApp.init({
		events:{
			DialerActive:<function>,
			Dial:<function>,
			PageLoad:<function>
		},
	});

Description
--
	DialerActive 	- Triggered everytime softphone window is toggled
	Dial 			- Triggered when Call icon inside ZohoCRM is clicked
	PageLoad 		- Triggered When ever an entity Page (Detail page) is loaded

Example
--
	ZOHO.embededApp.init({
		events:{
			DialerActive:function(){
				alert("Telephony Dialer Activated");
			},
			Dial:function(data){
				alert("Call initiated from CRM");
			},
			PageLoad:function(data){
				alert("Entity Detail Page Loaded");
			},
		},
	});