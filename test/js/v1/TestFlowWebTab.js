describe("SDK Testing", function() {
	beforeAll(function(done) 
	{
jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
		ZOHO.embeddedApp.init()
		.then(function()
		{
			done();
		});
	});
  afterAll(testCompleted);
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
	 * add notes to the created record
	 */
	it("add notes", function(done)
	{
		TestCases.addNotes("Leads",TestSpec.recordID,function(result){
			expect(result).toBe(true);
			done();
		});
	});
	/* 
	 * get all actions 
	 */
	it("get All Actions", function(done)
	{
		TestCases.getAllActions("Leads",TestSpec.recordID,function(result){
			expect(result).toBe(true);
			done();
		});
	});
	/*
	 * get all profiles
	 */
	it("get All profiles", function(done)
	{
		TestCases.getAllProfiles("Leads",TestSpec.recordID,function(result){
			expect(result).toBe(true);
			done();
		});
	});
	/*
	 * get ProfileDetails
	 */
	it("get profile details", function(done)
	{
		TestCases.getProfile(TestSpec.profileId,function(result){
			expect(result).toBe(true);
			done();
		});
	});
	/*
	 * upsert api without duplicate fields
	 */
	it("upsert without duplicate fields", function(done)
	{
		TestCases.upsertRecordWithoutDuplicate("Leads",TestSpec.upsertData,function(result){
			expect(result).toBe(true);
			done();
		});
	});
	/*
	 * upsert api with duplicate fields -- website
	 */
	it("upsert with duplicate fields (Website)", function(done)
	{
		TestCases.upsertWithDuplicateField("Leads",TestSpec.upsertData,function(result){
			expect(result).toBe(true);
			done();
		});
	});
	/*
	 * get approval records
	 */
	it("get approval records", function(done)
	{
		TestCases.getApprovalRecords(function(result){
			expect(result).toBe(true);
			done();
		});
	});
	/*
	 * get approval records by id
	 */
	it("get approval recordById", function(done)
	{
		TestCases.getApprovalRecordById(TestSpec.approvalID,function(result){
			expect(result).toBe(true);
			done();
		});
	});
	/*
	 * get approval records by id
	 */
	it("approve record", function(done)
	{
		TestCases.approveRecord("Leads",TestSpec.recordID,"approve",function(result){
			expect(result).toBe(true);
			done();
		});
	});
	/*
	 * get approval History
	 */
	it("get approvalHistory", function(done)
	{
		TestCases.getApprovalHistory(function(result){
			expect(result).toBe(true);
			done();
		});
	});
	/*
	 * get Blueprint details
	 */
	it("get blueprint", function(done)
	{
		TestCases.getBlueprint("Leads",TestSpec.recordID,function(result){
			expect(result).toBe(true);
			done();
		});
	});
	/*
	 * update blue print
	 */
	it("update blue print", function(done)
	{
		var BlueprintData = 
		{
		 "blueprint": [
		   {
		     "transition_id":TestSpec.blueprintId,
		     "data": {
		       "Phone": "8940372937",
		       "Notes": "Updated via blueprint"
		     }
		   }
		 ]
		}
		TestCases.updateBluePrint("Leads",TestSpec.recordID,BlueprintData,function(result){
			expect(result).toBe(true);
			done();
		});
	});
	/*
	 * Get All records
	 */
	it("getAll Records", function(done)
	{
		  TestCases.getAllRecord(function(result){
			expect(result).toBe(true);
		  	done();
		  });
  	});
	/*
	 * Getch The Lead using the RecordID and verify its data
	 */
	it("verify inserted Lead", function(done)
	{
		TestCases.verifyRecord("Leads",TestSpec.recordID,TestSpec.recordData,function(result){
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
  	it("getAll Users", function(done)
	{
		  TestCases.getUser(undefined,function(result,userID){
		  	TestSpec.userID = userID;
			expect(result).toBe(true);
		  	done();
		  });
  	});
  	it("getUserByID", function(done)
	{
		if(!TestSpec.userID){
			expect(true).toBe(false);
		}
		else
		{
			TestCases.getUser(TestSpec.userID,function(result){
				expect(result).toBe(true);
		  		done();
		  	});	
		}
		  
  	});
  	it("getOrgVariable1",function(done){
  		TestCases.getOrgVariable(TestSpec.orgVariable1,function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
    it("getOrgVariable2",function(done){
      TestCases.getOrgVariable(TestSpec.orgVariable2,function(result){
        expect(result).toBe(true);
        done();
      });
    });
    it("getMultipleOrgvariable",function(done){
        TestCases.getMultipleOrgvariable(TestSpec.multipleOrgVariable,function(result){
          expect(result).toBe(true);
          done();
        });
      });
  	it("checkHtttpRequst",function(done){
  		TestCases.checkHttpRequest(TestSpec.url,function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
  	it("getFields",function(done){
  		TestCases.getFields("Leads",function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
  	it("getModules",function(done){
  		TestCases.getModules("Leads",function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
  	it("getAssignmentRules",function(done){
  		TestCases.getAssignmentRules("Leads",function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
  	it("getAssignmentRules",function(done){
  		TestCases.getAssignmentRules("Leads",function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
  	it("getAssignmentRules",function(done){
  		TestCases.getAssignmentRules("Leads",function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
  	it("getAssignmentRules",function(done){
  		TestCases.getAssignmentRules("Leads",function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
//  	----------
  	it("getCurrentUser",function(done){
  		TestCases.getCurrentUser(function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
  	it("getOrgInfo",function(done){
  		TestCases.getOrgInfo(function(result){
  			expect(result).toBe(true);
  			done();
  		})
  	});
  	it("searchRecord",function(done){
  		TestCases.Search("Leads","email","uk@gmail.com",function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
  	
  	it("customViews",function(done){
  		TestCases.getCustomViews(undefined,function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
  	
  	it("customView",function(done){
  		TestCases.getCustomViews(TestSpec.customViewID,function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});

  	it("getLayouts",function(done){
  		TestCases.getLayout(undefined,function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});

  	it("getLayout",function(done){
  		TestCases.getLayout(TestSpec.layoutID,function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});

  	it("getRelatedList",function(done){
  		TestCases.getRelatedList(undefined,function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});

  	it("getRelatedLists",function(done){
  		TestCases.getRelatedList(TestSpec.relatedID,function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});


  	
  	
  	
  	
	it("unAuthenticated Invoke Connector",function(done){
  		TestCases.invokeUnAuthConnector(function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
  	it("invokeConnectorWithoutDynamic",function(done){
  		TestCases.invokeConnectorWithoutDynamic(TestSpec.connectorWithoutDynamic,{},function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
  	it("invokeConnectorWithoutDynamicValue",function(done){
  		TestCases.invokeConnectorwithDynamic(TestSpec.connectorWithDynamic,{company:TestSpec.company,lastname:TestSpec.lastname},function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
});
