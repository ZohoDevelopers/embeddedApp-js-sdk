/**
 * @module ZOHO.CRM
 */
var ZOHO=(function(){
	var appSDK;
	var eventListenerMap={};
	return{
		embeddedApp : {
			on : function(event, fn ){
				eventListenerMap[event] = fn;
			},
			init : function(){
				appSDK = new ZSDK();
				var promiseResolve;
				var promise = new Promise(function(resolve,reject){
					promiseResolve = resolve;
				});	
				appSDK.OnLoad(function(){
					promiseResolve();
				});
				for (var key in eventListenerMap){	    
					appSDK.getContext().Event.Listen(key, eventListenerMap[key]);
    			}
				return promise;
			}
		},
		CRM : (function(){
			function newRequestPromise(data)
			{
				/*
				 * Sdk Version Maintainance
				 */
				data['sdkVersion'] = '1';
				return appSDK.getContext().Event.Trigger('CRM_EVENT', data, true);
			}
			function createRecord(Entity,APIdata,RecordID,RelatedEntity)
			{

				var data = {
						category : "CREATE",//no i18n
						Entity : Entity,
						RelatedID : RecordID,
						APIData : APIdata
				};
				data.type = RelatedEntity || "RECORD"
				return newRequestPromise(data);

			};
			function getRecord(Entity,recordID,relatedListSysRef)
			{
				var data = {
						category : "READ",//no i18n
						APIData:{
							Entity : Entity,
							RecordID : recordID,
							RelatedList:relatedListSysRef
						}
				};
				return newRequestPromise(data);
			};
			function getAllRecords(APIData)
			{
				var data ={
						category:"READ",
						APIData : APIData
				}
				return newRequestPromise(data);
			};
			function updateRecord(Entity,APIData)
			{
				var data = {
						category : "UPDATE",//no i18n
						type : "RECORD",//no i18n
						Entity : Entity,
						APIData : APIData
				};
				return newRequestPromise(data);
			};
			function updateRelatedRecord(Entity,RecordID,RelatedList,RelatedRecordID,APIData)
			{
				var data = {
						category : "UPDATE",//no i18n
						type : "RELATED_RECORD",//no i18n
						Entity : Entity,
						RecordID : RecordID,
						RelatedList : RelatedList,
						RelatedRecordID : RelatedRecordID,
						APIData : APIData
				};
				return newRequestPromise(data);
			};
			function updateNotes(Entity,RecordID,RelatedRecordID,APIData)
			{
				var data = {
						category : "UPDATE",//no i18n
						type : "NOTES",//no i18n
						Entity : Entity,
						RecordID : RecordID,
						RelatedRecordID : RelatedRecordID,
						APIData : APIData
				};
				return newRequestPromise(data);
			};
			function deleteRecord(Entity,RecordID)
			{
				var data = {
						category : "DELETE",//no i18n
						type : "RECORD",//no i18n
						Entity : Entity,
						RecordID : RecordID
				};
				return newRequestPromise(data);
			};
			function deleteRelatedRecord(Entity,RecordID,RelatedList,RelatedRecordID)
			{
				var data = {
						category : "DELETE",//no i18n
						type : "RELATED_RECORD",//no i18n
						Entity : Entity,
						RecordID : RecordID,
						RelatedList : RelatedList,
						RelatedRecordID : RelatedRecordID,
				};
				return newRequestPromise(data);
			}
			function searchRecord(Entity,Type,Query)
			{
				var data = {
						category : "SEARCH",//no i18n
						Entity : Entity,
						Type : Type,
						Query : Query
				};
				return newRequestPromise(data);	
			}
			function constructQueryString(source) {
				var array = [];

				for(var key in source) {
					array.push(encodeURIComponent(key) + "=" + encodeURIComponent(source[key]));
				}
				return array.join("&");
			};
			function remoteCall(method,requestData,type)
			{
				var reqData =undefined;
				if(type!="CONNECTOR")
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
					reqData = {
							url:url,
							Header:headers,
							Body:body
					}
				}
				else
				{
					reqData = requestData;
				}

				var data = {
						category : "CONNECTOR",//no i18n
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
			function action(type,obj){
				var data ={
						category : "ACTION",
						type:type,
						object:obj
				};
				return newRequestPromise(data);
			}
			function user(data)
			{
				var promiseData={
						category : "USER",
				};
				if(data.ID){
					promiseData.ID = data.ID
				}
				else if(data.Type){
					promiseData.Type = data.Type
				}
				return newRequestPromise(promiseData);
			}
			function getMeta(data)
			{
				var reqJson={
					category:"META",
					type:data.type,
					Entity:data.Entity,
					Id : data.Id
				}
				return newRequestPromise(reqJson);

			}
			var HTTPRequest ={
					POST : "wget.post",
					GET : "wget.get",
					PUT : "wget.put",
					DELETE:"wget.delete"
			}
			return{
				ACTION :{
					setConfig : function(obj){
						return action("CUSTOM_ACTION_SAVE_CONFIG",obj);
					},
					enableAccountAccess : function(obj){
						return action("ENABLE_ACCOUNT_ACCESS",obj);
					}
				},
				/**
				 * @namespace ZOHO.CRM.CONFIG
				 */
				CONFIG:{
					/**
					 * @function getOrgInfo
					 * @memberof ZOHO.CRM.CONFIG
					 * @description get plugins configuration data
					 * @returns {Promise} Resolved with Plugin Configuration
					 * @example
					 * ZOHO.CRM.CONFIG.getOrgInfo().then(function(data){
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
					getOrgInfo : function(nameSpace){
						return config("ORG");
					},
					/**
					 * @function getCurrentUser
					 * @memberof ZOHO.CRM.CONFIG
					 * @description get Current User info
					 * @returns {Promise} Resolved with User info
					 * @example
					 * ZOHO.CRM.CONFIG.getCurrentUser().then(function(data){
					 * 	console.log(data);
					 * });
					 * 
					 * //prints 
					 * {
					 *   "confirm": true,
					 *   "full_name": "asd devvv",
					 *   "role": {
					 *     "name": "CEO",
					 *     "id": "1000000028936"
					 *   },
					 *   "profile": {
					 *     "name": "Administrator",
					 *     "id": "1000000028942"
					 *   },
					 *   "last_name": "asd devvv",
					 *   "alias": null,
					 *   "id": "1000000030132",
					 *   "first_name": null,
					 *   "email": "naresh.babu+dev1@zohocorp.com",
					 *   "zuid": "4253443",
					 *   "status": "active"
					 * }
					 *
					 */
					getCurrentUser: function(){
						return config("CURRENT_USER");
					},
				},
				/**
				 * @namespace ZOHO.CRM.META
				 */
				META:{
					/**
					 * @function getFields
					 * @memberof ZOHO.CRM.META
					 * @description get field lables and api names
					 * @param {Object} config - Configuration Object.
		             * @param {String} config.Entity - SysRefName of the module.
					 * @returns {Promise} Resolved with data of record matching with Entity and type
					 * @example
					 * ZOHO.CRM.META.API.getFields({"Entity":"Contacts"}).then(function(data){
					 * console.log(data);	
					 * });
					 *
					 *
					 * //prints
					 *
					 *
					 *[
					*  {
					*    "custom_field": false,
					*    "lookup": {
					*      
					*    },
					*    "visible": true,
					*    "json_type": "jsonobject",
					*    "field_label": "Contact Owner",
					*    "length": 120,
					*    "column_name": "SMOWNERID",
					*    "view_type": {
					*      "view": true,
					*      "edit": true,
					*      "quick_create": false,
					*      "create": true
					*    },
					*    "created_source": "default",
					*    "show_type": 7,
					*    "ui_type": 8,
					*    "read_only": false,
					*    "api_name": "Owner",
					*    "unique": {
					*      
					*    },
					*    "businesscard_supported": true,
					*    "data_type": "ownerlookup",
					*    "formula": {
					*      
					*    },
					*    "currency": {
					*      
					*    },
					*    "id": "14000000000649",
					*    "decimal_place": null,
					*    "pick_list_values": [
					*      
					*    ],
					*    "auto_number": {
					*      
					*    }
					*  },
					*  {
					*    "custom_field": false,
					*    "lookup": {
					*      
					*    },
					*    "visible": true,
					*    "json_type": "string",
					*    "field_label": "Lead Source",
					*    "length": 120,
					*    "column_name": "LEADSOURCE",
					*    "view_type": {
					*      "view": true,
					*      "edit": true,
					*      "quick_create": false,
					*      "create": true
					*    },
					*    "created_source": "default",
					*    "show_type": 7,
					*    "ui_type": 2,
					*    "read_only": false,
					*    "api_name": "Lead_Source",
					*    "unique": {
					*      
					*    },
					*    "businesscard_supported": true,
					*    "data_type": "picklist",
					*    "formula": {
					*      
					*    },
					*    "currency": {
					*      
					*    },
					*    "id": "14000000000651",
					*    "decimal_place": null,
					*    "pick_list_values": [
					*      {
					*        "display_value": "None",
					*        "actual_value": "-None-"
					*      },
					*      {
					*        "display_value": "Advertisement",
					*        "actual_value": "Advertisement"
					*      },
					*      {
					*        "display_value": "Cold Call",
					*        "actual_value": "Cold Call"
					*      },
					*      {
					*        "display_value": "Employee Referral",
					*        "actual_value": "Employee Referral"
					*      },
					*      {
					*        "display_value": "External Referral",
					*        "actual_value": "External Referral"
					*      },
					*      {
					*        "display_value": "Partner",
					*        "actual_value": "Partner"
					*      },
					*      {
					*        "display_value": "Public Relations",
					*        "actual_value": "Public Relations"
					*      },
					*      {
					*        "display_value": "Trade Show",
					*        "actual_value": "Trade Show"
					*      },
					*      {
					*        "display_value": "Web Form",
					*        "actual_value": "Web Form"
					*      },
					*      {
					*        "display_value": "Search Engine",
					*        "actual_value": "Search Engine"
					*      },
					*      {
					*        "display_value": "Facebook",
					*        "actual_value": "Facebook"
					*      },
					*      {
					*        "display_value": "Twitter",
					*        "actual_value": "Twitter"
					*      }
					*    ],
					*    "auto_number": {
					*      
					*    }
					*  },
					*  {
					*    "custom_field": false,
					*    "lookup": {
					*      
					*    },
					*    "visible": true,
					*    "json_type": "string",
					*    "field_label": "First Name",
					*    "length": 40,
					*    "column_name": "FIRSTNAME",
					*    "view_type": {
					*      "view": false,
					*      "edit": true,
					*      "quick_create": true,
					*      "create": true
					*    },
					*    "created_source": "default",
					*    "show_type": 7,
					*    "ui_type": 27,
					*    "read_only": false,
					*    "api_name": "First_Name",
					*    "unique": {
					*      
					*    },
					*    "businesscard_supported": false,
					*    "data_type": "text",
					*    "formula": {
					*      
					*    },
					*    "currency": {
					*      
					*    },
					*    "id": "14000000000653",
					*    "decimal_place": null,
					*    "pick_list_values": [
					*      
					*    ],
					*    "auto_number": {
					*      
					*    }
					*  },
					*  {
					*    "custom_field": false,
					*    "lookup": {
					*      
					*    },
					*    "visible": true,
					*    "json_type": "string",
					*    "field_label": "Last Name",
					*    "length": 80,
					*    "column_name": "LASTNAME",
					*    "view_type": {
					*      "view": true,
					*      "edit": true,
					*      "quick_create": true,
					*      "create": true
					*    },
					*    "created_source": "default",
					*    "show_type": 7,
					*    "ui_type": 127,
					*    "read_only": false,
					*    "api_name": "Last_Name",
					*    "unique": {
					*      
					*    },
					*    "businesscard_supported": false,
					*    "data_type": "text",
					*    "formula": {
					*      
					*    },
					*    "currency": {
					*      
					*    },
					*    "id": "14000000000655",
					*    "decimal_place": null,
					*    "pick_list_values": [
					*      
					*    ],
					*    "auto_number": {
					*      
					*    }
					*  },
					*  {
					*    "custom_field": false,
					*    "lookup": {
					*      
					*    },
					*    "visible": true,
					*    "json_type": "string",
					*    "field_label": "Full Name",
					*    "length": 80,
					*    "column_name": "FULLNAME",
					*    "view_type": {
					*      "view": true,
					*      "edit": false,
					*      "quick_create": false,
					*      "create": false
					*    },
					*    "created_source": "default",
					*    "show_type": 0,
					*    "ui_type": 1,
					*    "read_only": false,
					*    "api_name": "Full_Name",
					*    "unique": {
					*      
					*    },
					*    "businesscard_supported": false,
					*    "data_type": "text",
					*    "formula": {
					*      
					*    },
					*    "currency": {
					*      
					*    },
					*    "id": "14000000000657",
					*    "decimal_place": null,
					*    "pick_list_values": [
					*      
					*    ],
					*    "auto_number": {
					*      
					*    }
					*  }
					*]
					*/
					getFields: function(data){
						
						data.type = "FIELD_LIST";
						return getMeta(data);

					},
					/**
					* @function getModules
					* @memberof ZOHO.CRM.META
					* @description get Modules list
					* @returns {Promise} Resolved with data of all modules
					* @example
					* ZOHO.CRM.META.API.getModules().then(function(data){
					* console.log(data);	
					* });
					*
					*
					* //prints
					*
					*
					*[
					* {
					*   "visible": true,
					*   "convertable": false,
					*   "editable": false,
					*   "deletable": false,
					*   "profiles": [
					*     
					*   ],
					*   "display_field": null,
					*   "creatable": false,
					*   "web_link": null,
					*   "sequence_number": 2,
					*   "singular_label": "Feeds",
					*   "modified_time": null,
					*   "viewable": true,
					*   "api_supported": false,
					*   "plural_label": "Feeds",
					*   "api_name": "Feeds",
					*   "modified_by": null,
					*   "generated_type": "default",
					*   "scoring_supported": false,
					*   "id": "14000000000037",
					*   "module_name": "Feeds",
					*   "business_card_field_limit": 0,
					*   "parent_module": {
					*     
					*   }
					* },
					* {
					*   "visible": true,
					*   "convertable": true,
					*   "editable": true,
					*   "deletable": true,
					*   "profiles": [
					*     {
					*       "name": "Administrator",
					*       "id": "14000000029270"
					*     },
					*     {
					*       "name": "Standard",
					*       "id": "14000000029273"
					*     }
					*   ],
					*   "display_field": {
					*     "api_name": "Full_Name",
					*     "id": "14000000000827"
					*   },
					*   "creatable": true,
					*   "web_link": null,
					*   "sequence_number": 3,
					*   "singular_label": "Lead",
					*   "modified_time": null,
					*   "viewable": true,
					*   "api_supported": true,
					*   "plural_label": "Leads",
					*   "api_name": "Leads",
					*   "modified_by": null,
					*   "generated_type": "default",
					*   "scoring_supported": true,
					*   "id": "14000000000039",
					*   "module_name": "Leads",
					*   "business_card_field_limit": 5,
					*   "parent_module": {
					*     
					*   }
					* },
					* {
					*   "visible": true,
					*   "convertable": false,
					*   "editable": true,
					*   "deletable": true,
					*   "profiles": [
					*     {
					*       "name": "Administrator",
					*       "id": "14000000029270"
					*     },
					*     {
					*       "name": "Standard",
					*       "id": "14000000029273"
					*     }
					*   ],
					*   "display_field": {
					*     "api_name": "Account_Name",
					*     "id": "14000000000573"
					*   },
					*   "creatable": true,
					*   "web_link": null,
					*   "sequence_number": 4,
					*   "singular_label": "Account",
					*   "modified_time": null,
					*   "viewable": true,
					*   "api_supported": true,
					*   "plural_label": "Accounts",
					*   "api_name": "Accounts",
					*   "modified_by": null,
					*   "generated_type": "default",
					*   "scoring_supported": true,
					*   "id": "14000000000041",
					*   "module_name": "Accounts",
					*   "business_card_field_limit": 5,
					*   "parent_module": {
					*     
					*   }
					* },
					* {
					*   "visible": true,
					*   "convertable": false,
					*   "editable": true,
					*   "deletable": true,
					*   "profiles": [
					*     {
					*       "name": "Administrator",
					*       "id": "14000000029270"
					*     },
					*     {
					*       "name": "Standard",
					*       "id": "14000000029273"
					*     }
					*   ],
					*   "display_field": {
					*     "api_name": "Full_Name",
					*     "id": "14000000000657"
					*   },
					*   "creatable": true,
					*   "web_link": null,
					*   "sequence_number": 5,
					*   "singular_label": "Contact",
					*   "modified_time": null,
					*   "viewable": true,
					*   "api_supported": true,
					*   "plural_label": "Contacts",
					*   "api_name": "Contacts",
					*   "modified_by": null,
					*   "generated_type": "default",
					*   "scoring_supported": true,
					*   "id": "14000000000043",
					*   "module_name": "Contacts",
					*   "business_card_field_limit": 5,
					*   "parent_module": {
					*     
					*   }
					* }
					*]
					 */
					getModules:function()
					{
						var data={
							type : "MODULE_LIST"
						};
						return getMeta(data);

					},
					/**
					* @function getAssignmentRules
					* @memberof ZOHO.CRM.META
					* @description get Assignment rules details
					* @param {Object} config - Configuration Object.
		            * @param {String} config.Entity - SysRefName of the module.
					* @returns {Promise} Resolved with data of Assignment rules matching with Entity
					* @example
					* ZOHO.CRM.META.API.getAssignmentRules({"Entity":"Contacts"}).then(function(data){
					* console.log(data);	
					* });
					*
					*
					* //prints
					*
					*
					*{
					*  "assignment_rules": [
					*    {
					*      "module": {
					*        "api_name": "Leads",
					*        "id": "13000000000039"
					*      },
					*      "name": "Lead rule",
					*      "id": "13000000036019",
					*      "created_date": "2017-05-12",
					*      "created_by": {
					*        "name": " uk",
					*        "id": "13000000030480"
					*      }
					*    },
					*    {
					*      "module": {
					*       "api_name": "Leads",
					*        "id": "13000000000039"
					*     },
					*      "name": "Lead second entry",
					*     "id": "13000000036045",
					*      "created_date": "2017-05-12",
					*      "created_by": {
					*        "name": " uk",
					*        "id": "13000000030480"
					*      }
					*    }
					*  ]
					*}
					 */
					getAssignmentRules :function(data)
					{
						data.type="ASSIGNMENT_RULES";
						return getMeta(data);
					},
					
					/**
					* @function getLayouts
					* @memberof ZOHO.CRM.META
					* @description get Layout details of a module
					* @param {Object} config - Configuration Object.
		            * @param {String} config.Entity - SysRefName of the module.
		            * @param {String} [config.Id] - layout ID.
					* @returns {Promise} Resolved with data of Assignment rules matching with Entity
					* @example
					* ZOHO.CRM.META.API.getLayouts({"Entity":"Contacts"}).then(function(data){
					* console.log(data);	
					* });
					* 
					* @example
					* ZOHO.CRM.META.API.getLayouts({"Entity":"Contacts","Id":"5000000000169"}).then(function(data){
					* console.log(data);	
					* });
					*/
					getLayouts: function(data){
						data.type = data.Id? "LAYOUT" : "LAYOUTS" 
						return getMeta(data);
					},
					
					/**
					* @function getRelatedList
					* @memberof ZOHO.CRM.META
					* @description get RelatedList meta info of a module
					* @param {Object} config - Configuration Object.
		            * @param {String} config.Entity - SysRefName of the module.
					* @returns {Promise} Resolved with data of Assignment rules matching with Entity
					* @example
					* ZOHO.CRM.META.API.getRelatedList({"Entity":"Contacts"}).then(function(data){
					* console.log(data);	
					* });
					*/
					getRelatedList: function(data){
						data.type = "RELATED_LIST";
						return getMeta(data);
					},
					
					/**
					* @function getCustomViews
					* @memberof ZOHO.CRM.META
					* @description get Custom Views of a module
					* @param {Object} config - Configuration Object.
		            * @param {String} config.Entity - SysRefName of the module.
		            * @param {String} [config.Id] - layout ID.
					* @returns {Promise} Resolved with data of Assignment rules matching with Entity
					* @example
					* ZOHO.CRM.META.API.getLayouts({"Entity":"Contacts"}).then(function(data){
					* console.log(data);	
					* });
					* 
					* @example
					* ZOHO.CRM.META.API.getLayouts({"Entity":"Contacts","Id":"5000000000169"}).then(function(data){
					* console.log(data);	
					* });
					*/
					getCustomViews: function(data){
						data.type = data.Id? "CUSTOM_VIEW" : "CUSTOM_VIEWS" 
						return getMeta(data);
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
					 *{
					 *  "data": [
					 *    {
					 *      "code": "SUCCESS",
					 *      "details": {
					 *        "Modified_Time": "2017-12-20T14:08:56+05:30",
					 *        "Modified_By": {
					 *          "name": "NareshTesting",
					 *          "id": "1000000031157"
					 *        },
					 *        "Created_Time": "2017-12-20T14:08:56+05:30",
					 *        "id": "1000000044101",
					 *        "Created_By": {
					 *          "name": "NareshTesting",
					 *          "id": "1000000031157"
					 *        }
					 *      },
					 *      "message": "record added",
					 *      "status": "success"
					 *    }
					 *  ]
					 *}
					 */
					addNotes : function(data)
					{
						var Entity = data.Entity;
						var RelatedEntity = "NOTES";
						var RecordID = data.RecordID;
						var content = {
								data : [{
									Note_Title :  data.Title,
									Note_Content : data.Content
								}]
						};
						return createRecord(Entity,content,RecordID,RelatedEntity);
					},
					addNotesAttachment : function(data)
					{
						var Entity = data.Entity;
						var RecordID = data.RecordID;
						var RelatedRecordID = data.RelatedRecordID;
						var APIData = {Files:{
							FileName:File.Name,
							FileData:File.Content
						}};
						return updateNotes(Entity,RecordID,RelatedRecordID,APIData)
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
					 * @example
					 * var data = [
					 * {
					 *         "Company": "ZohoCorp",
					 *         "Last_Name": "Babu"
					 * },
					 * {
					 * 	"Company": "ZohoCorp",
					 *     	"Last_Name": "Suganya"
					 * }
					 * ];
					 * ZOHO.CRM.API.insertRecord({Entity:"Leads",APIData:data}).then(function(data){
					 * 	console.log(data);
					 * });
					 * 
					 * //prints
					 * [
					 *   {
					 *     "code": "SUCCESS",
					 *     "details": {
					 *       "created_time": "2017-02-02T05:18:53+05:30",
					 *       "modified_time": "2017-02-02T05:18:53+05:30",
					 *       "modified_by": {
					 *         "name": "asd devvv",
					 *         "id": "1000000030132"
					 *       },
					 *       "id": "1000000079113",
					 *       "created_by": {
					 *         "name": "asd devvv",
					 *         "id": "1000000030132"
					 *       }
					 *     },
					 *     "message": "record added",
					 *     "status": "success"
					 *   },
					 *   {
					 *     "code": "MANDATORY_NOT_FOUND",
					 *     "details": {
					 *       "api_name": "Last_Name"
					 *     },
					 *     "message": "required field not found",
					 *     "status": "error"
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
					 * ZOHO.CRM.API.searchRecord({Entity:"Leads",Type:"email",Query:"svembu@zohocorp.com"})
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
					/**
					 * @function getAllUsers
					 * @description To retrieve list of users in ZohoCRM 
					 * @param {object} config - Configuration Object
					 * @param {String} config.Type - Allowed values "AllUsers | ActiveUsers | DeactiveUsers | ConfirmedUsers | NotConfirmedUsers | DeletedUsers | ActiveConfirmedUsers | AdminUsers | ActiveConfirmedAdmins"
					 * @return {Promise} Resolved List of users matching specified Type 
					 * @memberof ZOHO.CRM.API
					 * @example
					 * ZOHO.CRM.API.getAllUsers({Type:"AllUsers"})
					 * .then(function(data){
					 *     console.log(data)
					 * })
					 * 
					 */
					getAllUsers :function(data)
					{
						var Type = data.Type;
						return user({Type:Type});
					},
					/**
					 * @function getUser
					 * @description To retrieve list of users in ZohoCRM 
					 * @param {object} config - Configuration Object
					 * @param {String} config.ID - UserID 
					 * @return {Promise} Resolved user matching userID 
					 * @memberof ZOHO.CRM.API
					 * @example
					 * ZOHO.CRM.API.getUser({ID:"1000000030132"})
					 * .then(function(data){
					 *     console.log(data)
					 * })
					 * 
					 */
					getUser :function(data)
					{
						var ID = data.ID;
						return user({ID:ID});
					},
					getAllUsers :function(data)
					{
						var Type = data.Type;
						return user({Type:Type});
					},
					/**
					 * @function getRelatedRecords
					 * @description To retrive related list records
					 * @param {object} config - Configuration Object
					 * @param {String} config.Entity - 	SysRefName of the module. 
					 * @param {String} config.RecordID - RecordID to associate the notes. 
					 * @param {String} config.RelatedListName - 	SysRefName of the relatedList. 
					 * @return {Promise} Resolved user matching userID 
					 * @memberof ZOHO.CRM.API
					 * @example
					 * ZOHO.CRM.API.getRelatedRecords({Entity:"Leads",RecordID:"1000000030132",RelatedList:"Notes"})
					 * .then(function(data){
					 *     console.log(data)
					 * })
					 * //prints
					 * 
					 * [
					 * 	{
					 * 		"$approval": {
					 * 			"delegate": false,
					 * 			"approve": false,
					 * 			"reject": false
					 * 		},
					 * 		"Owner": {
					 * 			"name": "asd devvv",
					 * 			"id": "1000000030132"
					 * 		},
					 * 		"Modified_Time": "2017-02-02T19:42:21+05:30",
					 * 		"$attachments": [],
					 * 		"Created_Time": "2017-02-02T19:42:21+05:30",
					 * 		"$followed": false,
					 * 		"Parent_Id": {
					 * 			"First_Name": null,
					 * 			"Last_Name": "Peterson",
					 * 			"name": "Peterson",
					 * 			"id": "1000000079113"
					 * 		},
					 * 		"$se_module": "Leads",
					 * 		"Modified_By": {
					 * 			"name": "asd devvv",
					 * 			"id": "1000000030132"
					 * 		},
					 * 		"$size": null,
					 * 		"$process_flow": false,
					 * 		"$voice_note": false,
					 * 		"id": "1000000080035",
					 * 		"Created_By": {
					 * 			"name": "asd devvv",
					 * 			"id": "1000000030132"
					 * 		},
					 * 		"Note_Title": "",
					 * 		"Note_Content": "Deal closed"
					 * 	},
					 * 	{
					 * 		"$approval": {
					 * 			"delegate": false,
					 * 			"approve": false,
					 * 			"reject": false
					 * 		},
					 * 		"Owner": {
					 * 			"name": "asd devvv",
					 * 			"id": "1000000030132"
					 * 		},
					 * 		"Modified_Time": "2017-02-02T19:42:12+05:30",
					 * 		"$attachments": [],
					 * 		"Created_Time": "2017-02-02T19:42:12+05:30",
					 * 		"$followed": false,
					 * 		"Parent_Id": {
					 * 			"First_Name": null,
					 * 			"Last_Name": "Peterson",
					 * 			"name": "Peterson",
					 * 			"id": "1000000079113"
					 * 		},
					 * 		"$se_module": "Leads",
					 * 		"Modified_By": {
					 * 			"name": "asd devvv",
					 * 			"id": "1000000030132"
					 * 		},
					 * 		"$size": null,
					 * 		"$process_flow": false,
					 * 		"$voice_note": false,
					 * 		"id": "1000000080031",
					 * 		"Created_By": {
					 * 			"name": "asd devvv",
					 * 			"id": "1000000030132"
					 * 		},
					 * 		"Note_Title": "",
					 * 		"Note_Content": "Call Scheduled on 5th jan"
					 * 	},
					 * 	{
					 * 		"$approval": {
					 * 			"delegate": false,
					 * 			"approve": false,
					 * 			"reject": false
					 * 		},
					 * 		"Owner": {
					 * 			"name": "asd devvv",
					 * 			"id": "1000000030132"
					 * 		},
					 * 		"Modified_Time": "2017-02-02T19:41:56+05:30",
					 * 		"$attachments": [],
					 * 		"Created_Time": "2017-02-02T19:41:56+05:30",
					 * 		"$followed": false,
					 * 		"Parent_Id": {
					 * 			"First_Name": null,
					 * 			"Last_Name": "Peterson",
					 * 			"name": "Peterson",
					 * 			"id": "1000000079113"
					 * 		},
					 * 		"$se_module": "Leads",
					 * 		"Modified_By": {
					 * 			"name": "asd devvv",
					 * 			"id": "1000000030132"
					 * 		},
					 * 		"$size": null,
					 * 		"$process_flow": false,
					 * 		"$voice_note": false,
					 * 		"id": "1000000080025",
					 * 		"Created_By": {
					 * 			"name": "asd devvv",
					 * 			"id": "1000000030132"
					 * 		},
					 * 		"Note_Title": "",
					 * 		"Note_Content": "Followup Required"
					 * 	}
					 * ]
					 */
					getRelatedRecords :function(data)
					{
						var Entity = data.Entity;
						var RecordID = data.RecordID;
						var relatedListSysRef = data.RelatedList;
						return getRecord(Entity,RecordID,relatedListSysRef);
					},
					/**
					 * @function updateRelatedRecords
					 * @description To update the relation between the records
					 * @param {object} config - Configuration Object
					 * @param {String} config.Entity - 	SysRefName of the module. 
					 * @param {String} config.RecordID - RecordID to associate the notes. 
					 * @param {String} config.RelatedListName - 	SysRefName of the relatedList. 
					 * @param {String} config.RelatedRecordID - 	Related Record ID
					 * @param {String} config.APIData - 	Data to be updated in the related record
					 * @return {Promise} Resolved user matching userID 
					 * @memberof ZOHO.CRM.API
					 * @example
					 *  var APIData = {
					 * 	Description:"Test description"
					 *  }
					 *  ZOHO.CRM.API.updateRelatedRecords({Entity:"Leads",RecordID:"1000000079113",RelatedList:"Campaigns",RelatedRecordID:"1000000080041",APIData:APIData})
					 *  .then(function(data){
					 *      console.log(data)
					 *  })
					 * //prints
					 * [
					 *   {
					 *     "code": "SUCCESS",
					 *     "details": {
					 *       "id": 1000000080041
					 *     },
					 *     "message": "relation updated",
					 *     "status": "success"
					 *   }
					 * ]
					 */
					updateRelatedRecords :function(data)
					{
						var Entity = data.Entity;
						var RecordID = data.RecordID;
						var RelatedList = data.RelatedList;
						var RelatedRecordID = data.RelatedRecordID;
						var APIData = data.APIData;
						return updateRelatedRecord(Entity,RecordID,RelatedList,RelatedRecordID,APIData);
					},
					/**
					 * @function delinkRelatedRecord
					 * @description To delink the relation between the records
					 * @param {object} config - Configuration Object
					 * @param {String} config.Entity - 	SysRefName of the module. 
					 * @param {String} config.RecordID - RecordID to associate the notes. 
					 * @param {String} config.RelatedListName - 	SysRefName of the relatedList. 
					 * @param {String} config.RelatedRecordID - 	Related Record ID
					 * @return {Promise} Resolved user matching userID 
					 * @memberof ZOHO.CRM.API
					 * @example
					 *  ZOHO.CRM.API.delinkRelatedRecord({Entity:"Leads",RecordID:"1000000079113",RelatedList:"Campaigns",RelatedRecordID:"1000000080041"})
					 *  .then(function(data){
					 *      console.log(data)
					 *  })
					 * //prints
					 * [
					 *   {
					 *     "code": "SUCCESS",
					 *     "details": {
					 *       "id": 1000000080041
					 *     },
					 *     "message": "relation updated",
					 *     "status": "success"
					 *   }
					 * ]
					 */
					delinkRelatedRecord :function(data)
					{
						var Entity = data.Entity;
						var RecordID = data.RecordID;
						var RelatedList = data.RelatedList;
						var RelatedRecordID = data.RelatedRecordID;
						return deleteRelatedRecord(Entity,RecordID,RelatedList,RelatedRecordID);
					},
					/**
					 * @function attachFile
					 * @description To delink the relation between the records
					 * @param {object} config - Configuration Object
					 * @param {String} config.Entity - 	SysRefName of the module. 
					 * @param {String} config.RecordID - RecordID to associate the notes.  
					 * @param {object} config.File - 	File Object
					 * @param {String} config.File.Name - 	File Name
					 * @param {object} config.File.Content - 	File Content
					 * @return {Promise} Resolved user Upload acknowledgement 
					 * @memberof ZOHO.CRM.API
					 * @example
					 * 
					 * ZOHO.CRM.API.attachFile({Entity:"Leads",RecordID:"1000000031092",File:{Name:"myFile.txt",Content:blob}}).then(function(data){
					 * 	console.log(data);
					 * });
					 * //prints
					 *{
					 *  "data": [
					 *    {
					 *      "code": "SUCCESS",
					 *      "details": {
					 *        "Modified_Time": "2017-12-20T14:22:30+05:30",
					 *        "Modified_By": {
					 *          "name": "NareshTesting",
					 *          "id": "1000000031157"
					 *        },
					 *        "Created_Time": "2017-12-20T14:22:30+05:30",
					 *        "id": "1000000044106",
					 *        "Created_By": {
					 *          "name": "NareshTesting",
					 *          "id": "1000000031157"
					 *        }
					 *      },
					 *      "message": "attachment uploaded successfully",
					 *      "status": "success"
					 *    }
					 *  ]
					 *}
					 * */
					attachFile :function(data)
					{
						var Entity = data.Entity;
						var RecordID = data.RecordID;
						var File = data.File;
						var data ={
								FileName:File.Name,
								FileData:File.Content
						}
						return createRecord(Entity,data,RecordID,"ATTACHMENT");
					},
					/**
					 * @function getOrgVariable
					 * @memberof ZOHO.CRM.API
					 * @description get plugins configuration data
					 * @returns {Promise} Resolved with Plugin Configuration
					 * @example
					 * ZOHO.CRM.CONFIG.getOrgVariable("variableNamespace").then(function(data){
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
						return config("VARIABLE",nameSpace);
					},
				},
				/**
				 * @module ZOHO.CRM.UI
				 */
				UI:
				{
					/**
					 * @namespace ZOHO.CRM.UI
					 */
					/**
					 * @function resize
					 * @description Resize Widget to the given dimensions
					 * @param {Object} dimensions - Dimension of Dialer.
					 * @param {Integer} dimensions.height - Height in px
					 * @param {Integer} dimensions.width - Width in px
					 * @returns {Promise} resolved with true | false
					 * @memberof ZOHO.CRM.UI
					 */
					Resize : function(width , height){
						var data = {
								action	: "RESIZE",
								data : {
									width:width,
									height:height
								}
						};
						return manipulateUI(data);
					},
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
										telephony : "MAXIMIZE"
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
										telephony : "MINIMIZE"
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
										telephony : "NOTIFY"
									}	
							};
							return manipulateUI(data);
						},
					},
					/**
					 * @namespace ZOHO.CRM.UI.Record
					 */
					Record:{
						/**
						 * @function open
						 * @description Open DetailPage of the specified Record
						 * @param {object} data - Configuration Object
						 * @param {String} data.Entity - 	SysRefName of the module. 
						 * @param {String} data.RecordID - RecordID to open  
						 * @returns {Promise} resolved with true | false
						 * @memberof ZOHO.CRM.UI.Record
						 * @example
						 * ZOHO.CRM.UI.Record.open({Entity:"Leads",RecordID:"1000000036062"})
						 * .then(function(data){
						 *     console.log(data)
						 * })
						 */
						open : function(data)
						{
							/*
							 * fetch TabName from sysrefName 
							 */
							var data = {
									action	: {
										record : "OPEN"
									},
									data:{
										Entity:data.Entity,
										RecordID:data.RecordID
									}
							};
							return manipulateUI(data);
						},
						/**
						 * @function edit
						 * @description open EditPage of the specified Record
						 * @param {object} data - Configuration Object
						 * @param {String} data.Entity - 	SysRefName of the module. 
						 * @param {String} data.RecordID - RecordID to open  
						 * @returns {Promise} resolved with true | false
						 * @memberof ZOHO.CRM.UI.Record
						 * @example
						 * ZOHO.CRM.UI.Record.edit({Entity:"Leads",RecordID:"1000000036062"})
						 * .then(function(data){
						 *     console.log(data)
						 * })
						 */
						edit : function(data)
						{
							/*
							 * fetch TabName from sysrefName 
							 */
							var data = {
									action	: {
										record : "EDIT"
									},
									data:{
										Entity:data.Entity,
										RecordID:data.RecordID
									}
							};
							return manipulateUI(data);
						},
						/**
						 * @function create
						 * @description Open CreatePage of the specified Record
						 * @param {object} data - Configuration Object
						 * @param {String} data.Entity - 	SysRefName of the module.   
						 * @returns {Promise} resolved with true | false
						 * @memberof ZOHO.CRM.UI.Record
						 * @example
						 * ZOHO.CRM.UI.Record.create({Entity:"Leads"})
						 * .then(function(data){
						 *     console.log(data)
						 * })
						 */
						create : function(data)
						{
							/*
							 * fetch TabName from sysrefName 
							 */
							var data = {
									action	: {
										record : "CREATE"
									},
									data:{
										Entity:data.Entity,
										RecordID:data.RecordID
									}
							};
							return manipulateUI(data);
						},
						/**
						 * @function populate
						 * @description Populate the given data in the entity form
						 * @param {object} RecordData 
						 * @returns {Promise} resolved with true | false
						 * @memberof ZOHO.CRM.UI.Record
						 * @example
						 * ZOHO.CRM.UI.Record.populate({Annual_Revenue:"500",Description:"Populating test data",Phone:"85663655785"})
						 * .then(function(data){
						 *     console.log(data)
						 * })
						 */
						populate : function(recordData)
						{
							/*
							 * fetch TabName from sysrefName 
							 */
							var data = {
									action	: {
										record : "POPULATE"
									},
									data:recordData
							};
							return manipulateUI(data);
						}
					},
					/**
					 * @namespace ZOHO.CRM.UI.Popup
					 */
					Popup:{
						/**
						 * @function close
						 * @description Close Widget Popup 
						 * @returns {Promise} resolved with true | false
						 * @memberof ZOHO.CRM.UI.Popup
						 * @example
						 * ZOHO.CRM.UI.Popup.close()
						 * .then(function(data){
						 *     console.log(data)
						 * })
						 */
						close : function()
						{
							/*
							 * fetch TabName from sysrefName 
							 */
							var data = {
									action	: {
										popup : "CLOSE"
									}
							};
							return manipulateUI(data);
						},
						/**
						 * @function closeReload
						 * @description Close Widget Popup and reload the View
						 * @returns {Promise} resolved with true | false
						 * @memberof ZOHO.CRM.UI.Popup
						 * @example
						 * ZOHO.CRM.UI.Popup.closeReload()
						 * .then(function(data){
						 *     console.log(data)
						 * })
						 */
						closeReload : function()
						{
							/*
							 * fetch TabName from sysrefName 
							 */
							var data = {
									action	: {
										popup : "CLOSE_RELOAD"
									}
							};
							return manipulateUI(data);
						},
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
					 * @param {String} nameSpace - NameSpace of Connector API to invoke
					 * @param {Object} data - Connector API Data
					 * @param {Object} data.VARIABLES - Dynamic Data represented by placeholders in connectorAPI
					 * @param {Object} data.CONTENT_TYPE - ContentType - multipart for multipart request
					 * @param {Array} data.PARTS - For multipart request provide parts config here
					 * @param {Object} data.FILE - To include a file in your multipart request 
					 * @example
					 * var data =	{
					 * 	 "VARIABLES":{
					 *           "apikey" : "*********", 
					 *           "First_Name" : "Naresh", 
					 *           "Last_Name" : "Babu", 
					 *           "email" : "naresh.babu@zohocorp.com"
					 *         }
					 *     }
					 * ZOHO.CRM.CONNECTOR.invokeAPI("MailChimp.sendSubscription",data)
					 * .then(function(data){
					 *     console.log(data)
					 * })
					 * @example
					 *  
					 * var data = {
					 *     "CONTENT_TYPE":"multipart",
					 *     "PARTS":[
					 *               {
					 *                   "headers": {  
					 *                       "Content-Type": "application/json"
					 *                   },
					 *                   "content": {"mimeType": "application/vnd.google-apps.folder", "title": "NareshFolder"
					 *                   }
					 *               }
					 *             ]
					 *   }
					 *   ZOHO.CRM.CONNECTOR.invokeAPI("ex10.testconnector.uplaodfile",data)
					 *   .then(function(data){
					 *       console.log(data)
					 *   })
					 * @example
					* var file = document.getElementById("File").files[0];
					* var fileType;
					*   if (file.type === "application/pdf"){
					*     fileType = file.type;
					*   }
					*   else if(file.type === "image/jpeg"){
					*     fileType = file.type;
					*   }
					*   else if(file.type === "text/plain"){
					*     fileType = "application/msword";
					*   }
					*   else if(file.type === ""){
					*     fileType = "application/msword";
					*   }
					
					*   console.log(file);
					*   var data = {
					*     "VARIABLES":{
					*       "pathFileName" : "/Zoho CRM/myFile/"+file.name
					*     },
					*     "CONTENT_TYPE":"multipart",
					*     "PARTS":[
					*               {
					*                 "headers": {  
					*                   "Content-Type": "application/json"
					*                 },
					*                 "content": {"mimeType": fileType,"description": "TestFile to upload", "title":file.name}
					*               },{
					*                 "headers": {
					*                   "Content-Disposition": "file;"
					*                 },
					*                 "content": "__FILE__"
					*               }
					*             ],
					*     "FILE":{
					*       "fileParam":"content",
					*       "file":file
					*     },
					*   }
					*   console.log(data);
					*   ZOHO.CRM.CONNECTOR.invokeAPI("ex10.testconnector.uplaodfile",data)
					*   .then(function(data){
					*       console.log(data)
					*   })

					 */
					invokeAPI:function(nameSpace,data){
						return remoteCall(nameSpace,data,"CONNECTOR");
					}
				}
			};
		})()
	}
})();