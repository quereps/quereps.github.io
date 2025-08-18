var pdilModule = (function ($, ksAPI) {

 //let skuList = {};
 let report = {};
 let features = {};
 let skuListImport = [];

   let config = {};
   let missionResponses = {
    array:[],
    current:0,
   };




const buildReportFromCurrent = async function() {
    IRModule.clearResults();
    await loadDatasets(skuListImport);
    await IRModule.checkAvailability();
    await Promise.resolve(interfaceModule.createReport());
};


 const ChangeMissionResponse = async function(amount){
    missionResponses.current = missionResponses.current+amount;

    if(missionResponses.current<0){
      missionResponses.current=0;
      return;
    }

    if (missionResponses.current >= missionResponses.array.length) {
      missionResponses.current = missionResponses.array.length - 1;
      return;
    }

    await buildReportFromCurrent({ clearIR: true });
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
  skuListImport = settings.skuListImport;

  APICallsModule.Run({
    companyId:config.companyId,
    tokenV1:config.tokenV1,
    tokenV2:config.tokenV2
  });

  if(features?.IR==true){
    IRModule.Run(config);
  }

  await getMissionResponses();
  await buildReportFromCurrent();
 };


async function loadDatasets(skuListImport) {

  vpShowLoader();

  const jobs = [];

  for (const dataset of Object.values(skuListImport)) {
    if (dataset.fromType === "IR") {
      jobs.push(IRModule.getGridData(pdilModule.getCurrentMissionResponse().id));
    } else if (dataset.fromType === "dm") {
      jobs.push(
        selectAllMOL(dataset.ref).then(() => 
          molToSKUList(dataset.ref, dataset.mapping, dataset.complianceData)
        )
      );
    } else if (dataset.fromType === "task_response") {
      jobs.push((async () => {
        const arr = pdilModule.getCurrentMissionResponse().task_responses[(dataset.taskNum - 1)].value;

        console.log("arr",arr);
        for (const sku of arr) {
          await Promise.resolve(IRModule.createOrAddSKU("SKU", sku, null, dataset.complianceData));
        }
      })());
    }
  }

  await Promise.all(jobs);
  console.log("skuList", IRModule.getSKUList());
}


 return {
    Run: function (settings) {
      return init(settings);
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

