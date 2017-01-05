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
				Action : "Create",//no i18n
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
			Action : "Read",//no i18n
			Entity : Entity,
			RecordID : recordID
		};
		return newRequestPromise(data);
	};
	function getPageInfo()
	{
		var data = {
				Action : "PageInfo"//no i18n
		};
		return newRequestPromise(data);
	};
	return{
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
			return getPageInfo();
		}
	};
})();