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

  console.log("previous MissionResponses: ",missionResponses.current);

    missionResponses.current = missionResponses.current+amount;

    if(missionResponses.current<0){
      missionResponses.current=0;
      return;
    }

    if(missionResponses.current>missionResponses.array.length){
      return;
    }
    
    console.log("currentMissionResponses: ",missionResponses.current);
    console.log("ChangeMissionResponse: ",amount);

    clearResults();

    console.log("Mission Responses: ",missionResponses.array);
    console.log("new Mission Response: ",missionResponses.array[missionResponses.current]);

         APICallsModule.getMissionResponse(missionResponses.array[missionResponses.current].id).then((lastItem)=>{

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



  config=settingsImport.config;
  report = settingsImport.report;

  console.log("iniiiiit:", config);

   APICallsModule.Run({
    companyId:config.companyId,
    tokenV1:config.tokenV1,
    tokenV2:config.tokenV2
   });

   const link1 = document.createElement("link"); //Move to interface
  link1.rel = "stylesheet";
  link1.href = "https://quereps.github.io/design.css";
  document.head.appendChild(link1);


  missionResponses.array = await APICallsModule.getMissionResponses(config.placeId,config.missionId,600000000,10);

  interfaceModule.removeNotification();
  //vpSetResults("missionTimeStamp",moment(lastItem.completed_at).valueOf());
      
      savedResponseData = missionResponses.array[missionResponses.current];
      
      console.log("savedResponseData",savedResponseData);
      /*
      if(settings.taskResponseSave){
        for(let item in settings.taskResponseSave){
 
          let theItem = settings.taskResponseSave[item];

          const response = savedResponseData.task_responses[theItem.num];

          vpSetResults(theItem.responseId, response.value);
        }
      }*/

       // getGridData(lastItem.id);
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
    //photoURLs,
  }
})(jQuery, ksAPI);

