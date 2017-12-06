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
	/*
	 * Getch The Lead using the RecordID and verify its data
	 */
	it("get current Record Info", function(done)
	{
		var onloadData = TestSpec.onLoadData;
		TestCases.getMultipleRecord(onloadData.Entity,onloadData.EntityId,function(result){
			expect(result).toBe(true);
			done();
		});
	});
});
