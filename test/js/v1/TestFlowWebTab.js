describe("SDK Testing", function() {
	beforeAll(function(done) 
	{
3		jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
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
  		TestCases.invokeConnectorWithoutDynamic(TestSpec.connector,{},function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
  	it("invokeConnectorWithoutDynamicValue",function(done){
  		TestCases.invokeConnectorwithDynamic(TestSpec.connectorFile,{fileId:TestSpec.fileId},function(result){
  			expect(result).toBe(true);
  			done();
  		});
  	});
});
