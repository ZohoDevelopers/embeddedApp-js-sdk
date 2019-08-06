/**
 * @module ZOHO.CRM
 */
var ZOHO = (function() {
    var appSDK;
    var eventListenerMap = {};
    var isInitTriggered = false;
    var initPromise = undefined;
    return {
        embeddedApp: {
            on: function(event, fn) {
                eventListenerMap[event] = fn;
                if(appSDK && "function" == typeof fn){
                    /*
                    * subscribe listener to event in SDK Side
                    */
                    appSDK.getContext().Event.Listen(event,fn);
                }
            },
            init: function() {
            	if(!isInitTriggered)
            	{
            		isInitTriggered = true;
                    appSDK = new ZSDK;
                    var promiseResolve;
                    initPromise = new Promise(function(resolve, reject) {
                        promiseResolve = resolve;
                    });
                    appSDK.OnLoad(function() {
                        promiseResolve();
                    });
                    for (var key in eventListenerMap) {
                        appSDK.getContext().Event.Listen(key, eventListenerMap[key]);
                    }
            	}
                return initPromise;
            }
        },
        CRM: (function() {
            function newRequestPromise(data) {
                /*
                 * Sdk Version Maintainance
                 */
                data['sdkVersion'] = '1';
                return appSDK.getContext().Event.Trigger('CRM_EVENT', data, true);
            }
            // file upload issue fie
            function createNewFileObj(file)
            {
				var oldfile = file;
				var newfile = new File([oldfile], oldfile.name, { type: oldfile.type });
	         	return newfile;
            }
            function executeQuery(APIdata) 
            {
                var data = {
                    category: "QUERY",
                    APIData: APIdata
                };
                return newRequestPromise(data);
            }
            function getRole(type, roleId)
            {
                var data = {
                    category: "ROLES"
                };
                roleId && (data.roleId = roleId);
                return newRequestPromise(data);
            }
            function createRecord(Entity, APIdata, RecordID, RelatedEntity) {
            	if(APIdata.FileData)
                {
            	  var newfileObj = createNewFileObj(APIdata.FileData);
                  APIdata.FileData = newfileObj;
                }
                var data = {
                    category: "CREATE", //no i18n
                    Entity: Entity,
                    RelatedID: RecordID,
                    APIData: APIdata
                };
                data.type = RelatedEntity || "RECORD"
                return newRequestPromise(data);

            };
            function pushHistoryState(data)
            {
                if(typeof data =="object")
                {
                    var APIData = {};
                    APIData.data = data;
                    APIData.category = "PUSH_DATA_WIDGET";
                    return newRequestPromise(APIData);
                }
                else
                {
                    return Promise.reject("JSON object only supported");
                }
            }
            function getRecord(Entity, recordID, relatedListSysRef) {
                var data = {
                    category: "READ", //no i18n
                    APIData: {
                        Entity: Entity,
                        RecordID: recordID,
                        RelatedList: relatedListSysRef
                    }
                };
                return newRequestPromise(data);
            };
            function getBluePrint(APIData) {
                APIData.category = "BLUEPRINT" //no i18n
                return newRequestPromise(APIData);
            };
            function uploadFile(uploadFile)
            {
            	if(uploadFile instanceof File)
            	{
            		var newFile = createNewFileObj(uploadFile);
                    var data = {
                        FileData : newFile,
                        category : "FILES", //no i18n
                        type : "UPLOAD_FILE"
                    }
                    return newRequestPromise(data);
            	}
            	else
        		{
            		return Promise.reject("Input is not of type File")
        		}
            };
            function getFile(APIData)
            {
                APIData.category = "FILES";
                APIData.type = "DOWNLOAD_FILE"
                return newRequestPromise(APIData);
            }
            function getAllActions(APIData)
            {
                APIData.category = "APPROVALS";
                return newRequestPromise(APIData);
            }
            function getAllRecords(APIData) {
                var data = {
                    category: "READ",
                    APIData: APIData
                }
                return newRequestPromise(data);
            };

            function updateRecord(Entity, APIData) {
                var data = {
                    category: "UPDATE", //no i18n
                    type: "RECORD", //no i18n
                    Entity: Entity,
                    APIData: APIData
                };
                return newRequestPromise(data);
            };
            function updateVoiceURL(config) {
                var data = {
                    category: "UPDATE", //no i18n
                    type: "VOICE_URL", //no i18n
                    APIData: config
                };
                return newRequestPromise(data);
            };

            function getRelatedRecord(APIData)
            {
                var data = {
                    category: "READ",//no i18n
                    APIData: APIData //no i18n
                };
                return newRequestPromise(data);
            };

            function updateRelatedRecord(Entity, RecordID, RelatedList, RelatedRecordID, APIData) {
                if(APIData instanceof File)
                {
                	APIData = createNewFileObj(APIData);
                }
            	var data = {
                    category: "UPDATE", //no i18n
                    type: "RELATED_RECORD", //no i18n
                    Entity: Entity,
                    RecordID: RecordID,
                    RelatedList: RelatedList,
                    RelatedRecordID: RelatedRecordID,
                    APIData: APIData
                };
                return newRequestPromise(data);
            };

            function updateNotes(Entity, RecordID, RelatedRecordID, APIData) {
                var data = {
                    category: "UPDATE", //no i18n
                    type: "NOTES", //no i18n
                    Entity: Entity,
                    RecordID: RecordID,
                    RelatedRecordID: RelatedRecordID,
                    APIData: APIData
                };
                return newRequestPromise(data);
            };

            function deleteRecord(Entity, RecordID) {
                var data = {
                    category: "DELETE", //no i18n
                    type: "RECORD", //no i18n
                    Entity: Entity,
                    RecordID: RecordID
                };
                return newRequestPromise(data);
            };

            function deleteRelatedRecord(Entity, RecordID, RelatedList, RelatedRecordID) {
                var data = {
                    category: "DELETE", //no i18n
                    type: "RELATED_RECORD", //no i18n
                    Entity: Entity,
                    RecordID: RecordID,
                    RelatedList: RelatedList,
                    RelatedRecordID: RelatedRecordID,
                };
                return newRequestPromise(data);
            }

            function searchRecord(data) {
                var data = {
                    category: "SEARCH", //no i18n
                    APIData:data
                };
                return newRequestPromise(data);
            }   
            function sendMail(data)
            {
                var data = {
                    category:"MAIL",
                    APIData:data
                }
                return newRequestPromise(data);
            }
            function getAllProfiles(Category, Type) {
                var data = {
                    category: Category,
                    type: Type
                };
                return newRequestPromise(data);
            }

            function getProfile(Category, Type, ID) {
                var data = {
                    category: Category,
                    type: Type,
                    ID: ID
                };
                return newRequestPromise(data);
            }

            function updateProfile(Category, Type, ID, APIData) {
                var data = {
                    category: Category,
                    type: Type,
                    ID: ID,
                    APIData: APIData
                };
                return newRequestPromise(data);
            }

            function constructQueryString(source) {
                var array = [];

                for (var key in source) {
                    array.push(encodeURIComponent(key) + "=" + encodeURIComponent(source[key]));
                }
                return array.join("&");
            };

            function remoteCall(method, requestData, type) {
            	if(requestData.FILE)
        		{
            		var newfileobj = createNewFileObj(requestData.FILE.file);
            		requestData.FILE.file = newfileobj;
        		}
                var reqData = undefined;
                if (!type) {
                    var url = requestData.url;
                    var params = requestData.params;
                    var headers = requestData.headers;
                    var body = requestData.body;
                    var Parts = requestData.PARTS;
                    var partBoundary = requestData.PART_BOUNDARY;
                    var ContentType = requestData.CONTENT_TYPE;
                    var responseType = requestData.RESPONSE_TYPE;
                    var file = requestData.FILE;
                    if (!url) {
                        throw { Message: "Url missing" }
                    }
                    if (params) {
                        var queryString = constructQueryString(params);
                        url += (url.indexOf("?") > -1 ? "&" : "?") + queryString;
                    }
                    reqData = {
                        url: url,
                        Header: headers,
                        Body: body,
                        CONTENT_TYPE: ContentType,
                        RESPONSE_TYPE: responseType,
                        PARTS: Parts,
                        PARTS_BOUNDARY:partBoundary,
                        FILE: file
                    }
                } else {
                    reqData = requestData;
                }

                var data = {
                    category: "CONNECTOR", //no i18n
                    nameSpace: method,
                    data: reqData,
                    type:type
                };
                return newRequestPromise(data);
            };

            function manipulateUI(data) {
                var config = {
                    category: "UI"
                };
                $.extend(data, config);
                return newRequestPromise(data);
            }

            function config(type, nameSpace,requestData) {
                var data = {
                    category: "CONFIG",
                    type: type,
                    nameSpace: nameSpace,
                    APIData : requestData
                };
                return newRequestPromise(data);
            }

            function action(type, obj) {
                var data = {
                    category: "ACTION",
                    type: type,
                    object: obj
                };
                return newRequestPromise(data);
            }

            function user(data) {
                var promiseData = {
                    category: "USER",
                };
                if (data.ID) {
                    promiseData.ID = data.ID
                } else if (data.Type) {
                    promiseData.Type = data.Type
                    if (data.page) {
                        promiseData.page = data.page
                    }
                    if (data.per_page) {
                        promiseData.per_page = data.per_page
                    }
                }
                return newRequestPromise(promiseData);
            }

            function getMeta(data) {
                var reqJson = {
                    category: "META",
                    type: data.type,
                    subType : data.subType,
                    Entity: data.Entity,
                    Id: data.Id
                }
                return newRequestPromise(reqJson);

            }
            var HTTPRequest = {
                POST: "wget.post",
                GET: "wget.get",
                PUT: "wget.put",
                PATCH: "wget.patch",
                DELETE: "wget.delete"
            }
            return {
                ACTION: {
                    setConfig: function(obj) {
                        return action("CUSTOM_ACTION_SAVE_CONFIG", obj);
                    },
                    enableAccountAccess: function(obj) {
                        return action("ENABLE_ACCOUNT_ACCESS", obj);
                    }
                },
                /**
                 * @namespace ZOHO.CRM.FUNCTIONS
                 */
                FUNCTIONS: {
                    /**
                     * @function execute
                     * @description Invoke a Function
                     * @returns {Promise} resolved with response of the function executed
                     * @memberof ZOHO.CRM.FUNCTIONS
                     * @param {String} func_name - Function Name
                     * @param {Object} req_data - Request Data
                     * @example
                     * var func_name = "custom_function4";
                     * var req_data ={
                     *   "arguments": JSON.stringify({
                     *       "mailid" : "siprxx.xxx@xxxx.com" 
                     *   })
                     * };
                     * ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     *
                     * //Prints
                     * {
                     *   "code": "success",
                     *   "details": {
                     *     "type":"VOID",
                     *       "output": null,
                     *       "id": "944000000003001"
                     *   },
                     *   "message": "function executed successfully"
                     * }
                     */
                   execute : function(func_name, req_data){
                    var request = {};
                    req_data.auth_type = "oauth";
                    request.data = req_data;
                    var data = {
                    category : "FUNCTIONS_EXECUTE",//no i18n
                    customFunctionName : func_name,
                    data : request
                    };
                    return newRequestPromise(data);
                    }
                },

                /**
                 * @namespace ZOHO.CRM.CONFIG
                 */
                CONFIG: {
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
                    getOrgInfo: function(nameSpace) {
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
                     *   "email": "naresh.babu+dev1@zylker.com",
                     *   "zuid": "4253443",
                     *   "status": "active"
                     * }
                     *
                     */
                    getCurrentUser: function() {
                        return config("CURRENT_USER");
                    },
                    /*
                     * @function GetCurrentEnvironment
                     * @memberof ZOHO.CRM.CONFIG
                     * @description get Current org info
                     * @returns {Promise} Resolved with User info
                     * @example
                     * ZOHO.CRM.CONFIG.GetCurrentEnvironment().then(function(data){
                     *  console.log(data);
                     * });
                     * 
                     * //prints 
                     *
                     *
                     *{
                     *  "deployment": "US",
                     *  "ZGID": 1001244313,
                     *  "ZUID": "1001244314",
                     *  "appDetails": {
                     *    "appUrl": "https://vettti.ucrm.com"
                     *  }
                     *}
                     *
                     */
                    GetCurrentEnvironment: function() {
                        return config("ORG_LEVEL_INFO");
                    },
                    /*
                    * @function createUser
                    * @memberof ZOHO.CRM.CONFIG
                    * @description create user 
                    * @param {Object} config - Configuration Object.
                    * @returns {Promise} Resolved with user details
                    * @example
                    *
                    *var config = {
                    *  "users": [
                    *    {
                    *      "last_name": "TestUser2",
                    *      "email": "test_account20@zohocorp.com",
                    *      "role": "111126000000030021",
                    *      "profile": "111126000000030027"
                    *    }
                    *  ]
                    *}
                    *
                    *
                    *
                    * ZOHO.CRM.CONFIG.createUser(config).then(function(data){
                    *    console.log(data)
                    * });
                    *
                    *
                    * //prints
                    *
                    *{
                    *  "users": [
                    *    {
                    *      "code": "SUCCESS",
                    *      "details": {
                    *        "id": "111155000000032661"
                    *      },
                    *      "message": "User added",
                    *      "status": "success"
                    *    }
                    *  ]
                    *}
                    *
                    createUser: function(data)
                    {
                        return config("CREATEUSER","",data);
                    },
                    * @function editUser
                    * @memberof ZOHO.CRM.CONFIG
                    * @description edit user details
                    * @param {Object} config - Configuration Object.
                    * @param {String} config.id - user id
                    * @param {String} config.userobject - json object to update the user details
                    * @returns {Promise} Resolved with user details
                    * @example
                    *
                    *var userdetails = 
                    *{
                    *  "users": [
                    *    {
                    *      "website": "https://www.zoho.com/docs",
                    *      "fax": "test",
                    *      "Mobile": 1234567890,
                    *      "Phone": 1234567890
                    *    }
                    *  ]
                    *}
                    *
                    * var config = 
                    *{
                    *   id:"6000000031085",
                    *   userobject:userdetails
                    *}
                    *
                    *ZOHO.CRM.CONFIG.editUser(config).then(function(data){
                    *  console.log(data);
                    *});
                    *
                    *
                    * //prints
                    *
                    *{
                    *  "users": [
                    *    {
                    *      "code": "SUCCESS",
                    *      "details": {
                    *        "id": "111155000000032680"
                    *      },
                    *      "message": "User updated",
                    *      "status": "success"
                    *    }
                    *  ]
                    *}
                    *
                    editUser: function(data)
                    {
                        return config("EDITUSER","",data);
                    },
                    * @function deleteUser
                    * @memberof ZOHO.CRM.CONFIG
                    * @description delete user from crm
                    * @params {object} config - details of the delete user
                    * @params {String} config.id - user id 
                    * @returns {Promise} Resolved with user details
                    * @example
                    *
                    * var config = 
                    *{
                    *    id:"6000000032001"
                    *}
                    *
                    *
                    * ZOHO.CRM.CONFIG.deleteUser(config).then(function(data){
                    *    console.log(data);
                    * });
                    *
                    *
                    * //prints
                    *
                    *{
                    *  "users": [
                    *    {
                    *      "code": "SUCCESS",
                    *      "details": {},
                    *      "message": "User deleted",
                    *      "status": "success"
                    *    }
                    *  ]
                    *}
                    *
                    deleteUser: function(data)
                    {
                        return config("DELETEUSER","",data);
                    }*/
                },
                /**
                 * @namespace ZOHO.CRM.META
                 */
                META: {
                    /**
                     * @function getFields
                     * @memberof ZOHO.CRM.META
                     * @description get field lables and api names
                     * @param {Object} config - Configuration Object.
                     * @param {String} config.Entity - SysRefName of the module.
                     * @returns {Promise} Resolved with data of record matching with Entity and type
                     * @example
                     * ZOHO.CRM.META.getFields({"Entity":"Contacts"}).then(function(data){
                     * console.log(data);	
                     * });
                     *
                     *
                     * //prints
                     *
                     *
                     *{
                     *fields:[
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
                     *}
                     */
                    getFields: function(data) {

                        data.type = "FIELD_LIST";
                        return getMeta(data);

                    },
                    /**
                     * @function getModules
                     * @memberof ZOHO.CRM.META
                     * @description get Modules list
                     * @returns {Promise} Resolved with data of all modules
                     * @example
                     * ZOHO.CRM.META.getModules().then(function(data){
                     * console.log(data);	
                     * });
                     *
                     *
                     * //prints
                     *
                     *
                     *{
					 *  "modules": [{
					 *      "global_search_supported": false,
					 *      "deletable": false,
					 *      "creatable": false,
					 *      "modified_time": null,
					 *      "plural_label": "Home",
					 *      "presence_sub_menu": false,
					 *      "id": "457154000000000123",
					 *      "visible": true,
				 	 *      "visibility": 1,
					 *      "convertable": false,
					 *      "editable": false,
					 *      "profiles": [{
					 *          "name": "Administrator",
					 *          "id": "457154000000015972"
					 *        },
					 *        {
					 *          "name": "Standard",
					 *          "id": "457154000000015975"
					 *        }
					 *      ],
					 *      "filter_supported": false,
					 *      "web_link": null,
					 *      "sequence_number": 1,
					 *      "singular_label": "Home",
					 *      "viewable": true,
					 *      "api_supported": false,
					 *      "api_name": "Home",
					 *      "quick_create": false,
					 *      "modified_by": null,
					 *      "generated_type": "default",
					 *      "feeds_required": false,
					 *      "scoring_supported": false,
					 *      "arguments": [],
					 *      "module_name": "Home",
					 *      "business_card_field_limit": 0,
					 *      "parent_module": {}
					 *    },
					 *    {
					 *      "global_search_supported": false,
					 *      "deletable": false,
					 *      "creatable": false,
					 *      "modified_time": null,
					 *      "plural_label": "SalesInbox",
					 *      "presence_sub_menu": false,
					 *      "id": "457154000000129001",
					 *      "visible": true,
					 *      "visibility": 1,
					 *      "convertable": false,
					 *      "editable": false,
					 *      "profiles": [{
					 *          "name": "Administrator",
					 *          "id": "457154000000015972"
				 	 *        },
					 *        {
			 		 *          "name": "Standard",
				 	 *          "id": "457154000000015975"
					 *        }
					 *      ],
					 *      "filter_supported": false,
					 *      "web_link": null,
				 	 *      "sequence_number": 2,
					 *      "singular_label": "SalesInbox",
					 *      "viewable": true,
					 *      "api_supported": false,
					 *      "api_name": "SalesInbox",
					 *      "quick_create": false,
					 *      "modified_by": null,
					 *      "generated_type": "default",
					 *      "feeds_required": false,
					 *      "scoring_supported": false,
					 *      "arguments": [],
					 *      "module_name": "SalesInbox",
					 *      "business_card_field_limit": 0,
				 	 *      "parent_module": {}
					 *    },
					 *    {
					 *      "global_search_supported": false,
					 *      "deletable": false,
					 *      "creatable": false,
					 *      "modified_time": null,
					 *      "plural_label": "Feeds",
					 *      "presence_sub_menu": false,
					 *      "id": "457154000000059001",
					 *      "visible": true,
					 *      "visibility": 1,
					 *      "convertable": false,
					 *      "editable": false,
				 	 *      "profiles": [],
			 		 *      "filter_supported": false,
					 *      "web_link": null,
					 *      "sequence_number": 3,
					 *      "singular_label": "Feeds",
				 	 *      "viewable": true,
			 		 *      "api_supported": false,
					 *      "api_name": "Feeds",
					 *      "quick_create": false,
					 *      "modified_by": null,
					 *      "generated_type": "default",
					 *      "feeds_required": false,
					 *      "scoring_supported": false,
					 *      "arguments": [],
					 *      "module_name": "Feeds",
					 *      "business_card_field_limit": 0,
					 *      "parent_module": {}
					 *    },
					 *    {
					 *      "global_search_supported": true,
					 *      "deletable": true,
					 *      "creatable": true,
					 *      "modified_time": "2018-10-23T11:39:36+05:30",
					 *      "plural_label": "Leads",
					 *      "presence_sub_menu": true,
					 *      "id": "457154000000000125",
					 *      "visible": true,
					 *      "visibility": 1,
					 *      "convertable": true,
					 *      "editable": true,
					 *      "profiles": [{
					 *          "name": "Administrator",
					 *          "id": "457154000000015972"
					 *        },
					 *        {
					 *          "name": "Standard",
					 *          "id": "457154000000015975"
					 *        }
					 *      ],
					 *      "filter_supported": true,
					 *      "web_link": null,
					 *      "sequence_number": 4,
					 *      "singular_label": "Lead",
					 *      "viewable": true,
					 *      "api_supported": true,
					 *      "api_name": "Leads",
					 *      "quick_create": true,
					 *      "modified_by": {
					 *        "name": "NareshAutomation",
					 *        "id": "457154000000148011"
					 *      },
					 *      "generated_type": "default",
					 *      "feeds_required": false,
					 *      "scoring_supported": true,
					 *      "arguments": [],
					 *      "module_name": "Leads",
					 *      "business_card_field_limit": 5,
					 *      "parent_module": {}
					 *    },
					 *    {
					 *      "global_search_supported": true,
					 *      "deletable": true,
					 *      "creatable": true,
					 *      "modified_time": null,
					 *      "plural_label": "Accounts",
					 *      "presence_sub_menu": true,
					 *      "id": "457154000000000127",
					 *      "visible": true,
					 *      "visibility": 1,
					 *      "convertable": false,
					 *      "editable": true,
					 *      "profiles": [{
					 *          "name": "Administrator",
					 *          "id": "457154000000015972"
					 *        },
					 *        {
					 *          "name": "Standard",
					 *          "id": "457154000000015975"
					 *        }
					 *      ],
					 *      "filter_supported": true,
					 *      "web_link": null,
					 *      "sequence_number": 5,
					 *      "singular_label": "Account",
					 *      "viewable": true,
					 *      "api_supported": true,
					 *      "api_name": "Accounts",
					 *      "quick_create": true,
					 *      "modified_by": null,
					 *      "generated_type": "default",
					 *      "feeds_required": false,
					 *      "scoring_supported": true,
					 *      "arguments": [],
					 *      "module_name": "Accounts",
					 *      "business_card_field_limit": 5,
					 *      "parent_module": {}
					 *    }
					 *  ]
					 *}
					 *
                     */
                    getModules: function() {
                        var data = {
                            type: "MODULE_LIST"
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
                     * ZOHO.CRM.META.getAssignmentRules({"Entity":"Contacts"}).then(function(data){
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
                    getAssignmentRules: function(data) {
                        data.type = "ASSIGNMENT_RULES";
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
                     * ZOHO.CRM.META.getLayouts({"Entity":"Contacts"}).then(function(data){
                     * console.log(data);	
                     * });
                     * @example
                     * ZOHO.CRM.META.getLayouts({"Entity":"Contacts","LayoutId":"5000000000169"}).then(function(data){
                     * console.log(data);	
                     * });
                     * @example
                     * //prints
                     *{
                     *  "layouts": [
                     *    {
                     *      "created_time": null,
                     *      "modified_time": null,
                     *      "visible": true,
                     *      "name": "Standard",
                     *      "modified_by": null,
                     *      "profiles": [
                     *        {
                     *          "default": true,
                     *          "name": "Administrator",
                     *          "id": "3000000029725"
                     *        },
                     *        {
                     *          "default": true,
                     *          "name": "Standard",
                     *          "id": "3000000029728"
                     *        }
                     *      ],
                     *      "id": "3000000000169",
                     *      "created_by": null,
                     *      "sections": [
                     *        {
                     *          "display_label": "Contact Information",
                     *          "sequence_number": 1,
                     *          "column_count": 2,
                     *          "name": "Contact Information",
                     *          "fields": [
                     *            {
                     *              "json_type": "jsonobject",
                     *              "field_label": "Contact Owner",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 8,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000673",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 120,
                     *              "column_name": "SMOWNERID",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 1,
                     *              "show_type": 7,
                     *              "api_name": "Owner",
                     *              "unique": {},
                     *              "data_type": "ownerlookup",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Lead Source",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 2,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000675",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 120,
                     *              "column_name": "LEADSOURCE",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 2,
                     *              "show_type": 7,
                     *              "api_name": "Lead_Source",
                     *              "unique": {},
                     *              "data_type": "picklist",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [
                     *                {
                     *                  "display_value": "-None-",
                     *                  "sequence_number": 1,
                     *                  "maps": [],
                     *                  "actual_value": "-None-"
                     *                },
                     *                {
                     *                  "display_value": "Advertisement",
                     *                  "sequence_number": 2,
                     *                  "maps": [],
                     *                  "actual_value": "Advertisement"
                     *                },
                     *                {
                     *                  "display_value": "Cold Call",
                     *                  "sequence_number": 3,
                     *                  "maps": [],
                     *                  "actual_value": "Cold Call"
                     *                },
                     *                {
                     *                  "display_value": "Employee Referral",
                     *                  "sequence_number": 4,
                     *                  "maps": [],
                     *                  "actual_value": "Employee Referral"
                     *                },
                     *                {
                     *                  "display_value": "External Referral",
                     *                  "sequence_number": 5,
                     *                  "maps": [],
                     *                  "actual_value": "External Referral"
                     *                },
                     *                {
                     *                  "display_value": "Partner",
                     *                  "sequence_number": 6,
                     *                  "maps": [],
                     *                  "actual_value": "Partner"
                     *                },
                     *                {
                     *                  "display_value": "Public Relations",
                     *                  "sequence_number": 7,
                     *                  "maps": [],
                     *                  "actual_value": "Public Relations"
                     *                },
                     *                {
                     *                  "display_value": "Trade Show",
                     *                  "sequence_number": 8,
                     *                  "maps": [],
                     *                  "actual_value": "Trade Show"
                     *                },
                     *                {
                     *                  "display_value": "Web Form",
                     *                  "sequence_number": 9,
                     *                  "maps": [],
                     *                  "actual_value": "Web Form"
                     *                },
                     *                {
                     *                  "display_value": "Search Engine",
                     *                  "sequence_number": 10,
                     *                  "maps": [],
                     *                  "actual_value": "Search Engine"
                     *                },
                     *                {
                     *                  "display_value": "Facebook",
                     *                  "sequence_number": 11,
                     *                  "maps": [],
                     *                  "actual_value": "Facebook"
                     *                },
                     *                {
                     *                  "display_value": "Twitter",
                     *                  "sequence_number": 12,
                     *                  "maps": [],
                     *                  "actual_value": "Twitter"
                     *                }
                     *              ],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "First Name",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 27,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000677",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 40,
                     *              "column_name": "FIRSTNAME",
                     *              "view_type": {
                     *                "view": false,
                     *                "edit": true,
                     *                "quick_create": true,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 3,
                     *              "show_type": 7,
                     *              "api_name": "First_Name",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Last Name",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": true,
                     *              "ui_type": 127,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000679",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 80,
                     *              "column_name": "LASTNAME",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": true,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 4,
                     *              "show_type": 7,
                     *              "api_name": "Last_Name",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Full Name",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 1,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000681",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 80,
                     *              "column_name": "FULLNAME",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": false,
                     *                "quick_create": false,
                     *                "create": false
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 5,
                     *              "show_type": 0,
                     *              "api_name": "Full_Name",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "jsonobject",
                     *              "field_label": "Account Name",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 4,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000683",
                     *              "custom_field": false,
                     *              "lookup": {
                     *                "display_label": "Contacts",
                     *                "api_name": "Contacts",
                     *                "module": {
                     *                  "api_name": "Accounts",
                     *                  "id": "3000000000043"
                     *                },
                     *                "id": "3000000003935"
                     *              },
                     *              "visible": true,
                     *              "length": 120,
                     *              "column_name": "ACCOUNTID",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": true,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 6,
                     *              "show_type": 7,
                     *              "api_name": "Account_Name",
                     *              "unique": {},
                     *              "data_type": "lookup",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "jsonobject",
                     *              "field_label": "Vendor Name",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 9,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000685",
                     *              "custom_field": false,
                     *              "lookup": {
                     *                "display_label": "Contacts",
                     *                "api_name": "Contacts",
                     *                "module": {
                     *                  "api_name": "Vendors",
                     *                  "id": "3000000000099"
                     *                },
                     *                "id": "3000000012263"
                     *              },
                     *              "visible": true,
                     *              "length": 120,
                     *              "column_name": "VENDORID",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 7,
                     *              "show_type": 7,
                     *              "api_name": "Vendor_Name",
                     *              "unique": {},
                     *              "data_type": "lookup",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Email",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 25,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000687",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 100,
                     *              "column_name": "EMAIL",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": true,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 8,
                     *              "show_type": 7,
                     *              "api_name": "Email",
                     *              "unique": {},
                     *              "data_type": "email",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Title",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 1,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000691",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 100,
                     *              "column_name": "TITLE",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 10,
                     *              "show_type": 7,
                     *              "api_name": "Title",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Department",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 1,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000693",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 50,
                     *              "column_name": "DEPARTMENT",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 11,
                     *              "show_type": 7,
                     *              "api_name": "Department",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Phone",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 33,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000695",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 50,
                     *              "column_name": "PHONE",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": true,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 12,
                     *              "show_type": 7,
                     *              "api_name": "Phone",
                     *              "unique": {},
                     *              "data_type": "phone",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Home Phone",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 33,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000697",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 30,
                     *              "column_name": "HOMEPHONE",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 13,
                     *              "show_type": 7,
                     *              "api_name": "Home_Phone",
                     *              "unique": {},
                     *              "data_type": "phone",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Other Phone",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 33,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000699",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 30,
                     *              "column_name": "OTHERPHONE",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 14,
                     *              "show_type": 7,
                     *              "api_name": "Other_Phone",
                     *              "unique": {},
                     *              "data_type": "phone",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Fax",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 35,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000701",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 30,
                     *              "column_name": "FAX",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 15,
                     *              "show_type": 7,
                     *              "api_name": "Fax",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Mobile",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 33,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000703",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 30,
                     *              "column_name": "MOBILE",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 16,
                     *              "show_type": 7,
                     *              "api_name": "Mobile",
                     *              "unique": {},
                     *              "data_type": "phone",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Date of Birth",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 24,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000705",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 20,
                     *              "column_name": "BIRTHDAY",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 17,
                     *              "show_type": 7,
                     *              "api_name": "Date_of_Birth",
                     *              "unique": {},
                     *              "data_type": "date",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Assistant",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 1,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000707",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 50,
                     *              "column_name": "ASSISTANT",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 18,
                     *              "show_type": 7,
                     *              "api_name": "Assistant",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Asst Phone",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 33,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000709",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 30,
                     *              "column_name": "ASSISTANTPHONE",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 19,
                     *              "show_type": 7,
                     *              "api_name": "Asst_Phone",
                     *              "unique": {},
                     *              "data_type": "phone",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Reports To",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 1,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000711",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 50,
                     *              "column_name": "REPORTSTO",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 20,
                     *              "show_type": 7,
                     *              "api_name": "Reports_To",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "boolean",
                     *              "field_label": "Email Opt Out",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 301,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000713",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 5,
                     *              "column_name": "EMAILOPTOUT",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": false,
                     *              "sequence_number": 21,
                     *              "show_type": 7,
                     *              "api_name": "Email_Opt_Out",
                     *              "unique": {},
                     *              "data_type": "boolean",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Skype ID",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 37,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000715",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 50,
                     *              "column_name": "SKYPEIDENTITY",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 22,
                     *              "show_type": 7,
                     *              "api_name": "Skype_ID",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "jsonobject",
                     *              "field_label": "Created By",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 20,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000717",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 120,
                     *              "column_name": "SMCREATORID",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": false,
                     *                "quick_create": false,
                     *                "create": false
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 23,
                     *              "show_type": 7,
                     *              "api_name": "Created_By",
                     *              "unique": {},
                     *              "data_type": "ownerlookup",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "jsonobject",
                     *              "field_label": "Modified By",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 20,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000719",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 120,
                     *              "column_name": "MODIFIEDBY",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": false,
                     *                "quick_create": false,
                     *                "create": false
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 24,
                     *              "show_type": 7,
                     *              "api_name": "Modified_By",
                     *              "unique": {},
                     *              "data_type": "ownerlookup",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Created Time",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 200,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000721",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 120,
                     *              "column_name": "CREATEDTIME",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": false,
                     *                "quick_create": false,
                     *                "create": false
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 25,
                     *              "show_type": 7,
                     *              "api_name": "Created_Time",
                     *              "unique": {},
                     *              "data_type": "datetime",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Modified Time",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 200,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000723",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 120,
                     *              "column_name": "MODIFIEDTIME",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": false,
                     *                "quick_create": false,
                     *                "create": false
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 26,
                     *              "show_type": 7,
                     *              "api_name": "Modified_Time",
                     *              "unique": {},
                     *              "data_type": "datetime",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Salutation",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 2,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000727",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 120,
                     *              "column_name": "SALUTATION",
                     *              "view_type": {
                     *                "view": false,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 28,
                     *              "show_type": 8,
                     *              "api_name": "Salutation",
                     *              "unique": {},
                     *              "data_type": "picklist",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [
                     *                {
                     *                  "display_value": "-None-",
                     *                  "sequence_number": 1,
                     *                  "maps": [],
                     *                  "actual_value": "-None-"
                     *                },
                     *                {
                     *                  "display_value": "Mr.",
                     *                  "sequence_number": 2,
                     *                  "maps": [],
                     *                  "actual_value": "Mr."
                     *                },
                     *                {
                     *                  "display_value": "Mrs.",
                     *                  "sequence_number": 3,
                     *                  "maps": [],
                     *                  "actual_value": "Mrs."
                     *                },
                     *                {
                     *                  "display_value": "Ms.",
                     *                  "sequence_number": 4,
                     *                  "maps": [],
                     *                  "actual_value": "Ms."
                     *                }
                     *              ],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "boolean",
                     *              "field_label": "Add to QuickBooks",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 301,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000729",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 5,
                     *              "column_name": "ADDTOQUICKBOOKS",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": false,
                     *              "sequence_number": 29,
                     *              "show_type": 7,
                     *              "api_name": "Add_to_QuickBooks",
                     *              "unique": {},
                     *              "data_type": "boolean",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Secondary Email",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 25,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000731",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 100,
                     *              "column_name": "ADDN_EMAIL",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 30,
                     *              "show_type": 7,
                     *              "api_name": "Secondary_Email",
                     *              "unique": {},
                     *              "data_type": "email",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Last Activity Time",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 786,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000737",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 120,
                     *              "column_name": "LASTACTIVITYTIME",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": false,
                     *                "quick_create": false,
                     *                "create": false
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 33,
                     *              "show_type": 8,
                     *              "api_name": "Last_Activity_Time",
                     *              "unique": {},
                     *              "data_type": "datetime",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Twitter",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 22,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000739",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 50,
                     *              "column_name": "TWITTER",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 34,
                     *              "show_type": 7,
                     *              "api_name": "Twitter",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            }
                     *          ]
                     *        },
                     *        {
                     *          "display_label": "Address Information",
                     *          "sequence_number": 2,
                     *          "column_count": 2,
                     *          "name": "Address Information",
                     *          "fields": [
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Mailing Street",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 1,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000747",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 250,
                     *              "column_name": "MAILINGSTREET",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 1,
                     *              "show_type": 7,
                     *              "api_name": "Mailing_Street",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Other Street",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 1,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000749",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 250,
                     *              "column_name": "OTHERSTREET",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 2,
                     *              "show_type": 7,
                     *              "api_name": "Other_Street",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Mailing City",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 1,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000751",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 30,
                     *              "column_name": "MAILINGCITY",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 3,
                     *              "show_type": 7,
                     *              "api_name": "Mailing_City",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Other City",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 1,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000753",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 30,
                     *              "column_name": "OTHERCITY",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 4,
                     *              "show_type": 7,
                     *              "api_name": "Other_City",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Mailing State",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 1,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000755",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 30,
                     *              "column_name": "MAILINGSTATE",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 5,
                     *              "show_type": 7,
                     *              "api_name": "Mailing_State",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Other State",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 1,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000757",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 30,
                     *              "column_name": "OTHERSTATE",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 6,
                     *              "show_type": 7,
                     *              "api_name": "Other_State",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Mailing Zip",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 1,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000759",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 30,
                     *              "column_name": "MAILINGZIP",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 7,
                     *              "show_type": 7,
                     *              "api_name": "Mailing_Zip",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Other Zip",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 1,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000761",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 30,
                     *              "column_name": "OTHERZIP",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 8,
                     *              "show_type": 7,
                     *              "api_name": "Other_Zip",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Mailing Country",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 1,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000763",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 30,
                     *              "column_name": "MAILINGCOUNTRY",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 9,
                     *              "show_type": 7,
                     *              "api_name": "Mailing_Country",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            },
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Other Country",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 1,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000765",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 30,
                     *              "column_name": "OTHERCOUNTRY",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 10,
                     *              "show_type": 7,
                     *              "api_name": "Other_Country",
                     *              "unique": {},
                     *              "data_type": "text",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            }
                     *          ]
                     *        },
                     *        {
                     *          "display_label": "Description Information",
                     *          "sequence_number": 3,
                     *          "column_count": 1,
                     *          "name": "Description Information",
                     *          "fields": [
                     *            {
                     *              "json_type": "string",
                     *              "field_label": "Description",
                     *              "tooltip": null,
                     *              "created_source": "default",
                     *              "required": false,
                     *              "ui_type": 3,
                     *              "read_only": false,
                     *              "currency": {},
                     *              "id": "3000000000767",
                     *              "custom_field": false,
                     *              "lookup": {},
                     *              "visible": true,
                     *              "length": 1000,
                     *              "column_name": "DESCRIPTION",
                     *              "view_type": {
                     *                "view": true,
                     *                "edit": true,
                     *                "quick_create": false,
                     *                "create": true
                     *              },
                     *              "default_value": null,
                     *              "sequence_number": 1,
                     *              "show_type": 7,
                     *              "api_name": "Description",
                     *              "unique": {},
                     *              "data_type": "textarea",
                     *              "formula": {},
                     *              "decimal_place": null,
                     *              "pick_list_values": [],
                     *              "auto_number": {}
                     *            }
                     *          ]
                     *        },
                     *        {
                     *          "display_label": "Score Summary",
                     *          "sequence_number": 4,
                     *          "column_count": 2,
                     *          "name": "Score Summary",
                     *          "fields": []
                     *        }
                     *      ],
                     *      "status": 0
                     *    }
                     *  ]
                     *}
                     */
                    getLayouts: function(data) {
                        data.Id = data.Id ? data.Id : data.LayoutId
                        data.type = data.Id ? "LAYOUT" : "LAYOUTS"
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
                     * ZOHO.CRM.META.getRelatedList({"Entity":"Contacts"}).then(function(data){
                     * console.log(data);	
                     * });
                     *  //prints
                     *{
                     *  "related_lists": [
                     *    {
                     *      "display_label": "Attachments",
                     *      "visible": true,
                     *      "api_name": "Attachments",
                     *      "module": {
                     *        "api_name": "Attachments",
                     *        "id": "3000000000111"
                     *      },
                     *      "name": "Attachments",
                     *      "id": "3000000003968",
                     *      "href": "Contacts/{ENTITYID}/Attachments",
                     *      "type": "default"
                     *    },
                     *    {
                     *      "display_label": "Deals",
                     *      "visible": true,
                     *      "api_name": "Deals",
                     *      "module": {
                     *        "api_name": "Deals",
                     *        "id": "3000000000047"
                     *      },
                     *      "name": "Deals",
                     *      "id": "3000000003974",
                     *      "href": "Contacts/{ENTITYID}/Deals",
                     *      "type": "default"
                     *    },
                     *    {
                     *      "display_label": "Notes",
                     *      "visible": true,
                     *      "api_name": "Notes",
                     *      "module": {
                     *        "api_name": "Notes",
                     *        "id": "3000000000069"
                     *      },
                     *      "name": "Notes",
                     *      "id": "3000000003971",
                     *      "href": "Contacts/{ENTITYID}/Notes",
                     *      "type": "default"
                     *    },
                     *    {
                     *      "display_label": "Open Activities",
                     *      "visible": true,
                     *      "api_name": "Activities",
                     *      "module": {
                     *        "api_name": "Activities",
                     *        "id": "3000000000049"
                     *      },
                     *      "name": "Activities",
                     *      "id": "3000000003965",
                     *      "href": "Contacts/{ENTITYID}/Activities",
                     *      "type": "default"
                     *    },
                     *    {
                     *      "display_label": "Closed Activities",
                     *      "visible": true,
                     *      "api_name": "Activities_History",
                     *      "module": {
                     *        "api_name": "Activities",
                     *        "id": "3000000000049"
                     *      },
                     *      "name": "Activities History",
                     *      "id": "3000000003962",
                     *      "href": "Contacts/{ENTITYID}/Activities_History",
                     *      "type": "default"
                     *    },
                     *    {
                     *      "display_label": "Products",
                     *      "visible": true,
                     *      "api_name": "Products",
                     *      "module": {
                     *        "api_name": "Products",
                     *        "id": "3000000000097"
                     *      },
                     *      "name": "Products",
                     *      "id": "3000000003977",
                     *      "href": "Contacts/{ENTITYID}/Products",
                     *      "type": "default"
                     *    },
                     *    {
                     *      "display_label": "Invited Events",
                     *      "visible": true,
                     *      "api_name": "Invited_Events",
                     *      "module": {
                     *        "api_name": "Events",
                     *        "id": "3000000000065"
                     *      },
                     *      "name": "Invited Events",
                     *      "id": "3000000004001",
                     *      "href": "Contacts/{ENTITYID}/Invited_Events",
                     *      "type": "default"
                     *    },
                     *    {
                     *      "display_label": "Cases",
                     *      "visible": true,
                     *      "api_name": "Cases",
                     *      "module": {
                     *        "api_name": "Cases",
                     *        "id": "3000000000093"
                     *      },
                     *      "name": "Cases",
                     *      "id": "3000000003980",
                     *      "href": "Contacts/{ENTITYID}/Cases",
                     *      "type": "default"
                     *    },
                     *    {
                     *      "display_label": "Quotes",
                     *      "visible": true,
                     *      "api_name": "Quotes",
                     *      "module": {
                     *        "api_name": "Quotes",
                     *        "id": "3000000000103"
                     *      },
                     *      "name": "Quotes",
                     *      "id": "3000000003983",
                     *      "href": "Contacts/{ENTITYID}/Quotes",
                     *      "type": "default"
                     *    },
                     *    {
                     *      "display_label": "Sales Orders",
                     *      "visible": true,
                     *      "api_name": "SalesOrders",
                     *      "module": {
                     *        "api_name": "Sales_Orders",
                     *        "id": "3000000000105"
                     *      },
                     *      "name": "SalesOrders",
                     *      "id": "3000000003986",
                     *      "href": "Contacts/{ENTITYID}/SalesOrders",
                     *      "type": "default"
                     *    },
                     *    {
                     *      "display_label": "Purchase Orders",
                     *      "visible": true,
                     *      "api_name": "PurchaseOrders",
                     *      "module": {
                     *        "api_name": "Purchase_Orders",
                     *        "id": "3000000000107"
                     *      },
                     *      "name": "PurchaseOrders",
                     *      "id": "3000000003989",
                     *      "href": "Contacts/{ENTITYID}/PurchaseOrders",
                     *      "type": "default"
                     *    },
                     *    {
                     *      "display_label": "Invoices",
                     *      "visible": true,
                     *      "api_name": "Invoices",
                     *      "module": {
                     *        "api_name": "Invoices",
                     *        "id": "3000000000109"
                     *      },
                     *      "name": "Invoices",
                     *      "id": "3000000003995",
                     *      "href": "Contacts/{ENTITYID}/Invoices",
                     *      "type": "default"
                     *    },
                     *    {
                     *      "display_label": "Campaigns",
                     *      "visible": true,
                     *      "api_name": "Campaigns",
                     *      "module": {
                     *        "api_name": "Campaigns",
                     *        "id": "3000000000055"
                     *      },
                     *      "name": "Campaigns",
                     *      "id": "3000000003998",
                     *      "href": "Contacts/{ENTITYID}/Campaigns",
                     *      "type": "default"
                     *    },
                     *    {
                     *      "display_label": "Social",
                     *      "visible": true,
                     *      "api_name": "Social",
                     *      "module": {
                     *        "api_name": "Social",
                     *        "id": "3000000000087"
                     *      },
                     *      "name": "Social",
                     *      "id": "3000000004067",
                     *      "href": null,
                     *      "type": "default"
                     *    }
                     *  ]
                     *}
                     */
                    getRelatedList: function(data) {
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
                     * ZOHO.CRM.META.getCustomViews({"Entity":"Contacts"}).then(function(data){
                     * console.log(data);	
                     * });
                     * //prints
                     *{
                     * "categories": [
                     *   {
                     *     "display_value": "Created By Me",
                     *     "actual_value": "created_by_me"
                     *   },
                     *   {
                     *     "display_value": "Shared With Me",
                     *     "actual_value": "shared_with_me"
                     *   }
                     * ],
                     * "custom_views": [
                     *   {
                     *     "display_value": "All Contacts",
                     *     "offline": true,
                     *     "default": true,
                     *     "system_name": "ALLVIEWS",
                     *     "module": {
                     *       "api_name": "Contacts",
                     *       "id": "3000000000045"
                     *     },
                     *     "name": "All Contacts",
                     *     "id": "3000000028135",
                     *     "category": "shared_with_me",
                     *     "favorite": null
                     *   },
                     *   {
                     *     "display_value": "Mailing Labels",
                     *     "offline": true,
                     *     "default": false,
                     *     "system_name": "ALLVIEWS",
                     *     "module": {
                     *       "api_name": "Contacts",
                     *       "id": "3000000000045"
                     *     },
                     *     "name": "Mailing Labels",
                     *     "id": "3000000028144",
                     *     "category": "shared_with_me",
                     *     "favorite": null
                     *   },
                     *   {
                     *     "display_value": "My Contacts",
                     *     "offline": true,
                     *     "default": false,
                     *     "system_name": "MYVIEWS",
                     *     "module": {
                     *       "api_name": "Contacts",
                     *       "id": "3000000000045"
                     *     },
                     *     "name": "My Contacts",
                     *     "id": "3000000028333",
                     *     "category": "shared_with_me",
                     *     "favorite": null
                     *   },
                     *   {
                     *     "display_value": "New Last Week",
                     *     "offline": true,
                     *     "default": false,
                     *     "system_name": "lastweek",
                     *     "module": {
                     *       "api_name": "Contacts",
                     *       "id": "3000000000045"
                     *     },
                     *     "name": "New Last Week",
                     *     "id": "3000000028183",
                     *     "category": "shared_with_me",
                     *     "favorite": null
                     *   },
                     *   {
                     *     "display_value": "New This Week",
                     *     "offline": true,
                     *     "default": false,
                     *     "system_name": "thisweek",
                     *     "module": {
                     *       "api_name": "Contacts",
                     *       "id": "3000000000045"
                     *     },
                     *     "name": "New This Week",
                     *     "id": "3000000028171",
                     *     "category": "shared_with_me",
                     *     "favorite": null
                     *   },
                     *   {
                     *     "display_value": "Recently Created Contacts",
                     *     "offline": true,
                     *     "default": false,
                     *     "system_name": "RECENTLYCREATED",
                     *     "module": {
                     *       "api_name": "Contacts",
                     *       "id": "3000000000045"
                     *     },
                     *     "name": "Recently Created Contacts",
                     *     "id": "3000000028195",
                     *     "category": "shared_with_me",
                     *     "favorite": null
                     *   },
                     *   {
                     *     "display_value": "Recently Modified Contacts",
                     *     "offline": true,
                     *     "default": false,
                     *     "system_name": "RECENTLYMODIFIED",
                     *     "module": {
                     *       "api_name": "Contacts",
                     *       "id": "3000000000045"
                     *     },
                     *     "name": "Recently Modified Contacts",
                     *     "id": "3000000028207",
                     *     "category": "shared_with_me",
                     *     "favorite": null
                     *   },
                     *   {
                     *     "display_value": "Unread Contacts",
                     *     "offline": true,
                     *     "default": false,
                     *     "system_name": "UNREADVIEWS",
                     *     "module": {
                     *       "api_name": "Contacts",
                     *       "id": "3000000000045"
                     *     },
                     *     "name": "Unread Contacts",
                     *     "id": "3000000028156",
                     *     "category": "shared_with_me",
                     *     "favorite": null
                     *   }
                     * ],
                     * "info": {
                     *   "per_page": 8,
                     *   "default": "3000000028135",
                     *   "count": 8,
                     *   "page": 1,
                     *   "more_records": false
                     * }
                     *}
                     *@example
                     *ZOHO.CRM.META.getCustomViews({"Entity":"Contacts","Id":"3000000028135"}).then(function(data){
                     *	console.log(data);	
                     *});
                     * //prints
                     *{
                     * "categories": [
                     *   {
                     *     "display_value": "Created By Me",
                     *     "actual_value": "created_by_me"
                     *   },
                     *   {
                     *     "display_value": "Shared With Me",
                     *     "actual_value": "shared_with_me"
                     *   }
                     * ],
                     * "custom_views": [
                     *   {
                     *     "display_value": "All Contacts",
                     *     "criteria": null,
                     *     "system_name": "ALLVIEWS",
                     *     "module": {
                     *       "api_name": "Contacts",
                     *       "id": "3000000000045"
                     *     },
                     *     "sort_by": null,
                     *     "offline": true,
                     *     "default": true,
                     *     "name": "All Contacts",
                     *     "id": "3000000028135",
                     *     "category": "shared_with_me",
                     *     "fields": [
                     *       {
                     *         "api_name": "Full_Name",
                     *         "id": "3000000000681"
                     *       },
                     *       {
                     *         "api_name": "Account_Name",
                     *         "id": "3000000000683"
                     *       },
                     *       {
                     *         "api_name": "Email",
                     *         "id": "3000000000687"
                     *       },
                     *       {
                     *         "api_name": "Phone",
                     *         "id": "3000000000695"
                     *       },
                     *       {
                     *         "api_name": "Owner",
                     *         "id": "3000000000673"
                     *       }
                     *     ],
                     *     "favorite": null,
                     *     "sort_order": null
                     *   }
                     * ]
                     *}
                     * 
                     */
                    getCustomViews: function(data) {
                        data.type = data.Id ? "CUSTOM_VIEW" : "CUSTOM_VIEWS"
                        return getMeta(data);
                    },
                    /**
                     * @namespace ZOHO.CRM.META.EMAIL
                    */
                    EMAIL:{
                        /**
                         * @function getAvailableFromAliases
                         * @description To get the list of available from address that can be used for sendEmail
                         * @returns {Promise} Resolved with list of available email aliases
                         * @memberof ZOHO.CRM.META.EMAIL
                         * @example
                         * ZOHO.CRM.META.EMAIL.getAvailableFromAliases().then(function(response){
                         *      console.log(response);
                         * });
                         *
                         * //prints
                         * {
                         *     "from_address_details": [
                         *         {
                         *             "type": "primary",
                         *             "email": "test@zoho.com"
                         *         }
                         *     ]
                         * }
                        */
                    	getAvailableFromAliases:function(){
                    		return getMeta({type:"EMAIL",subType:"GET_ALIAS"});
                    	}
                    }
                },
                /**
                 * @namespace ZOHO.CRM.API
                 */
                API: {
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
                    addNotes: function(data) {
                        var Entity = data.Entity;
                        var RelatedEntity = "NOTES";
                        var RecordID = data.RecordID;
                        var content = {
                            data: [{
                                Note_Title: data.Title,
                                Note_Content: data.Content
                            }]
                        };
                        return createRecord(Entity, content, RecordID, RelatedEntity);
                    },
                    addNotesAttachment: function(data) {
                        var Entity = data.Entity;
                        var RecordID = data.RecordID;
                        var RelatedRecordID = data.RelatedRecordID;
                        var APIData = {
                            Files: {
                                FileName: File.Name,
                                FileData: File.Content
                            }
                        };
                        return updateNotes(Entity, RecordID, RelatedRecordID, APIData)
                    },
                    /**
                     * @function coql
                     * @description Get records from the module through COQL query API.
                     * @param {Object} queryObject - Config Json.
                     * @param {String} queryObject.select_query - Select query.
                     * @returns {Promise} Resolved with list of record(s) matching the query.
                     * @memberof ZOHO.CRM.API
                     * @example
                     * var config = {
                     *      "select_query": "select Last_Name, First_Name, Full_Name from Contacts where Last_Name = 'Boyle' and First_Name is not null limit 2"
                     * }
                     * ZOHO.CRM.API.coql(config).then(function(data){
                     *  console.log(data);
                     * });
                     *
                     * //prints
                     * {
                     *     "data": [
                     *         {
                     *             "First_Name": null,
                     *             "Last_Name": null,
                     *             "id": "111118000000047003"
                     *         }
                     *     ],
                     *     "info": {
                     *         "count": 1,
                     *         "more_records": false
                     *     }
                     * }
                     */
                    coql: function(data) {
                        return executeQuery(data);
                    },
                    /**
                     * @function getAllRoles
                     * @description To get the list of all roles in CRM.
                     * @returns {Promise} Resolved with list of all the roles.
                     * @memberof ZOHO.CRM.API
                     * @example
                     * ZOHO.CRM.API.getAllRoles().then(function(data){
                     *  console.log(data);
                     * });
                     *
                     * //prints
                     * {
                     *     "roles": [
                     *         {
                     *             "display_label": "CEO",
                     *             "forecast_manager": null,
                     *             "share_with_peers": true,
                     *             "name": "CEO",
                     *             "description": "User belonging to this role can access data of all other users.",
                     *             "id": "111118000000037201",
                     *             "reporting_to": null,
                     *             "admin_user": true
                     *         },
                     *         {
                     *             "display_label": "Manager",
                     *             "forecast_manager": null,
                     *             "share_with_peers": false,
                     *             "name": "Manager",
                     *             "description": "Users belonging to this role cannot see admin role users data.",
                     *             "id": "111118000000037204",
                     *             "reporting_to": {
                     *                 "name": "CEO",
                     *                 "id": "111118000000037201"
                     *             },
                     *             "admin_user": false
                     *         }
                     *     ]
                     *}
                     */
                    getAllRoles: function() {
                        return getRole("ROLES")
                    },
                    /**
                     * @function getRoleById
                     * @description To get the details of a specific role.
                     * @param {Object} config - Configuration Object.
                     * @param {String} config.id - Role ID
                     * @returns {Promise} Resolved with details of the specified role.
                     * @memberof ZOHO.CRM.API
                     * @example
                     * var config = {
                     *      "id":"111118000000037201"
                     * }
                     * ZOHO.CRM.API.getRoleById(config).then(function(response){
                     *      console.log(response);
                     * });
                     *
                     * //prints
                     * {
                     *     "roles": [
                     *         {
                     *             "display_label": "CEO",
                     *             "forecast_manager": null,
                     *             "share_with_peers": true,
                     *             "name": "CEO",
                     *             "description": "User belonging to this role can access data of all other users.",
                     *             "id": "111118000000037201",
                     *             "reporting_to": null,
                     *             "admin_user": true
                     *         }
                     *     ]
                     * }
                     */
                    getRoleById: function(data){
                        var roleId = data.id;
                        return getRole("ROLE", roleId)
                    },
                    /**
                     * @function insertRecord
                     * @description Insert record to a modue
                     * @param {Object} config - Configuration Object.
                     * @param {String} config.Entity - SysRefName of the module.
                     * @param {list} config.Trigger - The trigger input can be "workflow", "approval" or "blueprint". If the trigger is not mentioned, the workflows, approvals and blueprints related to the API will get executed. Enter the trigger value as [] to not execute the workflows
                     * @param {Object} config.APIData - RecordID to associate the notes.
                     * @return {Promise} Resolved with response data 
                     * @memberof ZOHO.CRM.API
                     * @example
                     * var recordData = {
                     *         "Company": "Zylker",
                     *         "Last_Name": "Peterson"
                     *   }
                     * ZOHO.CRM.API.insertRecord({Entity:"Leads",APIData:recordData,Trigger:["workflow"]}).then(function(data){
                     *	console.log(data);
                     *	});
                     * //prints
                     *{
                     *  "data": [
                     *    {
                     *      "code": "SUCCESS",
                     *      "details": {
                     *        "Modified_Time": "2017-12-22T03:24:39+05:30",
                     *        "Modified_By": {
                     *          "name": "NareshTesting ",
                     *          "id": "3000000031045"
                     *        },
                     *        "Created_Time": "2017-12-22T03:24:39+05:30",
                     *        "id": "3000000040011",
                     *        "Created_By": {
                     *          "name": "NareshTesting ",
                     *          "id": "3000000031045"
                     *        }
                     *      },
                     *      "message": "record added",
                     *      "status": "success"
                     *    }
                     *  ]
                     *}
                     * @example
                     * var data = [
                     * {
                     *         "Company": "ZohoCorp",
                     *         "Last_Name": "Babu"
                     * },
                     * {
                     * 	"Company": "ZohoCorp",
                     *     	"Last_Name": "Naresh"
                     * }
                     * ];
                     * ZOHO.CRM.API.insertRecord({Entity:"Leads",APIData:data,Trigger:["workflow"]}).then(function(data){
                     * 	console.log(data);
                     * });
                     * 
                     * //prints
                     *{
                     *  "data": [
                     *    {
                     *      "code": "SUCCESS",
                     *      "details": {
                     *        "Modified_Time": "2017-12-22T03:27:23+05:30",
                     *        "Modified_By": {
                     *          "name": "NareshTesting ",
                     *          "id": "3000000031045"
                     *        },
                     *        "Created_Time": "2017-12-22T03:27:23+05:30",
                     *        "id": "3000000040015",
                     *        "Created_By": {
                     *          "name": "NareshTesting ",
                     *          "id": "3000000031045"
                     *        }
                     *      },
                     *      "message": "record added",
                     *      "status": "success"
                     *    },
                     *    {
                     *      "code": "SUCCESS",
                     *      "details": {
                     *        "Modified_Time": "2017-12-22T03:27:23+05:30",
                     *        "Modified_By": {
                     *          "name": "NareshTesting ",
                     *          "id": "3000000031045"
                     *        },
                     *        "Created_Time": "2017-12-22T03:27:23+05:30",
                     *        "id": "3000000040016",
                     *        "Created_By": {
                     *          "name": "NareshTesting ",
                     *          "id": "3000000031045"
                     *        }
                     *      },
                     *      "message": "record added",
                     *      "status": "success"
                     *    }
                     *  ]
                     *}
                     */
                    insertRecord: function(data) {
                        var Entity = data.Entity;
                        var APIData = data.APIData;
                        APIData.trigger = data.Trigger;
                        return createRecord(Entity, APIData);
                    },
                     /**
                     * @function upsertRecord
                     * @description Insert record or update matching existing record
                     * @param {Object} config - Configuration Object.
                     * @param {String} config.Entity - SysRefName of the module.
                     * @param {list} config.Trigger - The trigger input can be "workflow", "approval" or "blueprint". If the trigger is not mentioned, the workflows, approvals and blueprints related to the API will get executed. Enter the trigger value as [] to not execute the workflows
                     * @param {Object} config.APIData - insert json details
                     * @param {Object} config.duplicate_check_fields  - this param will update existing record,add multiple fields with comma separated
                     * @return {Promise} Resolved with response data 
                     * @memberof ZOHO.CRM.API
                     * @example
                     *var data = [
                     *{
                     *        "Company": "zoho",
                     *        "Last_Name": "zylker",
                     *    "Email":"zylker@gmail.com",
                     *    "Mobile":"1234567890",
                     *    "Website":"https://www.zoho.com"
                     *
                     *},
                     *{
                     *  "Company": "zoho",
                     *      "Last_Name": "zylker",
                     *  "Email":"zylkder@gmail.com",
                     *  "Website":"http://www.google.com",
                     *  "Mobile":"8393749473934739"
                     *},
                     *];
                     *ZOHO.CRM.API.upsertRecord({Entity:"Leads",APIData:data,duplicate_check_fields:["Website","Mobile"],Trigger : ["workflow"]}).then(function(data){
                     *  console.log(data);
                     *});
                     * 
                     * //prints
                     *[
                     *  {
                     *    "code": "SUCCESS",
                     *    "duplicate_field": "Mobile",
                     *    "action": "update",
                     *    "details": {
                     *      "Modified_Time": "2018-10-11T12:06:47+05:30",
                     *      "Modified_By": {
                     *        "name": "test ",
                     *        "id": "111134000000033383"
                     *      },
                     *      "Created_Time": "2018-10-11T11:55:10+05:30",
                     *      "id": "111134000000036225",
                     *      "Created_By": {
                     *        "name": "test ",
                     *        "id": "111134000000033383"
                     *      }
                     *    },
                     *    "message": "record updated",
                     *    "status": "success"
                     *  },
                     *  {
                     *    "code": "SUCCESS",
                     *    "duplicate_field": "Website",
                     *    "action": "update",
                     *    "details": {
                     *      "Modified_Time": "2018-10-11T12:06:47+05:30",
                     *      "Modified_By": {
                     *        "name": "test ",
                     *        "id": "111134000000033383"
                     *      },
                     *      "Created_Time": "2018-10-11T11:55:10+05:30",
                     *      "id": "111134000000036226",
                     *      "Created_By": {
                     *        "name": "test ",
                     *        "id": "111134000000033383"
                     *      }
                     *    },
                     *    "message": "record updated",
                     *    "status": "success"
                     *  }
                     *]
                     */
                    upsertRecord: function(data) {
                        var Entity = data.Entity;
                        var APIData = data.APIData;
                        APIData.trigger = data.Trigger;
                        APIData.action = "UPSERT";
                        if(data.duplicate_check_fields && data.duplicate_check_fields instanceof Array)
                        {
							APIData.duplicate_check_fields = data.duplicate_check_fields.join(",")
                        }
                        return createRecord(Entity, APIData);
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
                     *{
                     *  "data": [
                     *    {
                     *      "Owner": {
                     *        "name": "NareshTesting ",
                     *        "id": "3000000031045"
                     *      },
                     *      "Company": "ZohoCorp",
                     *      "Email": null,
                     *      "Description": null,
                     *      "$currency_symbol": "$",
                     *      "$photo_id": null,
                     *      "Website": null,
                     *      "Twitter": null,
                     *      "$upcoming_activity": null,
                     *      "Salutation": null,
                     *      "Last_Activity_Time": "2017-12-22T03:27:23+05:30",
                     *      "First_Name": null,
                     *      "Full_Name": "Naresh",
                     *      "Lead_Status": null,
                     *      "Industry": null,
                     *      "Modified_By": {
                     *        "name": "NareshTesting ",
                     *        "id": "3000000031045"
                     *      },
                     *      "Skype_ID": null,
                     *      "$converted": false,
                     *      "$process_flow": false,
                     *      "Phone": null,
                     *      "Street": null,
                     *      "Zip_Code": null,
                     *      "id": "3000000040016",
                     *      "Email_Opt_Out": false,
                     *      "$approved": true,
                     *      "Designation": null,
                     *      "$approval": {
                     *        "delegate": false,
                     *        "approve": false,
                     *        "reject": false
                     *      },
                     *      "Modified_Time": "2017-12-22T03:27:23+05:30",
                     *      "Created_Time": "2017-12-22T03:27:23+05:30",
                     *      "$converted_detail": {},
                     *      "$followed": false,
                     *      "$editable": true,
                     *      "City": null,
                     *      "No_of_Employees": 0,
                     *      "Mobile": null,
                     *      "Last_Name": "Naresh",
                     *      "State": null,
                     *      "$status": "cv_1",
                     *      "Lead_Source": null,
                     *      "Country": null,
                     *      "Created_By": {
                     *        "name": "NareshTesting ",
                     *        "id": "3000000031045"
                     *      },
                     *      "Fax": null,
                     *      "Annual_Revenue": 0,
                     *      "Secondary_Email": null
                     *    }
                     *  ]
                     *}
                     */
                    getRecord: function(data) {
                        var Entity = data.Entity;
                        var RecordID = data.RecordID;
                        return getRecord(Entity, RecordID);
                    },
                    /**
                    * @function getBluePrint
                    * @description Get blueprint details
                    * @param {object} config - configuration object
                    * @param {String} config.Entity - SysRefName of the module.
                    * @param {String} config.RecordID - RecordID to associate the notes.
                    * @return {Promise} Resolved with data of record matching with RecordID 
                    * @memberof ZOHO.CRM.API
                    * @example
                    * var config = 
                    *{
                    *  "Entity": "Leads",
                    *  "RecordID": "111126000000036019"
                    *}
                    *
                    *
                    *ZOHO.CRM.API.getBluePrint(config).then(function(data){
                    *  console.log(data)
                    *})
                    *
                    *
                    * //prints
                    *
                    *
                    *{
                    *  "blueprint": {
                    *    "process_info": {
                    *      "field_id": "111126000000000885",
                    *      "is_continuous": false,
                    *      "api_name": "Lead_Status",
                    *      "continuous": false,
                    *      "field_label": "Lead Status",
                    *      "name": "Lprint",
                    *      "column_name": "STATUS",
                    *      "field_value": "Pre Qualified",
                    *      "id": "111126000000035049",
                    *      "field_name": "Lead Status"
                    *    },
                    *    "transitions": [
                    *      {
                    *        "next_transitions": [
                    *          {
                    *            "name": "lost lead",
                    *            "id": "111126000000035025"
                    *          }
                    *        ],
                    *        "data": {},
                    *        "next_field_value": "Not Qualified",
                    *        "name": "not qualify",
                    *        "criteria_matched": true,
                    *        "id": "111126000000035019",
                    *        "fields": [],
                    *        "criteria_message": null,
                    *        "percent_partial_save": 0
                    *      },
                    *      {
                    *        "next_transitions": [],
                    *        "data": {},
                    *        "next_field_value": "Contacted",
                    *        "name": "contact",
                    *        "criteria_matched": true,
                    *        "id": "111126000000035007",
                    *        "fields": [],
                    *        "criteria_message": null,
                    *        "percent_partial_save": 0
                    *      }
                    *    ]
                    *  }
                    *}
                    */
                    getBluePrint: function(data) {
                        var APIData = {
                            Entity : data.Entity,
                            RecordID : data.RecordID,
                            action: "GET_BLUEPRINT_STATUS"
                        }
                        return getBluePrint(APIData);
                    },
                    /**
                    * @function updateBluePrint
                    * @description update blueprint details for particular record.
                    * @param {Object} config - Configuration Object.
                    * @param {String} config.Entity - SysRefName of the module.
                    * @param {String} config.RecordID - RecordID to associate the notes.
                    * @param {object} config.BlueprintData - blueprint data to update 
                    * @return {Promise} Resolved with data of record matching with RecordID 
                    * @memberof ZOHO.CRM.API
                    * @example
                    * var BlueprintData = 
                    *{
                    *  "blueprint": [
                    *    {
                    *      "transition_id": "111126000000035019",
                    *      "data": {
                    *        "Phone": "8940372937",
                    *        "Notes": "Updated via blueprint"
                    *      }
                    *    }
                    *  ]
                    *}
                    *
                    *
                    * update attachment with blueprint 
                    *
                    *
                    * var BlueprintData = 
                    *{
                    *  "blueprint": [
                    *    {
                    *      "transition_id": "1000000031897",
                    *      "data": {
                    *        "Attachments": {
                    *          "$file_id": [
                    *            "59cf260313b6907ffc56957f4241bd94ba3e0b6aad53b50f8b38583a859d623a",
                    *            "59cf260313b6907ffc56957f4241bd94ba3e0b6aad53b50f8b38583a859d624d"
                    *          ]
                    *        }
                    *      }
                    *    }
                    *  ]
                    *}
                    *
                    * update link with blueprint
                    *
                    *
                    *{
                    *  "blueprint": [
                    *    {
                    *      "transition_id": "2000000031536",
                    *      "data": {
                    *        "Attachments": {
                    *          "$link_url": "facebook.com"
                    *        },
                    *        "Notes": "Dileep checking Notes outside"
                    *      }
                    *    }
                    *  ]
                    *}
                    *
                    *
                    *var config=
                    *{
                    *  Entity:"Leads",
                    *  RecordID:"111126000000036019",
                    *  BlueprintData:BlueprintData
                    *}
                    *
                    *
                    *ZOHO.CRM.API.updateBluePrint(config).then(function(data){
                    *   console.log(data);
                    *});
                    * 
                    * //prints 
                    *
                    * {
                    *    "code": "SUCCESS",
                    *    "details": {},
                    *    "message": "transition updated successfully",
                    *    "status": "success"
                    * }
                    */
                    updateBluePrint: function(data) {
                        var APIData = {
                            Entity : data.Entity,
                            RecordID : data.RecordID,
                            BlueprintData : data.BlueprintData,
                            action: "UPDATE_BLUEPRINT_STATUS"
                        }
                        return getBluePrint(APIData);
                    },
                    /**
                    * @function uploadFile
                    * @description upload the files in to zoho server
                    * @param {Object} File - File object
                    * @returns {Promise} Resolved with uploaded file id
                    * @memberof ZOHO.CRM.API
                    * @example
                    * var File = document.getElementById("attachmentinput").files[0];
                    * ZOHO.CRM.API.uploadFile(File).then(function(data) {
                    *    console.log(data);
                    * })
                    *
                    *
                    * //prints
                    *
                    *{
                    *  "data": [
                    *    {
                    *      "code": "SUCCESS",
                    *      "details": {
                    *        "name": "desk.png",
                    *        "id": "b12bb1b005f171ac797b3773040438ba7da026eb056f272271d511e95581689b"
                    *      },
                    *      "message": "desk.png uploaded Succeessfully",
                    *      "status": "success"
                    *    }
                    *  ]
                    *} 
                    */
                    uploadFile: function(data)
                    {
                        return uploadFile(data);
                    },
                    /**
                    *@function getFile
                    *@memberof ZOHO.CRM.API
                    *@description get file from file id
                    *@params {object} config - file id 
                    *@return {Promise} Resolved with data of file binary string 
                    *@example
                    *var config = {
                    *    id:"b12bb1b005f171ac797b3773040438ba7da026eb056f272271d511e95581689b"
                    *}
                    *
                    *
                    *ZOHO.CRM.API.getFile(config);
                    */
                    getFile :function(data)
                    {
                        return getFile(data);
                    },
                    /**
                     * @function getAllRecords
                     * @description get list of all records in a module
                     * @param {Object} config - Configuration Object.
                     * @param {String} config.Entity - SysRefName of the module.
                     * @param {String} [config.sort_order] - To sort records. allowed values {asc|desc}
                     * @param {String} [config.converted] - To get the list of converted records
                     * @param {String} [config.cvid] - To get the list of records based on custom views 
                     * @param {String} [config.fields] - To list all the module records with respect to fields
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
                     *{
                     *  "data": [
                     *    {
                     *      "Owner": {
                     *        "name": "NareshTesting ",
                     *        "id": "3000000031045"
                     *      },
                     *      "Company": "Testrec1",
                     *      "Email": null,
                     *      "Description": null,
                     *      "$currency_symbol": "$",
                     *      "$photo_id": null,
                     *      "Website": null,
                     *      "Twitter": null,
                     *      "$upcoming_activity": null,
                     *      "Salutation": null,
                     *      "Last_Activity_Time": "2017-12-16T09:54:37+05:30",
                     *      "First_Name": null,
                     *      "Full_Name": "Testrec1",
                     *      "Lead_Status": null,
                     *      "Industry": null,
                     *      "Modified_By": {
                     *        "name": "NareshTesting ",
                     *        "id": "3000000031045"
                     *      },
                     *      "Skype_ID": null,
                     *      "$converted": false,
                     *      "$process_flow": false,
                     *      "Phone": null,
                     *      "Street": null,
                     *      "Zip_Code": null,
                     *      "id": "3000000032009",
                     *      "Email_Opt_Out": false,
                     *      "$approved": true,
                     *      "Designation": null,
                     *      "$approval": {
                     *        "delegate": false,
                     *        "approve": false,
                     *        "reject": false
                     *      },
                     *      "Modified_Time": "2017-12-16T09:54:37+05:30",
                     *      "Created_Time": "2017-12-16T09:54:37+05:30",
                     *      "$converted_detail": {},
                     *      "$followed": false,
                     *      "$editable": true,
                     *      "City": null,
                     *      "No_of_Employees": null,
                     *      "Mobile": null,
                     *      "Last_Name": "Testrec1",
                     *      "State": null,
                     *      "$status": "cv_1",
                     *      "Lead_Source": null,
                     *      "Country": null,
                     *      "Created_By": {
                     *        "name": "NareshTesting ",
                     *        "id": "3000000031045"
                     *      },
                     *      "Fax": null,
                     *      "Annual_Revenue": null,
                     *      "Secondary_Email": null
                     *    },
                     *    {
                     *      "Owner": {
                     *        "name": "NareshTesting ",
                     *        "id": "3000000031045"
                     *      },
                     *      "Company": "Testrec2",
                     *      "Email": null,
                     *      "Description": null,
                     *      "$currency_symbol": "$",
                     *      "$photo_id": null,
                     *      "Website": null,
                     *      "Twitter": null,
                     *      "$upcoming_activity": null,
                     *      "Salutation": null,
                     *      "Last_Activity_Time": "2017-12-16T09:54:58+05:30",
                     *      "First_Name": null,
                     *      "Full_Name": "Testrec2",
                     *      "Lead_Status": null,
                     *      "Industry": null,
                     *      "Modified_By": {
                     *        "name": "NareshTesting ",
                     *        "id": "3000000031045"
                     *      },
                     *      "Skype_ID": null,
                     *      "$converted": false,
                     *      "$process_flow": false,
                     *      "Phone": null,
                     *      "Street": null,
                     *      "Zip_Code": null,
                     *      "id": "3000000032091",
                     *      "Email_Opt_Out": false,
                     *      "$approved": true,
                     *      "Designation": null,
                     *      "$approval": {
                     *        "delegate": false,
                     *        "approve": false,
                     *        "reject": false
                     *      },
                     *      "Modified_Time": "2017-12-16T09:54:58+05:30",
                     *      "Created_Time": "2017-12-16T09:54:58+05:30",
                     *      "$converted_detail": {},
                     *      "$followed": false,
                     *      "$editable": true,
                     *      "City": null,
                     *      "No_of_Employees": null,
                     *      "Mobile": null,
                     *      "Last_Name": "Testrec2",
                     *      "State": null,
                     *      "$status": "c_1",
                     *      "Lead_Source": null,
                     *      "Country": null,
                     *      "Created_By": {
                     *        "name": "NareshTesting ",
                     *        "id": "3000000031045"
                     *      },
                     *      "Fax": null,
                     *      "Annual_Revenue": null,
                     *      "Secondary_Email": null
                     *    }
                     *  ],
                     *  "info": {
                     *    "per_page": 2,
                     *    "count": 2,
                     *    "page": 1,
                     *    "more_records": true
                     *  }
                     *}
                     */
                    getAllRecords: function(data) {
                        return getAllRecords(data);
                    },
                    /**
                     * @function updateRecord
                     * @description To update a record in a module 
                     * @param {Object} config - Configuration Object.
                     * @param {String} config.Entity - SysRefName of the module.
                     * @param {list} config.Trigger - The trigger input can be "workflow", "approval" or "blueprint". If the trigger is not mentioned, the workflows, approvals and blueprints related to the API will get executed. Enter the trigger value as [] to not execute the workflows
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
                     *   },
                     *   Trigger:["workflow"]
                     * }
                     * ZOHO.CRM.API.updateRecord(config)
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     * 
                     * //prints 
                     *{
                     *  "data": [
                     *    {
                     *      "code": "SUCCESS",
                     *      "details": {
                     *        "Modified_Time": "2017-12-22T03:29:57+05:30",
                     *        "Modified_By": {
                     *          "name": "NareshTesting ",
                     *          "id": "3000000031045"
                     *        },
                     *        "Created_Time": "2017-12-22T03:27:23+05:30",
                     *        "id": "3000000040016",
                     *        "Created_By": {
                     *          "name": "NareshTesting ",
                     *          "id": "3000000031045"
                     *        }
                     *      },
                     *      "message": "record updated",
                     *      "status": "success"
                     *    }
                     *  ]
                     *}            
                     */
                    updateRecord: function(data) {
                        var Entity = data.Entity;
                        var APIData = data.APIData;
                        APIData.trigger = data.Trigger;
                        return updateRecord(Entity, APIData);
                    },
                    /**
                     * @function updateVoiceURL
                     * @description To update voice URL (Recording) for a record in calls module (Restricted access)
                     * @param {Object} config - Configuration Object.
                     * @param {String} config.RecordID - Call activity ID.
                     * @param {list} config.VoiceURL - voice recording url 
                     * @memberof ZOHO.CRM.API
                     * @example
                     * var config={
                     *   RecordID:"3000000031045",
                     *   VoiceURL:"https://testurl.com/calls/1772649/recording/Aas354465.mp3"
                     * }
                     * ZOHO.CRM.API.updateVoiceURL(config)
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     * 
                     * //prints 
                     *{
                     *    "code": "SUCCESS",
                     *    "status": "success"
                     *}
                     */
                    updateVoiceURL: function(data) {
                        var APIData = data;
                        return updateVoiceURL(APIData);
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
                     *{
                     *  "data": [
                     *    {
                     *      "code": "SUCCESS",
                     *      "details": {
                     *        "id": "3000000040015"
                     *      },
                     *      "message": "record deleted",
                     *      "status": "success"
                     *    }
                     *  ]
                     *}      
                     */
                    deleteRecord: function(data) {
                        var Entity = data.Entity;
                        var recordID = data.RecordID;
                        return deleteRecord(Entity, recordID);
                    },
                    /**
                     * @function searchRecord
                     * @description To retrieve the records that matches your search criteria 
                     * @param {object} config - Configuration Object
                     * @param {String} config.Entity - SysRefName of module
                     * @param {String} config.Type - Allowed values "email|phone|word|criteria"
                     * @param {String} config.Query - query String
                     * @param {boolean} [config.converted] - get Converted records, Allowed values "true|false|both"
                     * @param {boolean} [config.approved] - get Approved records, Allowed values "true|false|both"
                     * @param {String} [config.page] - Pagination - Page number
                     * @param {String} [config.per_page] - Pagination - per page limit
                     * @param {boolean} [config.delay] - false - bypass Lucean indexing
                     * @return {Promise} Resolved with search result 
                     * @memberof ZOHO.CRM.API
                     * @example
                     * ZOHO.CRM.API.searchRecord({Entity:"Leads",Type:"phone",Query:"123456789",delay:false})
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     * @example
                     * ZOHO.CRM.API.searchRecord({Entity:"Leads",Type:"email",Query:"test@zoho.com"})
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     * @example
                     * ZOHO.CRM.API.searchRecord({Entity:"Leads",Type:"word",Query:"ZohoCrop"})
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     * @example
                     * ZOHO.CRM.API.searchRecord({Entity:"Leads",Type:"criteria",Query:"(Company:equals:Zoho)"})
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     * @example
                     * ZOHO.CRM.API.searchRecord({Entity:"Leads",Type:"criteria",Query:"((Company:equals:Zoho)or(Company:equals:zylker))"})
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     */
                    searchRecord: function(data) {
                        return searchRecord(data);
                    },
                    /**
                    * @function getAllActions
                    * @description We can view all the available actions that can be performed on a particular record.
                    * @param {object} config - Configuration Object
                    * @param {String} config.Entity - SysRefname of module
                    * @param {String} config.RecordID - id of the particular record.
                    * @return {Promise} Resolved List of actions be the specified module record.
                    * @memberof ZOHO.CRM.API
                    * @example
                    * var config = {
                    * 	Entity: "Leads",
                    * 	RecordID : "518440000000222778"
                    * }
                    * ZOHO.CRM.API.getAllActions(config)
                    * .then(function(data){
                    *     console.log(data)
                    * })
                    * //prints
                    *
                    *{
                    *  "actions": [
                    *    {
                    *      "http_method": "GET",
                    *      "name": "custom_links",
                    *      "href": "/v2/Leads/111155000000036014/actions/custom_links"
                    *    },
                    *    {
                    *      "http_method": "POST",
                    *      "name": "change_owner",
                    *      "href": "/v2/Leads/111155000000036014/actions/change_owner"
                    *    },
                    *    {
                    *      "http_method": "POST",
                    *      "name": "approvals",
                    *      "href": "/v2/Leads/111155000000036014/actions/approvals",
                    *      "params": [
                    *        {
                    *          "name": "action",
                    *          "type": "text",
                    *          "value": [
                    *            "approve",
                    *            "delegate",
                    *            "reject",
                    *            "resubmit"
                    *          ]
                    *        },
                    *        {
                    *          "name": "comments",
                    *          "type": "text"
                    *        }
                    *      ]
                    *    }
                    *  ]
                    *}
                    *
                    *
                    *
                    *The above response is obtained if the record is waiting for the approval and if the caller has administrator access.
                    *If the record has no valid approval pending or the record id is invalid, the following is the response obtained.
                    *
                    *
                    *
                    *{
                    *  "actions": [
                    *    {
                    *      "http_method": "GET",
                    *      "name": "custom_links",
                    *      "href": "/v2/Leads/111155000000036014/actions/custom_links"
                    *    },
                    *    {
                    *      "http_method": "POST",
                    *      "name": "change_owner",
                    *      "href": "/v2/Leads/111155000000036014/actions/change_owner"
                    *    }
                    *  ]
                    *}
                    *
                    */
                    getAllActions: function(data)
                    {
                        data.action = "GET_ALL_ACTIONS"
                        return getAllActions(data);
                    },
                    /**
                    * @function getApprovalRecords
                    * @description This method is called by the one who has to approve.If it is called by others, they will get 204 response.
                    * <br><br><b>"others_awaiting"</b> gives the list of all approvals pending regardless of who has to approve it. Usually, Super Admin and administrator will be able to use this API whereas standard user will still get a 204 empty response.<br><br>
                    * @param {object} config - configuration object
                    * @param {string} config.type - Allowed values "awaiting | others_awaiting"
                    * @return {Promise} Resolved List of records for waiting the approval.
                    * @memberof ZOHO.CRM.API
                    * @example
                    *
                    * ZOHO.CRM.API.getApprovalRecords()
                    * .then(function(data){
                    *     console.log(data)
                    * })
                    *
                    *It returns the pending approval records of the current user
                    *
                    *@example
                    * var config = {type:"others_awaiting"}
                    *
                    *
                    * ZOHO.CRM.API.getApprovalRecords(config)
                    * .then(function(data){
                    *     console.log(data)
                    * })
                    *
                    *It returns the pending approval records which should be approve by other user.
                    * //prints
                    *
                    *
                    *
                    *{
                    *  "data": [
                    *    {
                    *      "owner": {
                    *        "phone": null,
                    *        "name": "milestone2 ",
                    *        "mobile": null,
                    *        "id": "111155000000032023",
                    *        "email": "uk@zylker.com"
                    *      },
                    *      "initiated_time": "2018-07-16T10:16:54+05:30",
                    *      "module": "Leads",
                    *      "rule": {
                    *        "name": "Name",
                    *        "id": "111155000000036006"
                    *      },
                    *      "id": "111155000000036021",
                    *      "type": "approval",
                    *      "entity": {
                    *        "name": "uk",
                    *        "id": "111155000000036014"
                    *      },
                    *      "default_layout": true,
                    *      "waiting_for": {
                    *        "name": "uk ",
                    *        "id": "111155000000035012"
                    *      }
                    *    }
                    *  ],
                    *  "info": {
                    *    "per_page": 200,
                    *    "count": 1,
                    *    "page": 1,
                    *    "more_records": false
                    *  }
                    *}
                    *
                    */
                    getApprovalRecords: function(data)
                    {
                        var newdata = {};
                        if(data)
                        {
                            data.action = "GET_APPROVAL_RECORDS";
                        }
                        else
                        {
                            newdata.action = "GET_APPROVAL_RECORDS";
                            data = newdata;
                        }
                        return getAllActions(data);
                    },
                    /**
                    * @function getApprovalById
                    * @description To get details of the particular approval.
                    * @param {object} config - configuration object
                    * @param {string} config.id - id of the approval
                    * @return {Promise} Resolved details of the approval.
                    * @memberof ZOHO.CRM.API
                    * @example
                    *var config = {
                    *       id:"518440000000222786"
                    *}
                    *
                    *
                    *ZOHO.CRM.API.getApprovalById(config).then(function(d){
                    *   console.log(d);
                    *})
                    *
                    *
                    *
                    * //prints
                    *
                    *
                    *
                    *{
                    *  "data": [
                    *    {
                    *      "owner": {
                    *        "phone": null,
                    *        "name": "milestone2 ",
                    *        "mobile": null,
                    *        "id": "111155000000032023",
                    *        "history": [],
                    *        "email": "uk@zylker.com"
                    *      },
                    *      "initiated_time": "2018-07-16T10:16:54+05:30",
                    *      "criteria": [
                    *        {
                    *          "api_name": "Annual_Revenue",
                    *          "field_label": "Annual Revenue",
                    *          "value": "$1.00"
                    *        }
                    *      ],
                    *      "module": "Leads",
                    *      "rule": {
                    *        "name": "Name",
                    *        "id": "111155000000036006"
                    *      },
                    *      "id": "518440000000222786",
                    *      "type": "approval",
                    *      "entity": {
                    *        "name": "uk",
                    *        "id": "111155000000036014"
                    *      },
                    *      "default_layout": true,
                    *      "waiting_for": {
                    *        "name": "uk ",
                    *        "id": "111155000000035012"
                    *      }
                    *    }
                    *  ],
                    *  "info": {
                    *    "per_page": 200,
                    *    "count": 1,
                    *    "page": 1,
                    *    "more_records": false
                    *  }
                    *}
                    *
                    */
                    getApprovalById: function(data)
                    {
                        data.action = "GET_APPROVALBYID"
                        return getAllActions(data);
                    },
                    /**
                    * @function getApprovalsHistory
                    * @description View the history of records put up for approval
                    * @return {Promise} Resolved List of records for waiting the approval.
                    * @memberof ZOHO.CRM.API
                    * @example
                    *
                    *ZOHO.CRM.API.getApprovalsHistory().then(function(data){
                    *    console.log(data);
                    *});
                    *
                    *
                    * //prints
                    *
                    *
                    *
                    *{
                    *  "data": [
                    *    {
                    *      "audit_time": "2018-07-16T15:46:54+05:30",
                    *      "done_by": {
                    *        "name": "milestone2 ",
                    *        "id": "111155000000032023"
                    *      },
                    *      "module": "Leads",
                    *      "record": {
                    *        "name": "uk",
                    *        "id": "111155000000036014"
                    *      },
                    *      "related_module": null,
                    *      "action": "Submitted",
                    *      "rule": "111155000000036006",
                    *      "account": null,
                    *      "related_name": "milestone2 ",
                    *      "territory": null
                    *    }
                    *  ],
                    *  "info": {
                    *    "per_page": 200,
                    *    "count": 1,
                    *    "page": 1,
                    *    "more_records": false
                    *  }
                    *}
                    *
                    *
                    */
                    getApprovalsHistory: function()
                    {
                        var data = {};
                        data.action="GET_APPROVALS_HISTORY";
                        return getAllActions(data);
                    },
                    /**
                    * @function approveRecord
                    * @description approve the record
                    * @param {object} config - configuration object
                    * @param {string} config.Entity - SysRefName of module
                    * @param {string} config.RecordID - id of the record.
                    * @param {string} config.actionType - type of action Allowed values  "approve" | "delegate" | "resubmit" | "reject"
                    * @param {string} config.comments - comments (optional)
                    * @param {string} config.user - only for delegate
                    * @return {Promise} Resolved with the details of approval
                    * @memberof ZOHO.CRM.API
                    * @example
                    *
                    *
                    * var config = {
                    *   Entity:"Leads",
                    *   RecordID:"111155000000036014",
                    *   actionType:"approve"
                    *}
                    *
                    *
                    *
                    *ZOHO.CRM.API.approveRecord(config).then(function(data){
                    *    console.log(data);
                    *});
                    *
                    *
                    * //prints
                    *
                    *
                    *{
                    *  "code": "SUCCESS",
                    *  "details": {
                    *    "id": "111155000000036014"
                    *  },
                    *  "message": "Record approved successfully",
                    *  "status": "success"
                    *}
                    *
                    */
                    approveRecord: function(data)
                    {
                        data.action="UPDATE_APPROVAL";
                        return getAllActions(data);
                    },
                    /**
                     * @function getAllUsers
                     * @description To retrieve list of users in ZohoCRM 
                     * @param {object} config - Configuration Object
                     * @param {String} config.Type - Allowed values "AllUsers | ActiveUsers | DeactiveUsers | ConfirmedUsers | NotConfirmedUsers | DeletedUsers | ActiveConfirmedUsers | AdminUsers | ActiveConfirmedAdmins"
                     * @param {number} [config.page] - To get the list of users from the respective pages
                     * @param {number} [config.per_page] - To get the list of users available per page
                     * @return {Promise} Resolved List of users matching specified Type 
                     * @memberof ZOHO.CRM.API
                     * @example
                     * ZOHO.CRM.API.getAllUsers({Type:"AllUsers"})
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     * //prints
                     *{
                     *  "users": [
                     *    {
                     *      "confirm": true,
                     *      "full_name": "NareshTesting ",
                     *      "role": {
                     *        "name": "CEO",
                     *        "id": "3000000029719"
                     *      },
                     *      "territories": [],
                     *      "profile": {
                     *        "name": "Administrator",
                     *        "id": "3000000029725"
                     *      },
                     *      "last_name": null,
                     *      "alias": null,
                     *      "id": "3000000031045",
                     *      "first_name": "NareshTesting",
                     *      "email": "naresh.babu+dev2@zylker.com",
                     *      "zuid": "5073288",
                     *      "status": "active"
                     *    }
                     *  ],
                     *  "info": {
                     *    "per_page": 200,
                     *    "count": 1,
                     *    "page": 1,
                     *    "more_records": false
                     *  }
                     *}
                     */
                    getAllUsers: function(data) {
                        var Type = data.Type;
                        var page = data.page;
                        var per_page = data.per_page;
                        return user({ Type: Type, page: page, per_page: per_page });
                    },
                    /**
                     * @function getUser
                     * @description To retrieve list of users in ZohoCRM 
                     * @param {object} config - Configuration Object
                     * @param {String} config.ID - UserID 
                     * @return {Promise} Resolved user matching userID 
                     * @memberof ZOHO.CRM.API
                     * @example
                     * ZOHO.CRM.API.getUser({ID:"3000000029719"})
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     * //prints
                     *{
                     *  "users": [
                     *    {
                     *      "country": null,
                     *      "role": {
                     *        "name": "CEO",
                     *        "id": "3000000029719"
                     *      },
                     *      "customize_info": {
                     *        "notes_desc": null,
                     *        "show_right_panel": null,
                     *        "bc_view": null,
                     *        "show_home": false,
                     *        "show_detail_view": true,
                     *        "unpin_recent_item": null
                     *      },
                     *      "city": null,
                     *      "signature": null,
                     *      "name_format": "Salutation,First Name,Last Name",
                     *      "language": "en_US",
                     *      "locale": "en_US",
                     *      "personal_account": true,
                     *      "ntc_notification_type": [
                     *        3000000020985,
                     *        3000000020988,
                     *        3000000020991,
                     *        3000000020994,
                     *        3000000020997,
                     *        3000000021012,
                     *        3000000021003,
                     *        3000000021006,
                     *        3000000021009,
                     *        3000000021078,
                     *        3000000021072,
                     *        3000000021075,
                     *        3000000021069,
                     *        3000000021081,
                     *        3000000021084,
                     *        3000000021087
                     *      ],
                     *      "default_tab_group": "0",
                     *      "street": null,
                     *      "alias": null,
                     *      "theme": {
                     *        "normal_tab": {
                     *          "font_color": "#FFFFFF",
                     *          "background": "#222222"
                     *        },
                     *        "selected_tab": {
                     *          "font_color": "#FFFFFF",
                     *          "background": "#222222"
                     *        },
                     *        "new_background": null,
                     *        "background": "#F3F0EB",
                     *        "screen": "fixed",
                     *        "type": "default"
                     *      },
                     *      "id": "3000000031045",
                     *      "state": null,
                     *      "country_locale": "en_US",
                     *      "fax": null,
                     *      "first_name": "NareshTesting",
                     *      "email": "naresh.babu+dev2@zylker.com",
                     *      "telephony_enabled": false,
                     *      "imap_status": false,
                     *      "zip": null,
                     *      "decimal_separator": "en_US",
                     *      "website": null,
                     *      "time_format": "hh:mm a",
                     *      "profile": {
                     *        "name": "Administrator",
                     *        "id": "3000000029725"
                     *      },
                     *      "mobile": null,
                     *      "last_name": null,
                     *      "time_zone": "Asia/Kolkata",
                     *      "zuid": "5073288",
                     *      "confirm": true,
                     *      "rtl_enabled": false,
                     *      "full_name": "NareshTesting ",
                     *      "ezuid": "6ca2127e9d60c217",
                     *      "territories": [],
                     *      "phone": null,
                     *      "dob": null,
                     *      "date_format": "MM/dd/yyyy",
                     *      "ntc_enabled": true,
                     *      "status": "active"
                     *    }
                     *  ]
                     *}
                     */
                    getUser: function(data) {
                        var ID = data.ID;
                        return user({ ID: ID });
                    },
                    /**
                     * @function getRelatedRecords
                     * @description To retrive related list records
                     * @param {object} config - Configuration Object
                     * @param {String} config.Entity - 	SysRefName of the module. 
                     * @param {String} config.RecordID - RecordID to associate the notes. 
                     * @param {String} config.RelatedListName - 	SysRefName of the relatedList. 
                     * @param {Number} [config.page] - To get the list of related records from the respective page.
                     * @param {Number} [config.per_page] - To get the list of related records available per page.

                     * @param {Number} [config.user_id] - fetch emails accessible to this specific userId. 
                     * @param {Number} [config.type] -  Type of emails to fetch 1- Entity Emails, 2 - user Emails , 3 - All IMAP EMAILS , 4 - ALL Contact Emails (Accounts) 
                     * @param {Number} [config.deals_mail] - true/false - either to retrive deals email

                     * @return {Promise} Resolved user matching userID 
                     * @memberof ZOHO.CRM.API
                     * @example
                     * //Fetching related Email 
 					 * ZOHO.CRM.API.getRelatedRecords({Entity:"Leads",RecordID:"111118000000038099",RelatedList:"Emails",type:"2"})
					 * .then(function(response)
					 * {
					 *		var messageId = response.email_related_list[0].message_id;
					 *
					 *		// View a particular email
					 *		return ZOHO.CRM.API.getRelatedRecords({Entity:"Leads",RecordID:"111118000000038099",RelatedList:"Emails",RelatedRecordID:messageId,user_id:"111118000000035850"})				
					 *
					 * })
					 * .then(function(MessageContent){
					 * 	console.log(MessageContent);
					 * }
                     * 
                     * @example
                     * //To fetch the record image 
 					 * ZOHO.CRM.API.getRelatedRecords({Entity:"Leads",RecordID:"111118000000038099",RelatedList:"photo"})
					 * .then(function(response)
					 * {
					 *		var a = document.createElement("a");
					 *		a.href = window.URL.createObjectURL(response); 
					 *		a.download = "recordImage.png"; 
					 *		a.click();
					 *		window.URL.revokeObjectURL(url);
					 * });
                     * @example
                     * ZOHO.CRM.API.getRelatedRecords({Entity:"Leads",RecordID:"1000000030132",RelatedList:"Notes",page:1,per_page:200})
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     * //prints
                     * 
                     *{
                     *  "data": [
                     *    {
                     *      "Owner": {
                     *        "name": "NareshTesting ",
                     *        "id": "3000000031045"
                     *      },
                     *      "Modified_Time": "2017-12-22T03:58:20+05:30",
                     *      "$attachments": null,
                     *      "Created_Time": "2017-12-22T03:58:20+05:30",
                     *      "Parent_Id": {
                     *        "name": "Peterson",
                     *        "id": "3000000040011"
                     *      },
                     *      "$editable": true,
                     *      "$se_module": "Leads",
                     *      "Modified_By": {
                     *        "name": "NareshTesting ",
                     *        "id": "3000000031045"
                     *      },
                     *      "$size": null,
                     *      "$voice_note": false,
                     *      "$status": null,
                     *      "id": "3000000040059",
                     *      "Created_By": {
                     *        "name": "NareshTesting ",
                     *        "id": "3000000031045"
                     *      },
                     *      "Note_Title": null,
                     *      "Note_Content": "Notes2"
                     *    },
                     *    {
                     *      "Owner": {
                     *        "name": "NareshTesting ",
                     *        "id": "3000000031045"
                     *      },
                     *      "Modified_Time": "2017-12-22T03:58:16+05:30",
                     *      "$attachments": null,
                     *      "Created_Time": "2017-12-22T03:58:16+05:30",
                     *      "Parent_Id": {
                     *        "name": "Peterson",
                     *        "id": "3000000040011"
                     *      },
                     *      "$editable": true,
                     *      "$se_module": "Leads",
                     *      "Modified_By": {
                     *        "name": "NareshTesting ",
                     *        "id": "3000000031045"
                     *      },
                     *      "$size": null,
                     *      "$voice_note": false,
                     *      "$status": null,
                     *      "id": "3000000040055",
                     *      "Created_By": {
                     *        "name": "NareshTesting ",
                     *        "id": "3000000031045"
                     *      },
                     *      "Note_Title": null,
                     *      "Note_Content": "Notes1"
                     *    }
                     *  ],
                     *  "info": {
                     *    "per_page": 200,
                     *    "count": 2,
                     *    "page": 1,
                     *    "more_records": false
                     *  }
                     *}
                     */
                    getRelatedRecords: function(data) {
                        return getRelatedRecord(data);
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
					 * To upload Record Image
					 * var file = document.getElementById("attachmentinput").files[0];
				 	 * ZOHO.CRM.API.updateRelatedRecords({Entity:"Leads",RecordID:"111118000000038099",RelatedList:"photo",APIData:file})
					 * .then(function(data)
					 * {
					 *  	console.log(data)
					 * })
                     * @example
                     *  var APIData = {
                     * 	Description:"Test description"
                     *  }
                     *  ZOHO.CRM.API.updateRelatedRecords({Entity:"Leads",RecordID:"1000000079113",RelatedList:"Campaigns",RelatedRecordID:"1000000080041",APIData:APIData})
                     *  .then(function(data){
                     *      console.log(data)
                     *  })
                     * //prints
                     *{
                     *  "data":[
                     *   {
                     *     "code": "SUCCESS",
                     *     "details": {
                     *       "id": 1000000080041
                     *     },
                     *     "message": "relation updated",
                     *     "status": "success"
                     *   }
                     * 	]
                     * }
                     */
                    updateRelatedRecords: function(data) {
                        var Entity = data.Entity;
                        var RecordID = data.RecordID;
                        var RelatedList = data.RelatedList;
                        var RelatedRecordID = data.RelatedRecordID;
                        var APIData = data.APIData;
                        return updateRelatedRecord(Entity, RecordID, RelatedList, RelatedRecordID, APIData);
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
                     *{
                     *  "data": [
                     *    {
                     *      "code": "SUCCESS",
                     *      "details": {
                     *        "id": "3000000040055"
                     *      },
                     *      "message": "record deleted",
                     *      "status": "success"
                     *    }
                     *  ]
                     *}
                     */
                    delinkRelatedRecord: function(data) {
                        var Entity = data.Entity;
                        var RecordID = data.RecordID;
                        var RelatedList = data.RelatedList;
                        var RelatedRecordID = data.RelatedRecordID;
                        return deleteRelatedRecord(Entity, RecordID, RelatedList, RelatedRecordID);
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
					 *	var filesToLoad  = document.getElementById("fileInputTag").files;
					 *	if(filesToLoad)
					 *	{
					 *		var file = filesToLoad[0];
					 *		ZOHO.CRM.API.attachFile({Entity:"Leads",RecordID:"1000000031092",File:{Name:"myFile.txt",Content:file}})
					 *		.then(function(data){
					 *				console.log(data);
					 *		});
					 *	}
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
                    attachFile: function(data) {
                        var Entity = data.Entity;
                        var RecordID = data.RecordID;
                        var File = data.File;
                        var data = {
                            FileName: File.Name,
                            FileData: File.Content
                        }
                        return createRecord(Entity, data, RecordID, "ATTACHMENT");
                    },
                    /**
                     * @function getAllProfiles
                     * @memberof ZOHO.CRM.API
                     * @description To get all the profiles in the app
                     * @returns {Promise} Resolved with all the profiles present in the app
                     * @example
                     * ZOHO.CRM.API.getAllProfiles().then(function(data){
                     * 	console.log(data);
                     * });
                     * 
                     * //prints 
                     *  {
                     *    "profiles": [
                     *     {
                     *        "created_time": null,
                     *        "modified_time": null,
                     *        "name": "Administrator",
                     *        "modified_by": null,
                     *       "description": "This profile will have all the permissions. Users with Administrator profile will be able to view and manage all the data within the organization *. *        account by default.",
                     *        "id": "12000000029855",
                     *        "category": false,
                     *        "created_by": null
                     *      },
                     *      {
                     *        "created_time": null,
                     *        "modified_time": null,
                     *        "name": "Standard",
                     *        "modified_by": null,
                     *        "description": "This profile will have all the permissions except administrative privileges.",
                     *        "id": "12000000029858",
                     *        "category": false,
                     *        "created_by": null
                     *      },
                     *      {
                     *        "created_time": "2018-02-05T14:20:38+05:30",
                     *        "modified_time": "2018-02-05T17:44:58+05:30",
                     *        "name": "TestUser",
                     *        "modified_by": {
                     *          "name": "Arun ",
                     *          "id": "12000000032013"
                     *        },
                     *        "description": "TestUser API",
                     *        "id": "12000000033045",
                     *        "category": true,
                     *        "created_by": {
                     *          "name": "Arun ",
                     *          "id": "12000000032013"
                     *        }
                     *     }
                     *    ]
                     *  }
                     *
                     */
                    getAllProfiles: function(data) {

                        var category = "PROFILES";
                        var type = "GET_ALL_PROFILES";
                        return getAllProfiles(category, type)
                    },
                    /**
                     * @function getProfile
                     * @memberof ZOHO.CRM.API
                     * @description To get a particular profile's details with ProfileID as input
                     * @param {Object} config - Configuration Object.
                     * @param {String} config.ID - ProfileID
                     * @returns {Promise} Resolved with the details of the profile for the given ProfileID
                     * @example
                     * ZOHO.CRM.API.getProfile({ID:"12000000029858"}).then(function(data){
                     * 	console.log(data);
                     * });
                     * 
                     * //prints 
                     * {
                     *	"profiles": [{
                     *		"created_time": null,
                     *		"modified_time": null,
                     *		"permissions_details": [{
                     *				"display_label": "Email Integration ( POP3 / IMAP )",
                     *				"module": null,
                     *				"name": "Crm_Implied_Zoho_Mail_Integ",
                     *				"id": "12000000030788",
                     *				"enabled": true
                     *			},
                     *			{
                     *				"display_label": "BCC Dropbox",
                     *				"module": null,
                     *				"name": "Crm_Implied_BCC_Dropbox",
                     *				"id": "12000000030752",
                     *				"enabled": true
                     *			},
                     *			{
                     *				"display_label": "Show Chat Bar",
                     *				"module": null,
                     *				"name": "Crm_Implied_Chat_Bar",
                     *				"id": "12000000030806",
                     *				"enabled": true
                     *			},
                     *			{
                     *				"display_label": null,
                     *				"module": null,
                     *				"name": "Crm_Implied_Social_Integration",
                     *				"id": "12000000030734",
                     *				"enabled": false
                     *			}
                     *		],
                     *		"name": "Standard",
                     *		"modified_by": null,
                     *		"description": "This profile will have all the permissions except administrative privileges.",
                     *		"id": "12000000029858",
                     *		"category": false,
                     *		"created_by": null,
                     *		"sections": [{
                     *			"name": "template",
                     *			"categories": [{
                     *					"display_label": "Email & Chat Settings",
                     *					"permissions_details": [
                     *						"12000000030788",
                     *						"12000000030752",
                     *						"12000000030806"
                     *					],
                     *					"name": "email_chat"
                     *				},
                     *				{
                     *					"display_label": "Manage Templates",
                     *					"permissions_details": [
                     *						"12000000029984",
                     *						"12000000029987",
                     *						"12000000030698"
                     *					],
                     *					"name": "template"
                     *				}
                     *			]
                     *		}]
                     *	}]
                     * }
                     *
                     */
                    getProfile: function(data) {

                        var category = "PROFILES";
                        var type = "GET_PROFILE";
                        var ID = data.ID;
                        return getProfile(category, type, ID);
                    },
                    /**
                     * @function updateProfile
                     * @memberof ZOHO.CRM.API
                     * @description To update permissions for the given ProfileID
                     * @param {Object} config - Configuration Object.
                     * @param {String} config.ID - ProfileID
                     * @param {Object} config.APIData - Permission Data (PermissionID : true | false)
                     * @returns {Promise} Resolved with a response message (Success or failure ) after updating the permissions
                     * @example
                     * var permissionData = {
                     *     "profiles": [
                     *		{
                     * 				"permissions_details": [
                     *				{
                     * 					"id": "12000000030827",
                     *					"enabled": false
                     *				},
                     *				{
                     *					"id": "12000000029879",
                     *					"enabled": true
                     * 				}
                     * 			]
                     *		}
                     *	]
                     *}
                     * ZOHO.CRM.API.updateProfile({ID:"12000000033045",APIData:permissionData}).then(function(data){
                     * 	console.log(data);
                     * });
                     * 
                     * //prints 
                     * {
                     *  "profiles": [
                     *    {
                     *      "code": "SUCCESS",
                     *      "details": {},
                     *      "message": "profile updated successfully",
                     *      "status": "success"
                     *    }
                     *  ]
                     * }
                     *
                     */
                    updateProfile: function(data) {

                        var category = "UPDATE";
                        var type = "PROFILE";
                        var ID = data.ID;
                        var APIData = data.APIData;
                        return updateProfile(category, type, ID, APIData);
                    },
                    /**
                     * @function getOrgVariable
                     * @memberof ZOHO.CRM.API
                     * @description get plugins configuration data
                     * @returns {Promise} Resolved with Plugin Configuration
                     * @example
                     * ZOHO.CRM.API.getOrgVariable("variableNamespace").then(function(data){
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
                     *
                     *@example
                     *
                     * var data = {apiKeys:["key1","key2","ke3"]};
                     * ZOHO.CRM.API.getOrgVariable(data).then(function(data){
                     *      console.log(data);
                     * });
                     *
                     * //prints
                     *{
                     *"Success":
                     *{
                     *   "content": {
                     *      "apikey": {
                     *         "value": "BNMMNBVHJ"
                     *      },
                     *      "authtoken": {
                     *         "value": "IUYTRERTYUI"
                     *      },
                     *      "apiscret": {
                     *         "value": "848ksmduo389jd"
                     *      }
                     *   }
                     *}
                     *}
                     *
                     *
                     */
                    getOrgVariable: function(nameSpace) {
                        return config("VARIABLE", nameSpace);
                    },
                    /**
                     * @function sendMail
                     * @memberof ZOHO.CRM.API
                     * @description To send mails
                     * @param {Object} config - Configuration Object.
                     * @param {String} config.RecordID - RecordID
                     * @param {String} config.Entity - SysRefName of the module.
                     * @param {Object} config.APIData - config json
                     * @param {Object} config.APIData.from - object that contains username and email address
                     * @param {Object} config.APIData.to - object that contains username and email address
                     * @param {List} config.APIData.cc - list of objects that contains username and email address
                     * @param {List} config.APIData.bcc - list of objects that contains username and email address
                     * @param {String} config.APIData.reply_to - reply email address
                     * @param {String} config.APIData.subject - subject of the mail
                     * @param {String} config.APIData.content - content of the mail
                     * @param {String} config.APIData.mail_format - format of the mail, it should be <b>text</b> or <b>html</b>
                     * @param {String} config.APIData.scheduled_time - scheduled_time
                     * @param {String} config.APIData.template_id - email template_id 
                     * @param {List} config.APIData.attachments -list of object that contains encrypted fileid,service_name and file_name.If you use <b>uploadFile</b> api no need to provide service_name and file_name
                     * @param {boolean} config.APIData.org_email - org_email it can be <b>true</b> or <b>false</b>
                     * @param {boolean} config.APIData.consent_email - consent_email it can be <b>true</b> or <b>false</b>
                     * @param {String} config.APIData.in_reply_to - mail id, for which mail you want to reply
                     * @param {String} config.APIData.layout_id - layout id
                     * @param {String} config.APIData.paper_type - paper type, it can be <b>USLetter</b> or <b>default</b> or <b>A4</b>
                     * @param {String} config.APIData.view_type - view type,it can be <b>landscape</b> or <b>portrait</b>
                     * @param {String} config.APIData.layout_name - layout name
                     * @param {Object} config.APIData.data_subject_request - object that contains id and type. type can be "access|export|rectify"
                     * @see <b>from</b> and <b>to</b> are mandatory
                     * @see <b>org_email</b> can be use if you configured organization Emails otherwise no need to send this param
                     * @see <b>layout_id,paper_type,view_type,layout_name</b> are mandatory for inventory modules(quotes,sales_order,purchase_order,invoices). No need to send these params for remaining modules
                     * @see If the content contains any inline images upload the image using <b>uploadFile</b> api which gives the encrypted file id and use that id in <b>&lt;img src&gt;</b> tag
                     * @see exmaple of inline image url is like <b>"&lt;img src='https://&lt;base-url&gt;/crm/viewInLineImage?fileContent=3454678908978675434567890876543456789087675645567980'&gt;</b>"
                     * @see <b>in_reply_to</b> is mandatory if you want to reply for previously sent mail.
                     * @returns {Promise} Resolved with send mail response
                     * @example
                     *{
                     *   "data" : [
                     *       {
                     *           "from":{ "user_name" : "user1" , "email" : "user1email@zoho.com" } ,
                     *           "to":[ { "user_name" : "user2" , "email" : "user2email@zoho.com" }],
                     *           "cc":[ { "user_name" : "user3" , "email" : "user3email@zoho.com" }],
                     *           "bcc":[ { "user_name" : "user4" , "email" : "user4email@zoho.com" }],
                     *           "reply_to":{ "user_name" : "user5" , "email" : "user5email@zoho.com" },
                     *           "subject":"Mail subject",
                     *           "content":"content of the mail",
                     *           "mail_format" : "text",
                     *           "scheduled_time":"2019-05-5T05:12:12+05:30",
                     *           "template_id":"1230000673432543545446",
                     *           "attachments": [ { "id" : "encrypted_id"}],
                     *           "org_email":true,
                     *           "consent_email":true,
                     *           "in_reply_to" : "123456" ,
                     *           "layout_id" : "1234567654343233223",
                     *           "paper_type" : "USLetter" ,
                     *           "view_type" : "portrait",
                     *           "layout_name" : "QT_layout",
                     *           "data_subject_request" : {
                     *           "id" : "32323232332",
                     *           "type" : "access"
                     *           }
                     *       }
                     *   ]
                     *}
                     * var data = {Entity:"Leads",RecordID:"345678909876",APIData:mailData};
                     * ZOHO.CRM.API.sendMail(data).then(function(data){
                     *      console.log(data);
                     * });
                     *
                     * //prints
                     *{
                     *"data":[
                     *   {
                     *       "code": "SUCCESS",
                     *       "details": {
                     *       "message_id" : "werttrew123452sdfg"
                     *   },
                     *   "message": "Your mail has been sent successfully",
                     *   "status": "success"
                     *   }
                     *   ]
                     *}
                     *
                     *
                     */
                    sendMail: function(data) {
                        return sendMail(data);
                    },

                },
                /**
                 * @module ZOHO.CRM.UI
                 */
                UI: {
                    /**
                     * @namespace ZOHO.CRM.UI
                     */
                    /**
                     * @function Resize
                     * @description Resize Widget to the given dimensions
                     * @param {Object} dimensions - Dimension of Dialer.
                     * @param {Integer} dimensions.height - Height in px
                     * @param {Integer} dimensions.width - Width in px
                     * @returns {Promise} resolved with true | false
                     * @memberof ZOHO.CRM.UI
                     * @example
                     * ZOHO.CRM.UI.Resize({height:"200",width:"1000"}).then(function(data){
                     * 	console.log(data);
                     * });
                     * 
                     * //prints 
                     * True
                     *
                     */
                    Resize: function(data) {
                        var data = {
                            action: "RESIZE",
                            data: {
                                width: data.width,
                                height: data.height
                            }
                        };
                        return manipulateUI(data);
                    },
                    /**
                     * @namespace ZOHO.CRM.UI.Setting
                     */
                    Setting: {
                        /**
                         * @function open
                         * @description Opens specified settingPage
                         * @param {object} data - Configuration Object
                         * @param {String} data.APIName -    APIName of the widget or url path. 
                         * @param {String} data.webTabMessage -Custom message to be passed to the widget
                         * @returns {Promise} resolved with true | false
                         * @memberof ZOHO.CRM.UI.Setting
                         * @example
                         * var data = {
                         *  "APIName" : "widgetname__settingname",
                         *  "webTabMessage": {
                         *        "xxxx":"13257389",
                         *        "yyyy":"abcjds",
                         *        "zzzz":"@*&#*$",
                         *   }
                         * }
                         * ZOHO.CRM.UI.Setting.open(data).then(function(response){
                         *     console.log(response)
                         * })
                         */
                        open: function(data) {
                            var data = {
                                action: {
                                    setting: "OPEN"
                                },
                                data: data
                            };
                            return manipulateUI(data);
                        }
                    },
                    /**
                     * @namespace ZOHO.CRM.UI.Dialer
                     */
                    Dialer: {
                        /**
                         * @function maximize
                         * @description maximizes the CallCenter Window
                         * @returns {Promise} resolved with true | false
                         * @memberof ZOHO.CRM.UI.Dialer
                         */
                        maximize: function() {
                            var data = {
                                action: {
                                    telephony: "MAXIMIZE"
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
                        minimize: function() {
                            var data = {
                                action: {
                                    telephony: "MINIMIZE"
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
                        notify: function() {
                            var data = {
                                action: {
                                    telephony: "NOTIFY"
                                }
                            };
                            return manipulateUI(data);
                        },
                    },
                    /**
                     * @namespace ZOHO.CRM.UI.Record
                     */
                    Record: {
                        /**
                         * @function open
                         * @description Open DetailPage of the specified Record
                         * @param {object} data - Configuration Object
                         * @param {String} data.Entity - 	SysRefName of the module. 
                         * @param {String} data.RecordID - RecordID to open  
                         * @param {String} data.Target - Allowed values "_blank"
                         * @returns {Promise} resolved with true | false
                         * @memberof ZOHO.CRM.UI.Record
                         * @example
                         * //To open record in same window
                         * ZOHO.CRM.UI.Record.open({Entity:"Leads",RecordID:"1000000036062"})
                         * .then(function(data){
                         *     console.log(data)
                         * })
                         * @example
                         * //To open record in new tab
                         * ZOHO.CRM.UI.Record.open({Entity:"Leads",RecordID:"1000000036062",Target:"_blank"})
                         * .then(function(data){
                         *     console.log(data)
                         * })
                         */
                        open: function(data) {
                            /*
                             * fetch TabName from sysrefName 
                             */
                            var data = {
                                action: {
                                    record: "OPEN"
                                },
                                data: {
                                    Entity: data.Entity,
                                    RecordID: data.RecordID,
                                    target:data.Target
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
                         * @param {String} data.Target - Allowed values "_blank"
                         * @returns {Promise} resolved with true | false
                         * @memberof ZOHO.CRM.UI.Record
                         * @example
                         * //To open record in same window
                         * ZOHO.CRM.UI.Record.edit({Entity:"Leads",RecordID:"1000000036062"})
                         * .then(function(data){
                         *     console.log(data)
                         * })
                         * @example
                         * //To open record edit in new tab
                         * ZOHO.CRM.UI.Record.edit({Entity:"Leads",RecordID:"1000000036062",Target:"_blank"})
                         * .then(function(data){
                         *     console.log(data)
                         * })
                         */
                        edit: function(data) {
                            /*
                             * fetch TabName from sysrefName 
                             */
                            var data = {
                                action: {
                                    record: "EDIT"
                                },
                                data: {
                                    Entity: data.Entity,
                                    RecordID: data.RecordID,
                                    target:data.Target
                                }
                            };
                            return manipulateUI(data);
                        },
                        /**
                         * @function create
                         * @description Open CreatePage of the specified Record
                         * @param {object} data - Configuration Object
                         * @param {String} data.Entity - 	SysRefName of the module.  
                         * @param {String} data.Target - Allowed values "_blank" 
                         * @returns {Promise} resolved with true | false
                         * @memberof ZOHO.CRM.UI.Record
                         * @example
                         * //To open record creation in same window
                         * ZOHO.CRM.UI.Record.create({Entity:"Leads"})
                         * .then(function(data){
                         *     console.log(data)
                         * })
                         * @example
                         * //To open record in new tab
                         * ZOHO.CRM.UI.Record.create({Entity:"Leads",Target:"_blank"})
                         * .then(function(data){
                         *     console.log(data)
                         * })
                         */
                        create: function(data) {
                            /*
                             * fetch TabName from sysrefName 
                             */
                            var data = {
                                action: {
                                    record: "CREATE"
                                },
                                data: {
                                    Entity: data.Entity,
                                    RecordID: data.RecordID,
                                    target:data.Target
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
                         * @see In recordData <b>just_sub_form</b> is a subform sysrefname. you can send the list of subform fields object 
                         * @example
                         *  var recordData = {
                         *       "Company": "zoho",
                         *       "Last_Name": "uk",
                         *      "just_sub_form":[
                         *          {
                         *            "name1":"uk",
                         *            "email":"uk@zoho.com"
                         *          },
                         *          {
                         *            "name1":"mail",
                         *            "email":"mail@zoho.com"
                         *          }
                         *      ]
                         * }
                         * ZOHO.CRM.UI.Record.populate(recordData)
                         * .then(function(data){
                         *     console.log(data)
                         * })
                         */
                        populate: function(recordData) {
                            /*
                             * fetch TabName from sysrefName 
                             */
                            var data = {
                                action: {
                                    record: "POPULATE"
                                },
                                data: recordData
                            };
                            return manipulateUI(data);
                        }
                    },
                    /**
                     * @namespace ZOHO.CRM.UI.Popup
                     */
                    Popup: {
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
                        close: function() {
                            /*
                             * fetch TabName from sysrefName 
                             */
                            var data = {
                                action: {
                                    popup: "CLOSE"
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
                        closeReload: function() {
                            /*
                             * fetch TabName from sysrefName 
                             */
                            var data = {
                                action: {
                                    popup: "CLOSE_RELOAD"
                                }
                            };
                            return manipulateUI(data);
                        },
                    },
                    /**
                     * @namespace ZOHO.CRM.UI.WebTab
                     */
                    WebTab: {
                        /**
                         * @function open
                         * @description open a WebTab Widget with custom onLoad Data 
                         * @returns {Promise} resolved with true | false
                         * @memberof ZOHO.CRM.UI.WebTab
                         * @example
                         * var message = {
                         * 		arg1:"Argument 1",
                         * 		arg2:"Argument 2",
                         * 		arg3Nested:{
                         * 				subArg1:"SubArgument 1",
                         * 				subArg2:"SubArgument 2",
                         * 				subArg3:"SubArgument 3",
                         * 			}
                         * }
                         * 
                         * ZOHO.CRM.UI.WebTab.open({Entity:"WebTab1_Widget",Message:message})
                         * .then(function(data){
                         *     console.log(data)
                         * })
                         */
                        open: function(data) {
                            /*
                             * fetch TabName from sysrefName 
                             */
                            var data = {
                                action: {
                                	webTab: "OPEN"
                                },
                                data : data
                            };
                            return manipulateUI(data);
                        },
                        history : 
                        {
                        	/**
                        	 * 
                        	 * @function pushState
                        	 * @description Pushed custom data to webTab URL as param (Supported only for WebTab widget)
                        	 * @param {Object} config - configuration object
                        	 * @returns {Promise} Resolved with true or false   
                        	 * @memberof ZOHO.CRM.UI.WebTab
                        	 * @example
                        	 * var config = {name:"peter",location:"chennai"};
                        	 * ZOHO.CRM.UI.WebTab.history.pushState(config)
                        	 * .then(function(result){
                        	 *	console.log(result)
                        	 * })
                        	 * 
                        	 * //prints
                        	 * true
                        	 */
                        	pushState:function(data){
                                var data = {
                                        action: {
                                        	webTab: "HISTORY"
                                        },
                                        data : data
                                    };
                                return manipulateUI(data);
                            },
                        }
                    }

                },
                /**
                 * @namespace ZOHO.CRM.HTTP
                 */
                HTTP: {
                    /**
                     * @function get
                     * @description Invoke  HTTP get
                     * @returns {Promise} resolved with response of the initiated request
                     * @memberof ZOHO.CRM.HTTP
                     * @param {Object} request - Request Object
                     * @param {Object} request.params - Request Params
                     * @param {Object} request.headers - Request Headers
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
                     *         "email": "naresh.babu+demo1@zylker.com",
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
                     *         "email": "naresh.babu+demo2@zylker.com",
                     *         "status": "active"
                     *       }
                     *     ]
                     *   }
                     * }
                     */
                    get: function(data) {
                        return remoteCall(HTTPRequest.GET, data);
                    },
                    /**
                     * @function post
                     * @description Invoke HTTP post
                     * @returns {Promise} resolved with response of the initiated request
                     * @memberof ZOHO.CRM.HTTP
                     * @param {Object} request - Request Object
                     * @param {Object} request.params - Request Params
                     * @param {Object} request.headers - Request Headers
                     * @param {Object} request.body - Request Body
                     * @example
                     * var data ='<Contacts><row no="1"><FL val="First Name">Amy</FL><FL val="Last Name">Dawson</FL><FL val="Email">testing@testing.com</FL><FL val="Title">Manager</FL><FL val="Phone">1234567890</FL><FL val="Mobile">292827622</FL><FL val="Account Name"> <![CDATA["A & A"]]> </FL></row></Contacts>';
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
                     *<?xml version="1.0" encoding="UTF-8"?>
					 *<response uri="/crm/private/xml/Contacts/insertRecords">
					 *  <result>
					 *    <message>Record(s) added successfully</message>
					 *    <recorddetail>
				 	 *      <FL val="Id">457154000000952001</FL>
					 *      <FL val="Created Time">2018-10-24 13:55:56</FL>
					 *      <FL val="Modified Time">2018-10-24 13:55:56</FL>
					 *      <FL val="Created By"><![CDATA[NareshAutomation]]></FL>
					 *      <FL val="Modified By"><![CDATA[NareshAutomation]]></FL>
					 *    </recorddetail>
					 *  </result>
					 *</response>
					 *
					 *@example
					 * //To handle multipart data
					 * var file = document.getElementById("uploadFile").files[0]; 
					 * var request ={ 
					 *         url : "https://apidocs.localzoho.com/files/v1/upload", 
					 *         params:{ 
					 *             scope:"docsapi", 
					 *             authtoken:"1511e****************************19101f" 
					 *         }, 
					 *         "CONTENT_TYPE":"multipart", 
					 *         "PARTS":[ 
					 *             { 
					 *                 "headers": "filename", 
					 *                 "content": file.name 
					 *             }, 
					 *             { 
					 *                 "headers": "content", 
					 *                 "content": "__FILE__" 
					 *             } 
					 *         ], 
					 *         "FILE":{ 
					 *             "fileParam":"content", 
					 *             "file":file 
					 *         } 
					 * } 
					 * ZOHO.CRM.HTTP.post(request) 
					 * .then(function(data){ 
					 * console.log(data) 
					 * })
                     */
                    post: function(data) {
                        return remoteCall(HTTPRequest.POST, data);
                    },
                    /**
                     * @function put
                     * @description Invoke HTTP put
                     * @returns {Promise} resolved with response of the initiated request
                     * @memberof ZOHO.CRM.HTTP
                     * @param {Object} request - Request Object
                     * @param {Object} request.params - Request Params
                     * @param {Object} request.headers - Request Headers
                     * @param {Object} request.body - Request Body
                     * @example
                     * var apidata =[
                     *{
                     *	"Last_Name":"testupdate",
                     *	id:"457154000000952001"
                     *}
                     *]
                     *
                     *
                     * var request ={
                     *      url : "https://crm.zoho.com/crm/v2/Contacts",
                     *      headers:{
                     *          Authorization:"******************************",
                     *      },
                     *      body:{data:apidata}
                     * }
                     * ZOHO.CRM.HTTP.put(request)
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     * 
                     * //Prints
                     *{
					 *  "data": [
					 *    {
					 *      "code": "SUCCESS",
					 *      "details": {
					 *        "Modified_Time": "2018-10-24T14:08:57+05:30",
					 *        "Modified_By": {
					 *          "name": "NareshAutomation",
					 *          "id": "457154000000148011"
					 *        },
					 *        "Created_Time": "2018-10-24T13:55:56+05:30",
					 *        "id": "457154000000952001",
					 *        "Created_By": {
					 *          "name": "NareshAutomation",
					 *          "id": "457154000000148011"
					 *        }
					 *      },
					 *      "message": "record updated",
					 *      "status": "success"
					 *    }
					 *  ]
					 *}
                     */
                    put: function(data) {
                        return remoteCall(HTTPRequest.PUT, data);
                    },
                    /**
                     * @function patch
                     * @description Invoke HTTP patch
                     * @returns {Promise} resolved with response of the initiated request
                     * @memberof ZOHO.CRM.HTTP
                     * @param {Object} request - Request Object
                     * @param {Object} request.params - Request Params
                     * @param {Object} request.headers - Request Headers
                     * @param {Object} request.body - Request Body
                     * @example
                     * var data ={
                     * name:"name",
                     * age:"23"
                     * };
                     * var request ={
                     *      url : "https://www.example.com/patch",
                     *      params:{
                     *          scope:"apiscope",
                     *      },
                     *      headers:{
                     *          Authorization:"******************************",
                     *      },
                     *      body:data
                     * }
                     * ZOHO.CRM.HTTP.patch(request)
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     * 
                     * //Prints
                     * 
                     *{
					 *  "args": {},
					 *  "data": "",
					 *  "files": {},
					 *  "form": {},
					 *  "headers": {
					 *    "Accept": "application/json",
					 *    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
					 *    "Content-Length": "0"
					 *  },
					 *  "json": null,
					 *  "url": "https://www.example.com/patch"
					 *}
                     * 
                     */
                    patch: function(data) {
                        return remoteCall(HTTPRequest.PATCH, data);
                    },
                    /**
                     * @function delete
                     * @description Invoke HTTP delete
                     * @returns {Promise} resolved with response of the initiated request
                     * @memberof ZOHO.CRM.HTTP
                     * @param {Object} request - Request Object
                     * @param {Object} request.params - Request Params
                     * @param {Object} request.headers - Request Headers
                     * @param {Object} request.body - Request Body
                     * @example
                     * var request ={
                     *      url : "https://crm.zoho.com/crm/v2/Leads/111158000000045188",
                     *      headers:{
                     *          Authorization:"******************************",
                     *      }
                     * }
                     * ZOHO.CRM.HTTP.delete(request)
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     * 
                     * //Prints
                     * 
                     *{
                     *  "data": [
                     *    {
                     *      "code": "SUCCESS",
                     *      "details": {
                     *        "id": "111158000000045188"
                     *      },
                     *      "message": "record deleted",
                     *      "status": "success"
                     *    }
                     *  ]
                     *}
                     * 
                     */
                    delete: function(data) {
                        return remoteCall(HTTPRequest.DELETE, data);
                    }
                },
                /**
                 * @namespace ZOHO.CRM.CONNECTOR
                 */
                CONNECTOR: {
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
                     * var data = {
                     *          "apikey":"**********",
                     *          "name":"peter",
                     *          "email":"john@mail.com"
                     * }
                     *  ZOHO.CRM.CONNECTOR.invokeAPI("MailChimp.sendSubscription",data)
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     * @example
                     * var data =	{
                     * 	 "VARIABLES":{
                     *           "apikey" : "*********", 
                     *           "First_Name" : "Naresh", 
                     *           "Last_Name" : "Babu", 
                     *           "email" : "naresh.babu@zylker.com"
                     *         },
                     *      "HEADERS":{
                     *            "RESPONSE_TYPE":"stream"
                     *       }
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
                    invokeAPI: function(nameSpace, data) {
                        return remoteCall(nameSpace, data, "CONNECTOR_API");
                    },
                     /**
                     * @function authorize
                     * @description Prompts the Connector Authorize window  
                     * @returns {Promise} resolved with true on successful Authorization 
                     * @memberof ZOHO.CRM.CONNECTOR
                     * @param {String} nameSpace - NameSpace of Connector to authorize
                     * @example
                     * var connectorName = "zoho.authorize";
                     * ZOHO.CRM.CONNECTOR.authorize(connectorName);
                     *
                     */
                    authorize: function(nameSpace) {
                        return remoteCall(nameSpace, {}, "CONNECTOR_AUTHORIZE");
                    },
                     /**
                     * @function isConnectorAuthorized
                     * @description check the connector is authorized or not.  
                     * @returns {Promise} resolved with true or false
                     * @memberof ZOHO.CRM.CONNECTOR
                     * @param {String} nameSpace - NameSpace of Connector 
                     * @example
                     * var connectorName = "zoho.authorize";
                     * ZOHO.CRM.CONNECTOR.isConnectorAuthorized(connectorName).then(function(result){
                     *  console.log(result) 
                     *});
                     * //prints
                     * true
                     *
                     */
                     isConnectorAuthorized: function(nameSpace) {
                        return remoteCall(nameSpace,{invokeType:"ISAUTHORIZE"}, "CONNECTOR_API");
                    },
                    /**
                     * @function revokeConnector
                     * @description revoke authorized Connector  
                     * @returns {Promise} resolved with response of the Connector revoke
                     * @memberof ZOHO.CRM.CONNECTOR
                     * @param {String} nameSpace - NameSpace of Connector to revoke
                     * @example
                     *   ZOHO.CRM.CONNECTOR.revokeConnector("zoho.accounts")
                     *   .then(function(data){
                     *       console.log(data)
                     *   })
                     *
                     * //prints
                     *{
                     *    "RESULT": "success"
                     * }
                     */
                     revokeConnector: function(nameSpace) {
                         return remoteCall(nameSpace, {}, "CONNECTOR_REVOKE");
                     }
                },
                /**
                 * @namespace ZOHO.CRM.CONNECTION
                 */
                CONNECTION: {
                    /**
                     * @function invoke
                     * @description Invoke a Connection
                     * @returns {Promise} resolved with response of the connection made
                     * @memberof ZOHO.CRM.CONNECTION
                     * @param {String} conn_name - Connection Name
                     * @param {Object} req_data - Request Data
                     * @example
                     * var conn_name = "mailchimp4";
                     * var req_data ={
                     *   "parameters" : { 
                     *       "param1" : "paramvalue1",
                     *       "param2" : "paramvalue2" 
                     *   },
                     *   "headers" : { 
                     *       "header1" : "headervalue1", 
                     *       "header2" : "headervalue2" 
                     *   },
                     *   "method" : "POST",
                     *   "url" : "http://mailchimp.api/sample_api",
                     *   "param_type" : 1
                     * };
                     * ZOHO.CRM.CONNECTION.invoke(conn_name, req_data)
                     * .then(function(data){
                     *     console.log(data)
                     * })
                     *
                     * //Prints
                     * {
                     *   "code" : "SUCCESS",
                     *   "details" : {
                     *       "CODE" : 200,
                     *       "message" : "action completed successfully",
                     *       "status" : "Success"
                     *    },
                     *   "message" : "Connection invoked successfully",
                     *   "status" : "success"
                     *  }
                     */
                    invoke:function(conn_name, req_data){
                    var request = {};
                    var reqObj = {};
                    reqObj.url = req_data.url;
                    reqObj.method = req_data.method;
                    reqObj.param_type = req_data.param_type;
                    reqObj.parameters = JSON.stringify(req_data.parameters);
                    reqObj.headers = JSON.stringify(req_data.headers);
                    request.data = reqObj;
                    var data = {
                    category : "CRM_CONNECTION",//no i18n
                    connectionName:conn_name,
                    data : request
                    };
                    return newRequestPromise(data);
                    }
                }
            };
        })()
    }
})();