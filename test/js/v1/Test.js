function testCompleted(done){
	$("#TestStatus").text("Test Completed");
	done();
}
var TestSpec={
	recordID:undefined,
	userID:undefined,
	customViewID:undefined,
	layoutID:undefined,
	relatedID:undefined,
	onLoadData:undefined,
	profileId:undefined,
	roleID:undefined,
	approvalID:undefined,
	blueprintId:undefined,
	campaignId:undefined,
	relationID:undefined,
	uploadFileID:undefined,
	emailID:undefined,
	currentUser:undefined,
	recordData : {
	        "Company": "Zylker",
	        "Last_Name": "Peterson",	
	        "Annual_Revenue":"500",
	        "Description":"Populating test data",
	        "Phone":"85663655785",
	        "Email":"anandkumar.j@zohocorp.com"
	  },
	upsertData : {
		"Company": "Zylker1",
        "Last_Name": "Peterson1",	
        "Annual_Revenue":"5000",
        "Description":"Populating test datas",
        "Phone":"856636557852",
        "Website" : "https://www.google.com"
	},
	mailData : {
		"from":{"user_name": "jak","email": undefined},
		"to": [{"user_name": "User","email": undefined}],
        "subject": "test",
        "content": "Hi User,\n\nWelcome to Platform Testing..\n\nThanks,\njak",
        "mail_format": "text",
        "paper_type": "USLetter",
        "view_type": "portrait",
        "org_email": false
	},
	voiceURL:"https://testurl.com/calls/1772649/recording/Aas354465.mp3",
	orgVariable1:{key:"mob",value:"mobileappvar"},
	orgVariable2:{key:"plat",value:"Platform"},
	multipleOrgVariable : {apiKeys:["mob","plat"]},
	url: "http://mockbin.org/bin/9b6c1e8a-ebf8-4fc8-a729-46175eb2c05c",
	getUrl: "https://httpbin.org/get",
	postUrl: "https://httpbin.org/post",
	putUrl :"https://httpbin.org/put",
	patchUrl:"https://httpbin.org/patch",
	deleteUrl:"https://httpbin.org/delete",
	connector:"unittest0.unittest.getfiles",
	fileId : "0B-EvY2Wt1MdxM1NxQjRxcG9GbXc",
	connectorFile : "unittest0.unittest.getfile",
	connectorWithDynamic : "zohocrm1578309953411.getbyid",
	connectorWithoutDynamic : "zohocrm1578309953411.get",
	company : "company",
	lastname : "lastname"
};
const TestCases ={
		
};
TestCases.getCurrentUser = function(callBack){
	ZOHO.CRM.CONFIG.getCurrentUser().then(function(data){
		if(data)
		{
			TestSpec.currentUser = data.users[0].email;
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.getMultipleRecord = function(module,recordIDs,callBack)
{
		ZOHO.CRM.API.getRecord({Entity:module,RecordID:recordIDs})
			.then(function(response)
			{
				if(response && typeof(response) === 'object' && response.data instanceof Array  && response.info instanceof Object && response.data.length === recordIDs.length)
				{
					callBack(true);
				}
				else
				{
					callBack(false);
				}
			})
};


TestCases.getAllRecord = function(callBack)
{
		ZOHO.CRM.API.getAllRecords({Entity:"Leads"})
			.then(function(data){
				if(data && typeof(data) === 'object' && data.data instanceof Array  && data.info instanceof Object)
				{
					callBack(true);
				}
				else
				{
					callBack(false);
				}
			})
};
TestCases.insertRecord=function(module,recordData,callBack)
{
			ZOHO.CRM.API.insertRecord({Entity:module,APIData:recordData})
			.then(function(data){
				if(data && typeof(data) === 'object' && data.data && data.data instanceof Array && data.data.length > 0 && data.data[0].code==='SUCCESS'){
					var recordData = data.data[0];
					leadID = recordData.details.id;
					callBack(true,leadID);
				}
				else
				{
					callBack(false);
				}
			})
};
TestCases.addNotes = function(module,recordID,callBack)
{
	ZOHO.CRM.API.addNotes({Entity:module,RecordID:recordID,Title:"Notes Title",Content:"TitleContent"}).then(function(data){
		if(data && typeof(data) === 'object' && data.data instanceof Array )
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.attachFile = function(module,recordID,blob,callBack)
{
	ZOHO.CRM.API.attachFile({Entity:module,RecordID:recordID,File:{Name:"myFile.txt",Content:blob}})
	.then(function(data){
		if(data && typeof(data) === 'object' && data.data instanceof Array )
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.insertCampaigns = function(module,recordData,callBack)
{
	ZOHO.CRM.API.insertRecord({Entity:module,APIData:recordData})
	.then(function(data){
		if(data && typeof(data) === 'object' && data.data instanceof Array )
		{
			TestSpec.campaignId = data.data[0].details.id;
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.updateRecord = function(module,recordID,recordData,callBack)
{
	 recordData.id = recordID;
	 recordData.Company = "JAK";
	 ZOHO.CRM.API.updateRecord({Entity:module,APIData:recordData})
	 .then(function(data){
		 if(data && typeof(data) === 'object' && data.data instanceof Array )
			{
				TestSpec.relationID = data.data[0].details.id;
				callBack(true);
			}
			else
			{
				callBack(false);
			}
	 })
}
TestCases.updateVoiceURL = function(recordID,voiceURL,callBack)
{
	 ZOHO.CRM.API.updateVoiceURL({RecordID:module,VoiceURL:voiceURL})
	 .then(function(data){
		 if(data && typeof(data) === 'object' && data.code==='SUCCESS')
			{
				callBack(true);
			}
			else
			{
				callBack(false);
			}
	 })
}
TestCases.updateRelatedRecords = function(module,recordID,relatedlistName,relatedRecordID,apidata,callBack)
{
	 ZOHO.CRM.API.updateRelatedRecords({Entity:module,RecordID:recordID,RelatedList:relatedlistName,RelatedRecordID:relatedRecordID,APIData:apidata})
	 .then(function(data){
		 if(data && typeof(data) === 'object' && data.data instanceof Array )
			{
				TestSpec.relationID = data.data[0].details.id;
				callBack(true);
			}
			else
			{
				callBack(false);
			}
	 })
}
TestCases.delinkRelatedRecord = function(module,recordID,relatedlistName,relatedRecordID,callBack)
{
	ZOHO.CRM.API.delinkRelatedRecord({Entity:module,RecordID:recordID,RelatedList:relatedlistName,RelatedRecordID:relatedRecordID})
	.then(function(data){
		if(data && typeof(data) === 'object' && data.data instanceof Array )
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	})
}
TestCases.getRelatedRecords = function(module,recordID,relatedlistName,callBack)
{
	ZOHO.CRM.API.getRelatedRecords({Entity:module,RecordID:recordID,RelatedList:relatedlistName})
	.then(function(data){
		if(data && typeof(data) === 'object' && data.data instanceof Array )
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	})
}
TestCases.getBlueprint = function(module,recordID,callBack)
{
	ZOHO.CRM.API.getBluePrint({Entity:module,RecordID:recordID}).
	then(function(data){
		 if(data && typeof(data) === 'object' && data.blueprint)
		 {
			if(data.blueprint.transitions && data.blueprint.transitions instanceof Array)
			{
				if(data.blueprint.transitions.length >0)
				{
					TestSpec.blueprintId = data.blueprint.transitions[0].id;
				}
			}
			 callBack(true)
		 }
		 else
		 {
			 callBack(false);
		 }
	});
}
TestCases.updateBluePrint = function(module,recordID,bluePrintData,callBack)
{
	ZOHO.CRM.API.updateBluePrint({Entity:module,RecordID:recordID,BlueprintData:bluePrintData})
	.then(function(data){
		if(data && typeof(data) === 'object' && data.code==="SUCCESS")
		 {
			callBack(true)
		 }
		else
		{
			callBack(false)
		}
	});
	
}
TestCases.uploadFile = function(config,callBack)
{
	ZOHO.CRM.API.uploadFile(config)
	.then(function(data) {
		if(data && typeof(data) === 'object' && data.data instanceof Array)
		{
			if(data.data[0] && data.data[0].details.id)
			{
				TestSpec.uploadFileID = data.data[0].details.id;
			}
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	})
}
TestCases.upsertRecordWithoutDuplicate = function(module,upsertData,callBack)
{
	ZOHO.CRM.API.upsertRecord({Entity:module,APIData:upsertData})
	.then(function(data){
		if(data && typeof(data) === 'object' && data.data instanceof Array && data.data[0].action === "insert")
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.upsertWithDuplicateField = function(module,upsertData,callBack)
{
	ZOHO.CRM.API.upsertRecord({Entity:module,APIData:upsertData,duplicate_check_fields : ["Website"]})
	.then(function(data){
		if(data && typeof(data) === 'object' && data.data instanceof Array && data.data[0].action === "update")
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.getAllActions = function(module,recordID,callBack)
{
	ZOHO.CRM.API.getAllActions({Entity:module,RecordID:recordID})
	.then(function(data){
		if(data && typeof(data) === 'object' && data.actions instanceof Array )
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	})
}
TestCases.getApprovalRecords = function(callBack)
{
	ZOHO.CRM.API.getApprovalRecords()
	.then(function(data){
		if(data && typeof(data) === 'object' && data.data instanceof Array )
		{
			TestSpec.approvalID = data.data[0].id;
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	})
}
TestCases.getApprovalRecordById = function(approvalID,callBack)
{
	ZOHO.CRM.API.getApprovalById({id:approvalID})
	.then(function(data){
		if(data && typeof(data) === 'object' && data.data instanceof Array )
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	})
}
TestCases.approveRecord = function(module,recordID,actionType,callBack)
{
	ZOHO.CRM.API.approveRecord({Entity:module,RecordID:recordID,actionType:actionType})
	.then(function(data){
		if(data && typeof(data) === 'object' && data.code==="SUCCESS")
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	})
}
TestCases.getApprovalHistory = function(callBack)
{
	ZOHO.CRM.API.getApprovalsHistory()
	.then(function(data){
		if(data && typeof(data) === 'object' && data.data instanceof Array)
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	})
}
TestCases.getFile = function(config,callBack)
{
	ZOHO.CRM.API.getFile(config)
	.then(function(data){
		if(data && typeof(data) === 'object' && data.type==="application/x-download")
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	})
	
}
TestCases.getAllProfiles = function(module,recordID,callBack)
{
	ZOHO.CRM.API.getAllProfiles().then(function(data){
		if(data && typeof(data) === 'object' && data.profiles instanceof Array )
		{
			TestSpec.profileId = data.profiles[0].id;
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.getProfile = function(profileID,callBack)
{
	ZOHO.CRM.API.getProfile({ID:profileID}).then(function(data){
		if(data && typeof(data) === 'object' && data.profiles instanceof Array )
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.getAllRoles = function(callBack)
{
	ZOHO.CRM.API.getAllRoles().then(function(data){
		if(data && typeof(data) === 'object' && data.roles instanceof Array )
		{
			TestSpec.roleID = data.roles[0].id;
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.getRole = function(roleID,callBack)
{
	ZOHO.CRM.API.getRoleById({id:roleID}).then(function(data){
		if(data && typeof(data) === 'object' && data.roles instanceof Array )
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.getAvailableFromAliases = function(callBack)
{
	ZOHO.CRM.META.EMAIL.getAvailableFromAliases().then(function(data){
		if(data && typeof(data) === 'object' && data.from_address_details instanceof Array )
		{
			TestSpec.emailID = data.from_address_details[0].email;
			TestSpec.mailData.from.email=TestSpec.emailID;
			TestSpec.mailData.to[0].email=TestSpec.emailID;
			callBack(true);
		}
		else
		{
			TestSpec.emailID = TestSpec.currentUser;
			TestSpec.mailData.from.email=TestSpec.emailID;
			TestSpec.mailData.to[0].email=TestSpec.emailID;
			callBack(false);
		}
	});	
}
TestCases.sendMail = function(module,recordID,mailData,callBack)
{
	ZOHO.CRM.API.sendMail({Entity:module, RecordID:recordID, APIData:{data:[mailData]}}).then(function(data){
		if(data && typeof(data) === 'object' && data.data && data.data instanceof Array && data.data.length > 0 && data.data[0].code==='SUCCESS')
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});	
}


TestCases.verifyRecord = function(module,recordID,recordData,callBack){
		  if(!recordID){
				callBack(false);
		  }
		  else{
		  	ZOHO.CRM.API.getRecord({Entity:module,RecordID:recordID})
			.then(function(data){
				if(data && data.data && data.data instanceof Array && data.data.length > 0 )
				{
					var recordData = data.data[0];
					for(field in recordData){

						if(recordData[field] == recordData[field]){
							continue
						}
						callBack(false);			
					}
					callBack(true);
				}
				else{
						callBack(false);
				}

			})
		  }
};
TestCases.populate = function(recordData,callBack){ 
  	ZOHO.CRM.UI.Record.populate(recordData).then(function(data){
		if(data){
			callBack(true);
		}
		else{
			callBack(false);
		}
	})
};
TestCases.getRecord = function(module,recordID,callBack){
	  if(!recordID){
			callBack(false);
	  }
	  else{
	  	ZOHO.CRM.API.getRecord({Entity:module,RecordID:recordID})
		.then(function(data){
			if(data && data.data && data.data instanceof Array && data.data.length > 0 )
			{
				callBack(true);
			}
			else{
					callBack(false);
			}
		})
	  }
};
TestCases.validateForm = function(formData,callBack){
			if(formData && formData instanceof Object)
			{
				for(field in TestSpec.recordData)
				{
					if(TestSpec.recordData[field] == formData.Data[field]){
						continue
					}
					callBack( false );			
				}
				callBack( true );
			}
			else{
				callBack( false );
			}
};
TestCases.getUser = function(userID,callBack){
		  if(!userID)
		  {
		  	ZOHO.CRM.API.getAllUsers({Type:"AllUsers"})
				.then(function(data){

					if(data && data instanceof Object && data.users instanceof Array  && data.info instanceof Object && data.users instanceof Array && data.users.length >0){
						var userData = data.users[0];
						callBack(true,userData.id);
				    }
				    else{
				    	callBack(false);
				    }
				});
		  }
		  else
		  {
			ZOHO.CRM.API.getUser({ID:userID})
				.then(function(data){
					if(data && data instanceof Object && data.users instanceof Array  && data.users instanceof Array && data.users.length >0){
						callBack(true);
					}
					else
					{
						callBack(false);
					}
				})
		  }
};
TestCases.getOrgVariable = function(variable,callBack)
{
	ZOHO.CRM.API.getOrgVariable(variable.key).then(function(data){
		if(data && data.Success && data.Success.Content === variable.value)
		{
			callBack(true);
		}
		else
			{
				callBack(false);
			}
	});
}
TestCases.getMultipleOrgvariable = function(multipleorgvariable,callBack)
{
	// ZOHO.CRM.API.getOrgVariable(multipleorgvariable).then(function(data)
	// {
	// 	if(data && data.Success && (Object.keys(data.Success.Content)).length === TestSpec.multipleOrgVariable.apiKeys.length)
	// 	{
	// 		callBack(true);
	// 	}
	// 	else
	// 	{
	// 		callBack(false);
	// 	}
	// });
	ZOHO.CRM.API.getOrgVariable(multipleorgvariable).then(function(data){
		console.log(data);
	});
}
TestCases.checkHttpGetRequest = function(url,callBack){
	var request ={
		url : url
	}
	
	ZOHO.CRM.HTTP.get(request).then(function(responseData)
	{
		var response = JSON.parse(responseData);
		if(response && response.url && response.url === url)
		{
			callBack(true);
		}
		else
		{
			callBack(false)
		}
	});
	
}
TestCases.checkHttpPostRequest = function(url,callBack){
	var request ={
		url : url
	}
	
	ZOHO.CRM.HTTP.post(request).then(function(responseData)
	{
		var response = JSON.parse(responseData);
		if(response && response.url && response.url === url)
		{
			callBack(true);
		}
		else
		{
			callBack(false)
		}
	});
	
}
TestCases.checkHttpPutRequest = function(url,callBack){
	var request ={
		url : url
	}
	
	ZOHO.CRM.HTTP.put(request).then(function(responseData)
	{
		var response = JSON.parse(responseData);
		if(response && response.url && response.url === url)
		{
			callBack(true);
		}
		else
		{
			callBack(false)
		}
	});
	
}
TestCases.checkHttpPatchRequest = function(url,callBack){
	var request ={
		url : url
	}
	
	ZOHO.CRM.HTTP.patch(request).then(function(responseData)
	{
		var response = JSON.parse(responseData);
		if(response && response.url && response.url === url)
		{
			callBack(true);
		}
		else
		{
			callBack(false)
		}
	});
	
}
TestCases.checkHttpDeleteRequest = function(url,callBack){
	var request ={
		url : url
	}
	
	ZOHO.CRM.HTTP.delete(request).then(function(responseData)
	{
		var response = JSON.parse(responseData);
		if(response && response.url && response.url === url)
		{
			callBack(true);
		}
		else
		{
			callBack(false)
		}
	});
	
}
TestCases.getFields = function(module,callBack){
	ZOHO.CRM.META.getFields({Entity:module}).then(function(result){
		if(result)
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.getModules = function(module,callBack){
	ZOHO.CRM.META.getModules({Entity:module}).then(function(result){
		if(result)
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.getAssignmentRules = function(module,callBack){
	ZOHO.CRM.META.getAssignmentRules({Entity:module}).then(function(data){
		if(data)
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.getOrgInfo = function(callBack)
{
	ZOHO.CRM.CONFIG.getOrgInfo().then(function(data){
		if(data)
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.Search = function(module,type,query,callBack){
	ZOHO.CRM.API.searchRecord({Entity:module,Type:type,Query:query})
	.then(function(data){
	    if(data)
	   	{
	   		callBack(true);
	   	}
	   	else
	   	{
	   		callBack(false);
	   	}
	})
}
TestCases.coql = function(module,callBack){
	var config = {
		"select_query": "select Last_Name, First_Name, Full_Name from "+module+" where Last_Name is not null limit 2"
	}
	ZOHO.CRM.API.coql(config).then(function(data){
	    if(data)
	   	{
	   		callBack(true);
	   	}
	   	else
	   	{
	   		callBack(false);
	   	}
	})
}
TestCases.invokeConnectorWithoutDynamic = function(apiname,data,callBack){
	ZOHO.CRM.CONNECTOR.invokeAPI(apiname,{})
	.then(function(data){
		if(data)
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.invokeConnectorwithDynamic = function(apiname,data,callBack){
	ZOHO.CRM.CONNECTOR.invokeAPI(apiname,data)
	.then(function(data){
		if(data)
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.executeFunction = function(callBack){
	ZOHO.CRM.FUNCTIONS.execute("myfirstfunction1531292394914",{"arguments": JSON.stringify({"mailid":"test@zohotest.com"})})
	.then(function(data){
		if(data)
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}
TestCases.getCustomViews = function(customViewId ,callBack){
	
	var reqData = {"Entity":"Leads"};
	if(customViewId){
		reqData.Id = customViewId;
	}
	ZOHO.CRM.META.getCustomViews(reqData)
	.then(function(data){
		if(data && data.custom_views && data.custom_views instanceof Array && data.custom_views.length > 0 && data.info)
		{
			TestSpec.customViewID = data.custom_views[0].id
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});	
}
TestCases.getLayout = function(layoutID ,callBack){
	
	var reqData = {"Entity":"Leads"};
	if(layoutID){
		reqData.Id = layoutID;
	}
	ZOHO.CRM.META.getLayouts(reqData)
	.then(function(data){
		if(data && data instanceof Object && data.layouts && data.layouts instanceof Array && data.layouts.length > 0)
		{
			TestSpec.layoutID = data.layouts[0].id
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});	
}
TestCases.getRelatedList = function(layoutID ,callBack)
{
	var reqData = {"Entity":"Leads"};
	if(layoutID){
		reqData.Id = layoutID;
	}
	ZOHO.CRM.META.getRelatedList(reqData)
	.then(function(data){
		if(data && data instanceof Object && data.related_lists && data.related_lists instanceof Array && data.related_lists.length > 0)
		{
			TestSpec.relatedID = data.related_lists[0].id
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});	
}
TestCases.uiResize = function(data,callBack)
{
	ZOHO.CRM.UI.Resize(data).then(function(data){
		if(data)
		{
			callBack(true);
		}
		else
		{
			callBack(false);
		}
	});
}

