describe("SDK Testing", function() {
	var TestSpec={
		recordID:undefined,
		recordData : {
		        "Company": "Zylker",
		        "Last_Name": "Peterson"
		  }
	};
	beforeAll(function(done) 
	{
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
		ZOHO.embeddedApp.init()
		.then(function()
		{
			done();
		});
	});

	/*
	 * Get All records with no data
	 */
	it("getAll with No Data", function(done)
	{
		  TestCases.getAllRecord(function(result){
			expect(result).toBe(false);
		  	done();
		  });
  	});
  	/*
	 * Insert a new Record into the system
	 */
	it("Insert Lead", function(done)
	{
		TestCases.insertRecord("Leads",TestSpec.recordData,function(result,recordID){
			TestSpec.recordID = recordID;
			expect(result).toBe(true);
			done();
		});
	});
	/*
	 * Getch The Lead using the RecordID and verify its data
	 */
	it("get Lead", function(done)
	{
		TestCases.getRecord("Leads",TestSpec.recordID,TestSpec.recordData,function(result){
			expect(result).toBe(true);
			done();
		});
	});


	it("getAll with Data", function(done)
	{
		  TestCases.getAllRecord(function(result){
			expect(result).toBe(true);
		  	done();
		  });
  	});
	it("Delete Lead", function(done)
	{
		TestCases.deleteRecord("Leads",TestSpec.recordID,function(result){
			expect(result).toBe(true);
			done();
		});
  	});
  	it("getAll with No Data", function(done)
	{
		  TestCases.getAllRecord(function(result){
			expect(result).toBe(false);
		  	done();
		  });
  	});
});
