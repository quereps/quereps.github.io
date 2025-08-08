var pdilModule = (function ($, ksAPI) {

 let skuList = {};
 let report = {};


   //let placeId = "";
   //let companyId = "";
   //let missionId = "";
   //let tokenV1 = "";
   //let tokenV2 = "";
   //let features = "";
   //let photoGrId = "";
   //let photoURLs = [];

   //let settings = {};

   let config = {};
   let missionResponses = {
    array:[],
    current:0,
   };


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

        IRModule.getGridData(lastItem.id);


      });
 }



 var init = async function (settingsImport) {

  //settings=settingsImport;
  config=settingsImport.config;
  report = settings.report;

  console.log("iniiiiit:", config);

   // placeId = settings.config.placeId;
   // companyId = settings.config.companyId;
   // missionId = settings.config.missionId;
   // tokenV1 = settings.config.tokenV1;
   // tokenV2 = settings.config.tokenV2;
   // features = settings.features;
    
    //photoGrId = settings.photoGrId;

    //console.log("placeId:",placeId);


   APICallsModule.Run({
    companyId:config.companyId,
    tokenV1:config.tokenV1,
    tokenV2:config.tokenV2
   });

   const link1 = document.createElement("link"); //Move to interface
  link1.rel = "stylesheet";
  link1.href = "https://quereps.github.io/design.css";
  document.head.appendChild(link1);

     APICallsModule.getMissionResponses(config.placeId,config.missionId,600000000,10).then((responses)=>{
        console.log("responses: ",responses);

      missionResponses.array = responses;

      let lastItem = responses[0];
      console.log(lastItem);

      interfaceModule.removeNotification();
      vpSetResults("missionTimeStamp",moment(lastItem.completed_at).valueOf());
      
      /*savedResponseData = lastItem;
      
      if(settings.taskResponseSave){
        for(let item in settings.taskResponseSave){
 
          let theItem = settings.taskResponseSave[item];

          const response = savedResponseData.task_responses[theItem.num];

          vpSetResults(theItem.responseId, response.value);
        }
      }*/
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
    getSettings: function () {
    return settings;
  },
    photoURLs,
  }
})(jQuery, ksAPI);

