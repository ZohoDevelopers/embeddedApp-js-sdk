var customMatchers = {
    toCheckCM: function(util, customEqualityTesters) {
    return {  
      compare: function(actual, expected) {
        var result = {};
        if(actual==expected){
          result.pass = true;
        }
        else{
          result.pass=false;
          result.message = "po da dai";
        }
        return result;
      }
    };
  }
};

describe("ZOHO.CRM.API Insert Record", function() {
var testID = undefined;
  beforeEach(function(done) {
    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    jasmine.addMatchers(customMatchers);
    ZOHO.embeddedApp.init()
    .then(function(){
              done();
    })
  }); 
  
  it("Record Action", function(done) {

    var recordData = {
      "Company": "Zylker",
      "Last_Name": "Peterson"
    };
    ZOHO.CRM.API.insertRecord({Entity:"Leads",APIData:recordData})
    .then(function(data){
      if(!data || !data[0] || data[0].code != "SUCCESS")
      {
          expect(true).toCheckCM(false);
          done();
      }
      testID  = data[0].details.id;
    return ZOHO.CRM.API.getRecord({Entity:"Leads",RecordID:testID})
    }).then(function(data){
      console.log(data);
      if(!data || data.id != testID)
      {
          expect(true).toCheckCM(false);
      }
      else
      {
        expect(true).toCheckCM(true);
      }
      done();
    }).catch(function(){
      console.log("worst case da dai");
    });
  });
})
