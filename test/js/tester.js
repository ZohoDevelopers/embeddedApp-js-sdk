describe("JS SDK TestCase", function() {
	var TestSpec={};
	beforeAll(function(done) {
		ZOHO.embeddedApp.init()
		.then(function(){
			done();
		});
	});
	   var originalTimeout;
	    beforeEach(function() {
	        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
	        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
	    });
	    afterEach(function() {
	        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	    });
	it("Fetches all record from Leads", function(done) {
	    
		  ZOHO.CRM.API.getAllRecords({Entity:"Leads"})
			.then(function(data){
				console.log(data);
				if(data && typeof(data) === 'object' && data instanceof Array ){
					expect(true).toBe(true);
				}
				else
				{
					expect(true).toBe(false);        
				}
				done();
			})
	  });
	  
	  it("Insert Record into Leads", function(done) {
		  var recordData = {
					"Company": "Zylker",
					"Last_Name": "Peterson"
			}
			ZOHO.CRM.API.insertRecord({Entity:"Leads",APIData:recordData})
			.then(function(data){
				console.log(data);
				if(data && typeof(data) === 'object' && data[0] && data[0].code==='SUCCESS'){
					TestSpec.leadID = data[0].details.id;
					expect(true).toBe(true);
				}
				else
				{
					expect(true).toBe(false);        
				}
				done();
			})
		  });
	  it("Delete Record from Leads", function(done) {
		  if(!TestSpec.leadID){
			  expect(true).toBe(false);
			  done();
		  }
		  ZOHO.CRM.API.deleteRecord({Entity:"Leads",RecordID: TestSpec.leadID})
			.then(function(data){
				console.log(data);
				if(data && typeof(data) === 'object' && data[0] && data[0].code==='SUCCESS'){
					expect(true).toBe(true);
				}
				else
				{
					expect(true).toBe(false);        
				}
				delete TestSpec.leadID; 
				done();
			})
		  });
});
