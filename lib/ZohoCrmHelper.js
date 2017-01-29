/**
 * @module ZOHO.CRM
 */
ZOHO.CRM=(function(){
	function newRequestPromise(data)
	{
		var promise = new Promise(function(resolve, reject)
		{
			ZOHO.embededApp.request(data)
			.then(function(data){
				resolve(data);
			});
		});
		return promise;
	}
	function createRecord(Entity,APIdata,RecordID,RelatedEntity)
	{
		
		var data = {
				category : "Create",//no i18n
				Entity : Entity,
				RelatedID : RecordID,
				APIData : APIdata
		};
		data.type = RelatedEntity || "Record"
		return newRequestPromise(data);
			
	};
	function getRecord(Entity,recordID)
	{
		var data = {
			category : "Read",//no i18n
			Entity : Entity,
			RecordID : recordID
		};
		return newRequestPromise(data);
	};
	function getAllRecords(APIData)
	{
		var data ={
				category:"Read",
				APIData : APIData
		}
		return newRequestPromise(data);
	};
	function updateRecord(Entity,APIData)
	{
		var data = {
			category : "Update",//no i18n
			type : "Record",//no i18n
			Entity : Entity,
			APIData : APIData
		};
		return newRequestPromise(data);
	};
	function deleteRecord(Entity,RecordID)
	{
		var data = {
			category : "Delete",//no i18n
			type : "Record",//no i18n
			Entity : Entity,
			RecordID : RecordID
		};
		return newRequestPromise(data);
	};
	function searchRecord(Entity,Type,Query)
	{
		var data = {
				category : "Search",//no i18n
				Entity : Entity,
				Type : Type,
				Query : Query
			};
		return newRequestPromise(data);	
	}
	function invokeConnector(nameSpace,requestData)
	{
		var data = {
			category : "Connector",//no i18n
			nameSpace:nameSpace,
			data : requestData,
		};
		return newRequestPromise(data);
	};
	function constructQueryString(source) {
		  var array = [];

		  for(var key in source) {
		     array.push(encodeURIComponent(key) + "=" + encodeURIComponent(source[key]));
		  }
		  return array.join("&");
	};
	function remoteCall(method,requestData)
	{
		var url = requestData.url;
		var params = requestData.params;
		var headers = requestData.headers;
		var body = requestData.body;
		if(!url){
			throw {Message:"Url missing"}
		}
		if(params){
			var queryString = constructQueryString(params);
			url += (url.indexOf("?") > -1 ?"&":"?")+queryString;
		}
		
		var reqData = {
				url:url,
				Header:headers,
				Body:body
		}
		
		debugger;
		var data = {
			category : "Connector",//no i18n
			nameSpace:method,
			data : reqData,
		};
		return newRequestPromise(data);
	};
	function manipulateUI(data){
		var config ={
				category : "UI",
		};
		$.extend(data,config)
		return newRequestPromise(data);
	}
	function config(type,nameSpace){
		var data ={
				category : "CONFIG",
				type:type,
				nameSpace: nameSpace
		};
		return newRequestPromise(data);
	}
	var HTTPRequest ={
			POST : "wget.post",
			GET : "wget.post",
			PUT : "wget.put",
			DELETE:"wget.delete"
	}
	return{
		/**
		 * @namespace ZOHO.CRM.CONFIG
		 */
		CONFIG:{
            /**
             * @function getOrgVariable
             * @memberof ZOHO.CRM.CONFIG
             * @description get plugins configuration data
             * @returns {Promise} Resolved with Plugin Configuration
			 * @example
			 * ZOHO.CRM.CONFIG.getVariable("variableNamespace").then(function(data){
			 * 	console.log(data);
			 * });
			 * 
			 * //prints 
 			 *{
			 *  "Success": {
			 *   "Content": "12345"
			 *  }
			 *}
			 *
             */
			getOrgVariable : function(nameSpace){
				return config("variable",nameSpace);
			},
            /**
             * @function getUserInfo
             * @memberof ZOHO.CRM.CONFIG
             * @description get Current User info
             * @returns {Promise} Resolved with User info
			 * @example
			 * ZOHO.CRM.CONFIG.getUserInfo().then(function(data){
			 * 	console.log(data);
			 * });
			 * 
			 * //prints 
			 * {
			 *   "email": "naresh.babu@zohocorp.com",
			 *   "locale": "en_US",
			 *   "timeZone": "Asia\/Kolkata"
			 * }
			 *
             */
			getUserInfo : function(){
				return config("user");
			},
		},
		/**
		 * @namespace ZOHO.CRM.API
		 */
		API:{
           /**
            * @function addNotes
            * @description Add Notes to a record
            * @param {Object} config - Configuration Object.
            * @param {String} config.Entity - SysRefName of the module.
            * @param {Long} config.RecordID - RecordID to associate the notes.
            * @param {String} config.Title - Notes Title.
            * @param {String} config.Content - Notes Content.
            * @returns {Promise} Resolved with notes creation status
            * @memberof ZOHO.CRM.API
            * @example
            * ZOHO.CRM.API.addNotes({Entity:"Leads",RecordID:"1475615000000292033",Title:"Notes Title",Content:"TitleContent"}).then(function(data){
            *  console.log(data);
            * });
            * 
            * //prints 
			* {
			*   "code": "SUCCESS",
			*   "details": {
			*     "created_time": "2017-01-12T04:56:33+05:30",
			*     "modified_time": "2017-01-12T04:56:33+05:30",
			*     "modified_by": {
			*       "name": "Naresh Babu Naresh Babu",
			*       "id": "1475615000000083003"
			*     },
			*     "id": "1475615000000484005",
			*     "created_by": {
			*       "name": "Naresh Babu Naresh Babu",
			*       "id": "1475615000000083003"
			*     }
			*   },
			*   "message": "record added",
			*   "status": "success"
			* }
            */
			addNotes : function(data)
			{
				var Entity = data.Entity;
				var RelatedEntity = "Notes";
				var RecordID = data.RecordID;
				var content = {
						data : [{
							Note_Title :  data.Title,
							Note_Content : data.Content
						}]
				};
				return createRecord(Entity,content,RecordID,RelatedEntity);
			},
			/**
	            * @function insertRecord
	            * @description Insert record to a modue
	            * @param {Object} config - Configuration Object.
	            * @param {String} config.Entity - SysRefName of the module.
	            * @param {Object} config.APIData - RecordID to associate the notes.
				* @return {Promise} Resolved with response data 
	            * @memberof ZOHO.CRM.API
				* @example
				* var recordData = {
				*         "Company": "Zylker",
				*         "Last_Name": "Peterson"
				*   }
				* ZOHO.CRM.API.insertRecord({Entity:"Leads",APIData:recordData}).then(function(data){
 				*	console.log(data);
				*	});
				*
				* //prints
				* [
				*   {
				*     "code": "SUCCESS",
				*     "details": {
				*       "created_time": "2017-01-19T17:10:40+05:30",
				*       "modified_time": "2017-01-19T17:10:40+05:30",
				*       "modified_by": {
				*         "name": "asd devvv",
				*         "id": "1000000030132"
				*       },
				*       "id": "1000000070210",
				*       "created_by": {
				*         "name": "asd devvv",
				*         "id": "1000000030132"
				*       }
				*     },
				*     "message": "record added",
				*     "status": "success"
				*   }
				* ]
				*/
			insertRecord : function(data)
			{
				var Entity = data.Entity;
				var APIData = data.APIData;
				return createRecord(Entity,APIData);
			},
           /**
            * @function getRecord
            * @description get all Details of a record
            * @param {Object} config - Configuration Object.
            * @param {String} config.Entity - SysRefName of the module.
            * @param {String} config.RecordID - RecordID to associate the notes.
			* @return {Promise} Resolved with data of record matching with RecordID 
            * @memberof ZOHO.CRM.API
			* @example
			* ZOHO.CRM.API.getRecord({Entity:"Leads",RecordID:"1000000030132"})
			* .then(function(data){
			*     console.log(data)
			* })
			* 
			* //prints 
			* [
			*   {
			*     "Owner": {
			*       "name": "asd devvv",
			*       "id": "1000000030132"
			*     },
			*     "Company": "zoho",
			*     "Email": "svembu@zohocorp.com",
			*     "Description": null,
			*     "$photo_id": null,
			*     "Website": null,
			*     "Twitter": null,
			*     "$upcoming_activity": null,
			*     "Salutation": "",
			*     "Last_Activity_Time": "2016-12-30T15:09:23+05:30",
			*     "First_Name": null,
			*     "Full_Name": "sridhar",
			*     "Lead_Status": null,
			*     "Industry": null,
			*     "Modified_By": {
			*       "name": "asd devvv",
			*       "id": "1000000030132"
			*     },
			*     "Skype_ID": null,
			*     "$process_flow": false,
			*     "$converted": false,
			*     "Phone": null,
			*     "Street": null,
			*     "Zip_Code": null,
			*     "id": "1000000049009",
			*     "Email_Opt_Out": false,
			*     "$approved": true,
			*     "Designation": null,
			*     "$approval": {
			*       "delegate": false,
			*       "approve": false,
			*       "reject": false
			*     },
			*     "Modified_Time": "2016-12-30T15:09:23+05:30",
			*     "Created_Time": "2016-12-30T06:09:44+05:30",
			*     "$converted_detail": {
			*       
			*     },
			*     "$followed": false,
			*     "City": null,
			*     "No_of_Employees": 0,
			*     "Mobile": "+16692317086",
			*     "Last_Name": "sridhar",
			*     "State": null,
			*     "$status": "cmv_1-1",
			*     "Lead_Source": null,
			*     "Country": null,
			*     "Created_By": {
			*       "name": "asd devvv",
			*       "id": "1000000030132"
			*     },
			*     "Fax": null,
			*     "Annual_Revenue": 0,
			*     "Secondary_Email": null
			*   }
			* ]
            */
			getRecord :function(data)
			{
				var Entity = data.Entity;
				var RecordID = data.RecordID;
				return getRecord(Entity,RecordID);
			},
           /**
            * @function getAllRecords
            * @description get list of all records in a module
            * @param {Object} config - Configuration Object.
            * @param {String} config.Entity - SysRefName of the module.
            * @param {String} [config.sort_order] - To sort records. allowed values {asc|desc}
            * @param {String} [config.converted] - To get the list of converted records
            * @param {String} [config.approved] - To get the list of approved records
            * @param {String} [config.page] - To get the list of records from the respective pages
            * @param {String} [config.per_page] - To get the list of records available per page
			* @return {Promise} Resolved with data of record matching with RecordID 
            * @memberof ZOHO.CRM.API
			* @example
			* ZOHO.CRM.API.getAllRecords({Entity:"Leads",sort_order:"asc",per_page:2,page:1})
			*.then(function(data){
			*    console.log(data)
			*})
			* 
			* //prints 
			* [
			*   {
			*     "Owner": {
			*       "name": "asd devvv",
			*       "id": "1000000030132"
			*     },
			*     "Company": "Zylkerssssss",
			*     "Email": null,
			*     "Description": null,
			*     "$photo_id": null,
			*     "Website": null,
			*     "Twitter": null,
			*     "$upcoming_activity": null,
			*     "Salutation": null,
			*     "Last_Activity_Time": "2017-01-19T17:10:04+05:30",
			*     "First_Name": null,
			*     "Full_Name": "Petersonssssss",
			*     "Lead_Status": null,
			*     "Industry": null,
			*     "Modified_By": {
			*       "name": "asd devvv",
			*       "id": "1000000030132"
			*     },
			*     "Skype_ID": null,
			*     "$process_flow": false,
			*     "$converted": false,
			*     "Phone": null,
			*     "Street": null,
			*     "Zip_Code": null,
			*     "id": "1000000070208",
			*     "Email_Opt_Out": false,
			*     "$approved": true,
			*     "Designation": null,
			*     "$approval": {
			*       "delegate": false,
			*       "approve": false,
			*       "reject": false
			*     },
			*     "Modified_Time": "2017-01-19T17:10:04+05:30",
			*     "Created_Time": "2017-01-19T17:09:28+05:30",
			*     "$converted_detail": {
			*       
			*     },
			*     "$followed": false,
			*     "City": null,
			*     "No_of_Employees": 0,
			*     "Mobile": null,
			*     "Last_Name": "Petersonssssss",
			*     "State": null,
			*     "$status": "cmv_1-1",
			*     "Lead_Source": null,
			*     "Country": null,
			*     "Created_By": {
			*       "name": "asd devvv",
			*       "id": "1000000030132"
			*     },
			*     "Fax": null,
			*     "Annual_Revenue": 0,
			*     "Secondary_Email": null
			*   },
			*   {
			*     "Owner": {
			*       "name": "asd devvv",
			*       "id": "1000000030132"
			*     },
			*     "Company": "Zylker",
			*     "Email": null,
			*     "Description": null,
			*     "$photo_id": null,
			*     "Website": null,
			*     "Twitter": null,
			*     "$upcoming_activity": null,
			*     "Salutation": null,
			*     "Last_Activity_Time": "2017-01-23T18:34:09+05:30",
			*     "First_Name": null,
			*     "Full_Name": "Peterson",
			*     "Lead_Status": null,
			*     "Industry": null,
			*     "Modified_By": {
			*       "name": "asd devvv",
			*       "id": "1000000030132"
			*     },
			*     "Skype_ID": null,
			*     "$process_flow": false,
			*     "$converted": false,
			*     "Phone": "1234322",
			*     "Street": null,
			*     "Zip_Code": null,
			*     "id": "1000000070210",
			*     "Email_Opt_Out": false,
			*     "$approved": true,
			*     "Designation": null,
			*     "$approval": {
			*       "delegate": false,
			*       "approve": false,
			*       "reject": false
			*     },
			*     "Modified_Time": "2017-01-23T18:34:09+05:30",
			*     "Created_Time": "2017-01-19T17:10:40+05:30",
			*     "$converted_detail": {
			*       
			*     },
			*     "$followed": false,
			*     "City": null,
			*     "No_of_Employees": 0,
			*     "Mobile": null,
			*     "Last_Name": "Peterson",
			*     "State": null,
			*     "$status": "cmv_1-1",
			*     "Lead_Source": null,
			*     "Country": null,
			*     "Created_By": {
			*       "name": "asd devvv",
			*       "id": "1000000030132"
			*     },
			*     "Fax": null,
			*     "Annual_Revenue": 0,
			*     "Secondary_Email": null
			*   }
			* ]
			*/
			getAllRecords :function(data)
			{
				return getAllRecords(data);
			},
			/**
            * @function updateRecord
            * @description To update a record in a module 
            * @param {Object} config - Configuration Object.
            * @param {String} config.Entity - SysRefName of the module.
            * @param {String} config.APIData - Update Record Data.
			* @return {Promise} Resolved with data of update Record Response 
            * @memberof ZOHO.CRM.API
			* @example
			* var config={
			*   Entity:"Leads",
			*   APIData:{
			*         "id": "1000000049031",
			*         "Company": "Zylker",
			*         "Last_Name": "Peterson"
			*   }
			* }
			* ZOHO.CRM.API.updateRecord(config)
			* .then(function(data){
			*     console.log(data)
			* })
			* 
			* //prints 
			* [
			*    {
			*         "data": [
			*            {
			*                 "message": "record updated",
			*                 "details": {
			*                     "created_by": {
			*                         "id": "4108880000086001",
			*                         "name": "Patricia Boyle"
			*                     },
			*                     "id": "4108880000478060",
			*                     "modified_by": {
			*                         "id": "4108880000086001",
			*                         "name": "Patricia Boyle"
			*                     },
			*                     "modified_time": "2016-04-28T17:59:21+05:30",
			*                     "created_time": "2016-04-28T17:59:21+05:30"
			*                 },
			*                 "status": "success",
			*                 "code": "SUCCESS"
			*             }
			*         ]
			*     }
			* ]            
			*/
			updateRecord :function(data)
			{
				var Entity = data.Entity;
				var APIData = data.APIData;
				return updateRecord(Entity,APIData);
			},
			getRecord :function(data)
			{
				var Entity = data.Entity;
				var RecordID = data.RecordID;
				return getRecord(Entity,RecordID);
			},
			/**
            * @function deleteRecord
            * @description To delete a record from a module
            * @param {Object} config - Configuration Object.
            * @param {String} config.Entity - SysRefName of the module.
            * @param {String} config.RecordID - RecordID to associate the notes.
			* @return {Promise} Resolved with Response to update record 
            * @memberof ZOHO.CRM.API
			* @example
			* ZOHO.CRM.API.deleteRecord({Entity:"Leads",RecordID: "1000000049031"})
			* .then(function(data){
			*     console.log(data)
			* })
			* 
			* //prints 
			* [
			*    {
			*         "data": [
			*            {
			*                 "message": "record updated",
			*                 "details": {
			*                     "created_by": {
			*                         "id": "4108880000086001",
			*                         "name": "Patricia Boyle"
			*                     },
			*                     "id": "4108880000478060",
			*                     "modified_by": {
			*                         "id": "4108880000086001",
			*                         "name": "Patricia Boyle"
			*                     },
			*                     "modified_time": "2016-04-28T17:59:21+05:30",
			*                     "created_time": "2016-04-28T17:59:21+05:30"
			*                 },
			*                 "status": "success",
			*                 "code": "SUCCESS"
			*             }
			*         ]
			*     }
			* ]            
			*/
			deleteRecord :function(data)
			{
				var Entity = data.Entity;
				var recordID = data.RecordID;
				return deleteRecord(Entity,recordID);
			},
			/**
            * @function searchRecord
            * @description To retrieve the records that matches your search criteria 
            * @param {object} config - Configuration Object
            * @param {String} config.Entity - SysRefName of module
            * @param {String} config.Type - Allowed values "email|phone|word|criteria"
            * @param {String} config.Query - query String
			* @return {Promise} Resolved with search result 
            * @memberof ZOHO.CRM.API
			* @example
			* ZOHO.CRM.API.searchRecord({Entity:"Leads",Type:"phone",Query:"12555036573"})
			* .then(function(data){
			*     console.log(data)
			* })
			* @example
			* ZOHO.CRM.API.searchRecord({Entity:"Leads",Type:"phone",email:"svembu@zohocorp.com"})
			* .then(function(data){
			*     console.log(data)
			* })
			* 
			*/
			searchRecord :function(data)
			{
				var Entity = data.Entity;
				var Type = data.Type;
				var Query = data.Query;
				
				return searchRecord(Entity,Type,Query);
			},
		},
		/**
		 * @namespace ZOHO.CRM.INTERACTION
		 */
		INTERACTION : {
			 /**
	            * @function getPageInfo
	            * @description Get Info on current page
	            * @returns {Promise} resolved with data of current record in view
	            * @memberof ZOHO.CRM.INTERACTION
	            * @example
	            * ZOHO.CRM.API.getPageInfo()
				* .then(function(data){
				*     console.log(data)
				* })
				* 
				* //prints 
				* [
				*   {
				*     "Owner": {
				*       "name": "asd devvv",
				*       "id": "1000000030132"
				*     },
				*     "Company": "zoho",
				*     "Email": "svembu@zohocorp.com",
				*     "Description": null,
				*     "$photo_id": null,
				*     "Website": null,
				*     "Twitter": null,
				*     "$upcoming_activity": null,
				*     "Salutation": "",
				*     "Last_Activity_Time": "2016-12-30T15:09:23+05:30",
				*     "First_Name": null,
				*     "Full_Name": "sridhar",
				*     "Lead_Status": null,
				*     "Industry": null,
				*     "Modified_By": {
				*       "name": "asd devvv",
				*       "id": "1000000030132"
				*     },
				*     "Skype_ID": null,
				*     "$process_flow": false,
				*     "$converted": false,
				*     "Phone": null,
				*     "Street": null,
				*     "Zip_Code": null,
				*     "id": "1000000049009",
				*     "Email_Opt_Out": false,
				*     "$approved": true,
				*     "Designation": null,
				*     "$approval": {
				*       "delegate": false,
				*       "approve": false,
				*       "reject": false
				*     },
				*     "Modified_Time": "2016-12-30T15:09:23+05:30",
				*     "Created_Time": "2016-12-30T06:09:44+05:30",
				*     "$converted_detail": {
				*       
				*     },
				*     "$followed": false,
				*     "City": null,
				*     "No_of_Employees": 0,
				*     "Mobile": "+16692317086",
				*     "Last_Name": "sridhar",
				*     "State": null,
				*     "$status": "cmv_1-1",
				*     "Lead_Source": null,
				*     "Country": null,
				*     "Created_By": {
				*       "name": "asd devvv",
				*       "id": "1000000030132"
				*     },
				*     "Fax": null,
				*     "Annual_Revenue": 0,
				*     "Secondary_Email": null
				*   }
				* ]
	            */
				getPageInfo :function()
				{
					var data = {
							category : "PageInfo"//no i18n
					};
					return newRequestPromise(data);
				}
		},
		/**
		 * @module ZOHO.CRM.UI
		 */
		UI:
		{
			/**
			 * @namespace ZOHO.CRM.UI.Dialer
			 */
			Dialer:
			{
                /**
                 * @function maximize
                 * @description maximizes the CallCenter Window
                 * @returns {Promise} resolved with true | false
                 * @memberof ZOHO.CRM.UI.Dialer
                 */
				maximize : function(){
					var data = {
						action	: {
							telephony : "maximize"
						}	
					};
					return manipulateUI(data);
				},
                /**
                 * @function minimize
                 * @description minimize the CallCenter Window
                 * @returns {Promise}  resolved with true | false
                 * @memberof ZOHO.CRM.UI.Dialer
                 */
				minimize : function(){
					var data = {
							action	: {
								telephony : "minimize"
							}	
						};
						return manipulateUI(data);
				},
                /**
                 * @function notify
                 * @description notify The user with an audible sound
                 * @returns {Promise} resolved with true | false
                 * @memberof ZOHO.CRM.UI.Dialer
                 */
				notify : function(){
					var data = {
							action	: {
								telephony : "notify"
							}	
						};
						return manipulateUI(data);
				},
                /**
                 * @function resize
                 * @description Resize Telephony PopUp to the given dimensions
                 * @param {Object} dimensions - Notes Title.
                 * @param {Integer} dimensions.height - Height in px
                 * @param {Integer} dimensions.width - Width in px
                 * @returns {Promise} resolved with true | false
                 * @memberof ZOHO.CRM.UI.Dialer
                 */
				resize : function(width , height){
					
				}
				
			}
			
		},
		/**
		 * @namespace ZOHO.CRM.HTTP
		 */
		HTTP:{
			 /**
	            * @function get
	            * @description Invoke  HTTP get
	            * @returns {Promise} resolved with response of the initiated request
	            * @memberof ZOHO.CRM.HTTP
                * @param {Object} request - Request Object
                * @param {Object} request.param - Request Params
                * @param {Object} request.header - Request Headers
	            * @example
				* var request ={
				* 	url : "https://crm.zoho.com/crm/private/xml/Users/getUsers",
				* 	params:{
				* 		scope:"crmapi",
				* 		type:"AllUsers"
				* 	},
				* 	headers:{
				*	 	Authorization:"******************************",
				* 	}
				* }
				* ZOHO.CRM.HTTP.get(request)
				* .then(function(data){
				*     console.log(data)
				* })
				* 
				* //Prints
				* {
				*   "users": {
				*     "user": [
				*       {
				*         "zip": "null",
				*         "country": "null",
				*         "website": "null",
				*         "role": "Acquisition Manager",
				*         "city": "null",
				*         "timezone": "Asia\/Calcutta",
				*         "profile": "Administrator",
				*         "mobile": "null",
				*         "language": "en_US",
				*         "content": "Patricia Boyle",
				*         "zuid": "51857638",
				*         "confirm": "true",
				*         "phone": "null",
				*         "street": "null",
				*         "id": "1475615000000083003",
				*         "state": "null",
				*         "fax": "null",
				*         "email": "naresh.babu+demo1@zohocorp.com",
				*         "status": "active"
				*       },
				*       {
				*         "zip": "null",
				*         "country": "null",
				*         "website": "null",
				*         "role": "Standard",
				*         "city": "null",
				*         "timezone": "Asia\/Calcutta",
				*         "profile": "testProfile",
				*         "mobile": "null",
				*         "language": "en_US",
				*         "content": "Naresh Babu",
				*         "zuid": "61712147",
				*         "confirm": "true",
				*         "phone": "null",
				*         "street": "null",
				*         "id": "1475615000000185001",
				*         "state": "null",
				*         "fax": "null",
				*         "email": "naresh.babu+demo2@zohocorp.com",
				*         "status": "active"
				*       }
				*     ]
				*   }
				* }
				*/
			get : function(data){
				return remoteCall(HTTPRequest.GET , data);
			},
			 /**
	            * @function post
	            * @description Invoke HTTP post
	            * @returns {Promise} resolved with response of the initiated request
	            * @memberof ZOHO.CRM.HTTP
	            * @param {Object} request - Request Object
	            * @param {Object} request.param - Request Params
	            * @param {Object} request.header - Request Headers
	            * @param {Object} request.body - Request Body
	            * @example
	            * var data ='<CustomModule><row no="1"><FL val="CustomModule1 Name">Registration-CS1000120160101</FL></row></CustomModule>';
				* var request ={
				* 		url : "https://crm.zoho.com/crm/private/xml/CustomModule1/insertRecords",
				* 		params:{
				* 			scope:"crmapi",
				* 			xmlData:data
				* 		},
				* 		headers:{
				* 	 		Authorization:"******************************",
				* 		}
				* }
				* ZOHO.CRM.HTTP.post(request)
				* .then(function(data){
				*     console.log(data)
				* })
				* 
				* //Prints
				* <?xml version="1.0"?>
				* <response uri="/crm/private/xml/CustomModule1/insertRecords">
				* <result>
				*     <message>Record(s) added successfully</message>
				*     <recorddetail>
				*         <FL val="Id">1475615000000491005</FL>
				*         <FL val="Created Time">2017-01-17 02:00:18</FL>
				*         <FL val="Modified Time">2017-01-17 02:00:18</FL>
				*         <FL val="Created By">
				*             <![CDATA[Patricia Boyle]]>
				*         </FL>
				*         <FL val="Modified By">
				*             <![CDATA[Patricia Boyle]]>
				*         </FL>
				*     </recorddetail>
				* </result>
				* </response>
				*/
			post : function(data){
				return remoteCall(HTTPRequest.POST , data);
			}
		},
		/**
		 * @namespace ZOHO.CRM.CONNECTOR
		 */
		CONNECTOR:{
			 /**
	            * @function invokeAPI
	            * @description Invokes Connector API 
	            * @returns {Promise} resolved with response of the Connector API
	            * @memberof ZOHO.CRM.CONNECTOR
	            * @param {String} nameSpace- NameSpace of Connector API to invoke
	            * @param {Object} data- Connector API Data
	            * @example
	            * var tokenMap={"apikey" : "*********", "First_Name" : "Naresh", "Last_Name" : "Babu", "email" : "naresh.babu@zohocorp.com"};
				* ZOHO.CRM.CONNECTOR.invokeAPI("MailChimp.sendSubscription",tokenMap)
				* .then(function(data){
				*     console.log(data)
				* })
				*/
			invokeAPI:function(nameSpace,data){
				return remoteCall(nameSpace,data);
			}
		}
	};
})();