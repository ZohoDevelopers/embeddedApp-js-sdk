Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});
Handlebars.registerHelper('log', function(context) {
    console.log(context);
});

$(document).ready(function(){
	ZOHO.embeddedApp.on("PageLoad",function(data){
		console.log("pageLoadData");
		console.log(data);
		ZOHO.CRM.UI.Resize({height:"300",width:"1000"})	
		var pageLoadData = data;
		ZOHO.CRM.META.getModules().then(function(data)
		{
			var templateData={};
			// Filter out unsupported modules
			templateData.recordModules = data.modules.filter(function(obj){
				return obj.api_supported;
			})

			templateData.webTabs = data.modules.filter(function(obj){
				return obj.generated_type === "widget" ;
			})

			var template = $("#moduleSelection").html();
	    	var compiledtempalte = Handlebars.compile(template);
	    	var templateWithData = compiledtempalte(templateData);
	    	$("#moduleSelectionDiv").html(templateWithData);
	    	$(".loader").hide();
	    	setTimeout(function()
	    	{
	    		// set page load data to dom
	    		$("#pageLoadData").html("Page Load Data : " + JSON.stringify(pageLoadData));
	    		$("#currentModule").change();	
	    		$("#webTabSelection").change();	
	    	},1000);
		});
	});
	ZOHO.embeddedApp.on("HistoryPopState",function(data){
		console.log("HistoryPopState Data");
		console.log( JSON.parse(JSON.stringify(data)) );
	});
	ZOHO.embeddedApp.init()
});




const TestCases ={
		
};

function isOpenInNewTab()
{
	return $("#openInNewTab").prop('checked');
}
function getCurrentModule()
{
	return $("#currentModule").val();
}
function fetchAllRecords(selectTag)
{
	var module = $(selectTag).val();
	ZOHO.CRM.API.getAllRecords({Entity:module})
	.then(function(response)
	{

		if(response.status == 204){
			$("#RecordData").html("<br><h1>No Records Found</h1><br>");
			return;
		}
	   	var template = $("#listview").html();
    	var compiledtempalte = Handlebars.compile(template);
    	var templateWithData = compiledtempalte(response.data);
    	$("#RecordData").html(templateWithData);
	})
}
function webTabSelect(selectTag)
{
	var module = $(selectTag).val();
	$("#currentWebTab").val(module);
}


TestCases.clearFile = function(inputTag)
{
	 $(inputTag).val("");
};

TestCases.attachFile = function(inputTag,recordID)
{
	debugger;
	var filesToLoad  = inputTag.files;
	if(filesToLoad)
	{
		var module = getCurrentModule();
		var file = filesToLoad[0];
		ZOHO.CRM.API.attachFile({Entity:module,RecordID:recordID,File:{Name:file.name,Content:file}})
		.then(function(data){
				alert("File Uploaded Succesfully");
		});
	}
};
TestCases.downloadAttachment = function(recordID)
{
	var module = getCurrentModule();
	ZOHO.CRM.API.getRelatedRecords({Entity:module,RecordID:recordID,RelatedList:"Attachments"})
	.then(function(response)
	{
		if(response && response.data && response.data instanceof Array)
		{
			var fileSpec = response.data[0];
			var fileID = fileSpec['$file_id'];
			var file_Name = fileSpec['File_Name'];

			ZOHO.CRM.API.getFile({id:fileID})
			.then(function(data)
			{
				var a = document.createElement("a");
				url = window.URL.createObjectURL(data); a.href = url; a.download = file_Name; a.click(); window.URL.revokeObjectURL(url);
			});
		}
		else{
			alert("No Attachment Available");
		}
	});

};

TestCases.newRecord = function()
{
	var module = getCurrentModule();
	var config = {Entity:module};
	if(isOpenInNewTab())
	{
		config["Target"] = "_blank";
	}

	ZOHO.CRM.UI.Record.create(config)
	.then(function(data){
	    console.log(data)
	})
};

TestCases.openWidget = function()
{
	var message = $("#openWidgetData").val().trim();
	var moduleName = $("#currentWebTab").val();
	ZOHO.CRM.UI.WebTab.open({Entity:moduleName,Message:message})
}


TestCases.openRecord = function(recordID)
{
	var module = getCurrentModule();
	var config = {Entity:module,RecordID:recordID};
	if(isOpenInNewTab())
	{
		config["Target"] = "_blank";
	}

	ZOHO.CRM.UI.Record.open(config)
	.then(function(data){
	    console.log(data)
	})
};

TestCases.editRecord = function(recordID)
{
	var module = getCurrentModule();
	var config = {Entity:module,RecordID:recordID};
	if(isOpenInNewTab())
	{
		config["Target"] = "_blank";
	}

	ZOHO.CRM.UI.Record.edit(config)
	.then(function(data){
	    console.log(data)
	})
};

TestCases.sendMail = function(Module,id,from_name,to_name,email,currentRow)
{
	ZOHO.CRM.META.EMAIL.getAvailableFromAliases()
	.then(function(data){
		var config = {
		    "Entity": Module,
		    "RecordID": id,
		    "APIData":{
		        "data": [{
		            "from":{"user_name": from_name,"email": data.from_address_details[0].email},
		            "to": [{"user_name": to_name,"email": email}],
		            "subject": "test",
		            "content": "Hi "+ to_name + "\n\nWelcome to ProfessionalCoaching..\n\nThanks,\n" + from_name,
		            "mail_format": "text",
		            "paper_type": "USLetter",
		            "view_type": "portrait",
		            "org_email": false
		        }]
		    }
		}
		ZOHO.CRM.API.sendMail(config)
		.then(function(data){
			 $(currentRow).siblings("p").text(data.data[0].message)
		})
	})
};