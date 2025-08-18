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




const buildReportFromCurrent = async function({ clearIR = false } = {}) {
    if (clearIR && IRModule?.clearResults) {
      IRModule.clearResults();
    }
    console.log(missionResponses.array[missionResponses.current]);
    await loadDatasets(skuListImport);
    console.log("ready to create report");
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

  console.log("hey",missionResponses.array[missionResponses.current]);

  await buildReportFromCurrent({ clearIR: false });
 };




/*async function loadDatasets(settings) {
  if (settings.skuListImport) {
    for (let dataset in settings.skuListImport) {
      let currentSet = settings.skuListImport[dataset];
      if (currentSet.fromType === "IR") {
        console.log("let's get IR data");
        //let gridId = await APICallsModule.getGrid(pdilModule.getCurrentMissionResponse().id);
        await IRModule.getGridData(pdilModule.getCurrentMissionResponse().id);
      } 
      else if (currentSet.fromType === "dm") {
        // Wait until selectAllMOL is fully done before continuing
        await selectAllMOL(currentSet.ref);
        await molToSKUList(currentSet.ref, currentSet.mapping, currentSet.complianceData);
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
}*/

async function loadDatasets(skuListImport) {
  //if (!settings.skuListImport) return;

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

