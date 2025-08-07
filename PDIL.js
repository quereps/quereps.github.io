var pdilModule = (function ($, ksAPI) {

 let skuList = {};
 let report = {};


   let placeId = "";
   let  companyId = "";
   let missionId = "";
   let tokenV1 = "";
   let tokenV2 = "";
   let features = "";
   let photoGrId = "";
   let photoURLs = [];

   let settings = {};



 const ChangeMissionResponse = function(amount){

  console.log("previous MissionResponses: ",settings.currentMissionResponses);

    settings.currentMissionResponses = settings.currentMissionResponses+amount;

    if(settings.currentMissionResponses<0){
      settings.currentMissionResponses=0;
      return;
    }

    

    if(settings.currentMissionResponses>settings.missionResponses.length){
      return;
    }
    
    console.log("currentMissionResponses: ",settings.currentMissionResponses);
    console.log("ChangeMissionResponse: ",amount);

    clearResults();

    console.log("Mission Responses: ",settings.missionResponses);
    console.log("new Mission Response: ",settings.missionResponses[settings.currentMissionResponses]);

         APICallsModule.getMissionResponse(settings.missionResponses[settings.currentMissionResponses].id).then((lastItem)=>{

      //let lastItem = lastItems[0];
      console.log(lastItem);

      interfaceModule.removeNotification();
      vpSetResults("missionTimeStamp",moment(lastItem.completed_at).valueOf());
      
      savedResponseData = lastItem;

        vpShowLoader();

        getGridData(lastItem.id);


      });
 }



 var init = async function (settingsImport) {

  settings=settingsImport;



  settings.currentMissionResponses = 0;
   settings.missionResponses = [];

  console.log("iniiiiit:", settings);

    placeId = settings.config.placeId;
    companyId = settings.config.companyId;
    missionId = settings.config.missionId;
    tokenV1 = settings.config.tokenV1;
    tokenV2 = settings.config.tokenV2;
    features = settings.features;
    report = settings.report;
    photoGrId = settings.photoGrId;

    console.log("placeId:",placeId);


   APICallsModule.Run({
    companyId:companyId,
    tokenV1:tokenV1,
    tokenV2:tokenV2
   });

   const link1 = document.createElement("link"); //Move to interface
  link1.rel = "stylesheet";
  link1.href = "https://quereps.github.io/design.css";
  document.head.appendChild(link1);

     APICallsModule.getMissionResponses(placeId,missionId,600000000,10).then((responses)=>{
        console.log("responses: ",responses);

      settings.missionResponses = responses;

      let lastItem = responses[0];
      console.log(lastItem);

      interfaceModule.removeNotification();
      vpSetResults("missionTimeStamp",moment(lastItem.completed_at).valueOf());
      
      savedResponseData = lastItem;
      
      if(settings.taskResponseSave){
        for(let item in settings.taskResponseSave){
 
          let theItem = settings.taskResponseSave[item];

          const response = savedResponseData.task_responses[theItem.num];

          vpSetResults(theItem.responseId, response.value);
        }
      }
       // vpShowLoader();

       // getGridData(lastItem.id);


      }).catch((err)=>{
    interfaceModule.notification("error","No mission responses found.");
    console.error(err);
   });


 };




 return {
    Run: function (settings) {
      init(settings);
    },
    ChangeMissionResponse: function (amount) {
      ChangeMissionResponse(amount);
    },
    getSKUList : function(){
      return skuList;
    },
    getSettings: function () {
    return settings;
  },
    skuList,
    companyId,
    photoURLs,
  }
})(jQuery, ksAPI);

