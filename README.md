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
