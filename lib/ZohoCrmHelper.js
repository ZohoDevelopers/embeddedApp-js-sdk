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
		}
		$.extend(data,config)
		return newRequestPromise(data);
	}
	return{
		CONFIG:{
			get : function(){
				
			}
		},
		API:{
			addNotes : function(data)
			{
				/*
				 * {	
				 * 	Entity : "Leads" 
				 *  RecordID : "1000000033001"
				 *  Title : "Notes Title"
				 *  Content : "Notes Content"
				 * }
				 */
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
			getRecord :function(data)
			{
				/*
				 * {	
				 * 	Entity : "Leads",
				 *  RecordID : "1000000033001"
				 * }
				 */
				var Entity = data.Entity;
				var RecordID = data.RecordID;
				return getRecord(Entity,RecordID);
			},
			getPageInfo :function()
			{
				var data = {
						category : "PageInfo"//no i18n
				};
				return newRequestPromise(data);
			}
		},
		UI:
		{
			telephony:
			{
				maximize : function(){
					var data = {
						action	: {
							telephony : "maximize"
						}	
					};
					return manipulateUI(data);
				},
				minimize : function(){
					var data = {
							action	: {
								telephony : "minimize"
							}	
						};
						return manipulateUI(data);
				},
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