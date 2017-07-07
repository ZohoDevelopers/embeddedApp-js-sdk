const TestCases ={};

TestCases.getAllRecord = function(callBack)
{
		ZOHO.CRM.API.getAllRecords({Entity:"Leads"})
			.then(function(data){
				if(data && typeof(data) === 'object' && data instanceof Array )
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
				if(data && typeof(data) === 'object' && data[0] && data[0].code==='SUCCESS'){
					leadID = data[0].details.id;
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
					if(data && typeof(data) === 'object' && data[0] && data[0].code==='SUCCESS'){
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
				if(data && typeof(data) === 'object' )
				{
					for(field in recordData){

						if(recordData[field] == data[field]){
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
				    if(data && data.length && data.length > 0 ){
						callBack(true,data[0].id);
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
					if(data && data.id == userID){
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