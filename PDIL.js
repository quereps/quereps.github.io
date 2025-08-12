var pdilModule = (function ($, ksAPI) {

 //let skuList = {};
 let report = {};
 let features = {};

   let config = {};
   let missionResponses = {
    array:[],
    current:0,
   };


 const ChangeMissionResponse = function(amount){

  //console.log("previous MissionResponses: ",missionResponses.current);

    missionResponses.current = missionResponses.current+amount;

    if(missionResponses.current<0){
      missionResponses.current=0;
      return;
    }

    if(missionResponses.current>missionResponses.array.length){
      return;
    }
    
    //console.log("currentMissionResponses: ",missionResponses.current);
    //console.log("ChangeMissionResponse: ",amount);

    //clearResults();

    //console.log("Mission Responses: ",missionResponses.array);
    //console.log("new Mission Response: ",missionResponses.array[missionResponses.current]);
    console.log(missionResponses.array[missionResponses.current]);

 }


var getMissionResponses = async function(){
  missionResponses.array = await APICallsModule.getMissionResponses(config.placeId,config.missionId,600000000,10);
  lastMissionResponse = missionResponses.array[missionResponses.current];

  return lastMissionResponse;
}


 var init = async function (settings) {


  console.log("iniiiit");
  config=settings.config;
  report = settings.report;
  features = settings.features;

  APICallsModule.Run({
    companyId:config.companyId,
    tokenV1:config.tokenV1,
    tokenV2:config.tokenV2
  });

  if(features?.IR==true){
    IRModule.Run(config);
  }

  await getMissionResponses();

  console.log("hey",missionResponses.array[missionResponses.current]);


  await loadDatasets(settings);

  interfaceModule.createReport()
 };


async function loadDatasets(settings) {
  if (settings.skuListImport) {
    for (let dataset in settings.skuListImport) {
      let currentSet = settings.skuListImport[dataset];

      if (currentSet.fromType === "dm") {
        // Wait until selectAllMOL is fully done before continuing
        await selectAllMOL(currentSet.ref);
        molToSKUList(currentSet.ref, currentSet.mapping, currentSet.complianceData);
      } 
      else if (currentSet.fromType === "task_response") {
        let skuArray = pdilModule.getCurrentMissionResponse().task_responses[(currentSet.taskNum - 1)].value;
        console.log("skuArray", skuArray);

        for (let sku in skuArray) {
          IRModule.createOrAddSKU("SKU", skuArray[sku], null, currentSet.complianceData);
        }
      }
      console.log("skuList",IRModule.getSKUList());
    }
  }
}



 return {
    Run: function (settings) {
      init(settings);
    },
    ChangeMissionResponse: function (amount) {
      ChangeMissionResponse(amount);
    },
    getSettings: function () {
    return settings;
  }, getReportSettings: function () {
    return report;
  },
  getConfig: function () {
    return config;
  },
    getCurrentMissionResponse: function () {
    return missionResponses.array[missionResponses.current];
  },
  getMissionResponsesObj: function () {
    return missionResponses;
  },
    //photoURLs,
  }
})(jQuery, ksAPI);

