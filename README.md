LICENSE
---
	Copyright (c) 2022, ZOHO CORPORATION PRIVATE LIMITED
	All rights reserved.

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.

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
	DialerActive	- Triggered everytime softphone window is toggled
	Dial 			- Triggered when Call icon inside ZohoCRM is clicked
	PageLoad 		- Triggered When ever an entity Page (Detail page) is loaded
	HistoryPopState	- Triggered when browser back is invoked in WebTab Widget with custom widget params

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

	ZOHO.embeddedApp.on("HistoryPopState",function(data){
    	console.log(data);

		// Custom business logic code goes here.
	})

	/*
	 * initializing the widget.
	 */
	ZOHO.embeddedApp.init();
