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
	return{
		/**
		 
		 * @namespace ZOHO.CRM.CONFIG
		 */
		CONFIG:{
            /**
             * @function get
             * @memberof ZOHO.CRM.CONFIG
             * @description get plugins configuration data
             * @returns {Promise} Resolved with User and  Plugin Configuration
			 * @example
			 * ZOHO.CRM.CONFIG.get().then(function(data){
			 * 	console.log(data);
			 * });
			 * 
			 * //prints 
			 * user:{
			 * 	email 	: "naresh.babu@zohocorp.com",
			 * 	locale 	: "en_US",
			 * 	timeZone: "Asia/Calcutta"
			 * }
			 *
             */
			get : function(){
				return config();
			}
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
			},

           /**
            * @function getPageInfo
            * @description Get Info on current page
            * @returns {Promise} resolved with data of current record in view
            * @memberof ZOHO.CRM.API
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
			 * @namespace ZOHO.CRM.UI.telephony
			 */
			telephony:
			{
                /**
                 * @function maximize
                 * @description maximizes the CallCenter Window
                 * @returns {Promise} resolved with true | false
                 * @memberof ZOHO.CRM.UI.telephony
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
                 * @memberof ZOHO.CRM.UI.telephony
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
                 * @memberof ZOHO.CRM.UI.telephony
                 */
				notify : function(){
					var data = {
							action	: {
								telephony : "notify"
							}	
						};
						return manipulateUI(data);
				}
				
			}
			
		}
	};
})();