To register Listeners with sdk
--
	TelephonyInit - Triggered everytime softphone window is toggled

	TelephonyCall - Triggered when Call icon inside ZohoCRM is clicked

	EntityPageLoad - Triggered When ever an entity Page (Detail page) is loaded

--
	ZOHO.embededApp.init({
		events:{
			TelephonyInit:Handler.widgetInit,
			TelephonyCall:Handler.initiateCall,
			EntityPageLoad:Handler.entityPageLoad
		},
	});
Sample Implementations
---
Get Record
---

```
ZOHO.CRM.getRecord({
		Entity : "Leads",
		RecordID : "1000000033001"
	})
	.then(function(data)
	{
		console.log(data);
	});
```

---
Get Page information
---

```
ZOHO.CRM.getPageInfo()
	.then(function(data)
	{
		console.log(data);
	});
```

---
AddNotes
---

```
ZOHO.CRM.addNotes({	
		Entity : "Leads", 
		RecordID : "1000000033001",
		Title : "Notes Title",
		Content : "Notes Content",
	})
	.then(function(data)
	{
		console.log(data);
	});
```
