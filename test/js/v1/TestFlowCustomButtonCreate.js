describe("SDK Testing", function() {
	beforeAll(function(done) 
	{
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
		ZOHO.embeddedApp.on("PageLoad",function(data){
			TestSpec.onLoadData = data
			done();
		})
		ZOHO.embeddedApp.init()
	});
	afterAll(testCompleted);
	/*
	 * Getch The Lead using the RecordID and verify its data
	 */
	it("Populate and verify form", function(done)
	{
		var url = new URL(window.location.href);
		var actionType = url.searchParams.get("action");
		
		
		if(actionType === 'verify')
		{
			TestCases.validateForm(TestSpec.onLoadData,function(result){
				expect(result).toBe(true);
				done();
			});	
		}
		else if(actionType === 'populate')
		{
			ZOHO.CRM.UI.Record.populate(TestSpec.recordData)
			.then(function(data){
				expect(data).toBe(true);
				done();
			})
			
		}
	});
});
