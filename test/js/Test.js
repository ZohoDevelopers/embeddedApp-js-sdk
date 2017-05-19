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