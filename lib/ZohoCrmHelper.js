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
	function createRecord(Entity,RelatedEntity,recordID , APIdata,callBack)
	{
		var data = {
				category : "Create",//no i18n
				Entity : Entity,
				RelatedEntity : RelatedEntity,
				RelatedID : recordID,
				APIData : APIdata
		};
		return newRequestPromise(data);
			
	};
	function getRecord(Entity,recordID,callBack)
	{
		var data = {
			category : "Read",//no i18n
			Entity : Entity,
			RecordID : recordID
		};
		return newRequestPromise(data);
	};
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
	function config(){
		var data ={
				category : "CONFIG",
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
             * @returns {Promise} Resolved with User and  Plugin Configuration
			 * @example
			 * ZOHO.CRM.CONFIG.get().then(function(data){
			 * 	console.log(data);
			 * });
			 * 
			 * //prints 
			 * {
			 * 	AccessKey	: "dOHRGqKgRyXGNBFzMCn2s33r3n",
			 * 	OrgID		: "56641122555985",
			 * 	ProductDomain	: "zillium"
			 * }
			 *
             */
			getOrgVariable : function(){
				return config();
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
				return createRecord(Entity,RelatedEntity,RecordID,JSON.stringify(content));
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
			}
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