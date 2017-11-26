const TestCases ={};

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
TestCases.deleteRecord=function(module,recordID,callBack){
		  if(!recordID){
				callBack(false);
		  }
		  else{

			  ZOHO.CRM.API.deleteRecord({Entity:module,RecordID: recordID})
				.then(function(data){
					if(data && typeof(data) === 'object' && data.data && data.data instanceof Array && data.data.length > 0 && data.data[0].code==='SUCCESS'){
						callBack(true);
					}
					else
					{
						callBack(false);
					}
				})	
		  }
		  
};
TestCases.getRecord = function(module,recordID,recordData,callBack){
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
TestCases.getOrgVariable = function(variableName,callBack)
{
	ZOHO.CRM.CONFIG.getOrgVariable(variableName).then(function(data){
		if(data || data.Success || data.Error)
		{
			callBack(true);
		}
		else
			{
				callBack(false);
			}
	});
}
TestCases.checkHttpRequest = function(url,callBack){
	var request ={
		url : url
	}
	ZOHO.CRM.HTTP.get(request).then(function(httpData){
		var httpData = httpData;
    	ZOHO.CRM.HTTP.get(request).then(function(httpsData){
    		var httpsData = httpsData;
    		if(httpData && httpsData)
    		{
    			callBack(true);
    		}
    		else
    		{
    			callBack(false)
    		}
    	});
	});
}
TestCases.getFields = function(module,callBack){
	ZOHO.CRM.META.API.getFields({Entity:module}).then(function(result){
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
	ZOHO.CRM.META.API.getModules({Entity:module}).then(function(result){
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
	ZOHO.CRM.META.API.getAssignmentRules({Entity:module}).then(function(data){
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
TestCases.getCurrentUser = function(callBack){
	ZOHO.CRM.CONFIG.getCurrentUser().then(function(data){
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
TestCases.invokeUnAuthConnector = function(callBack){
	debugger;
	ZOHO.CRM.CONNECTOR.invokeAPI("UnAuthConnectorNameSpace",{})
	.then(function(data){
			callBack(false);
	})
	.catch(function(e){
		
		callBack(true);
	});
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