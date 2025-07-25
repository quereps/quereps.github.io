var planogramAPIModule = (function ($, ksAPI) {

 
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

   const link1 = document.createElement("link");
  link1.rel = "stylesheet";
  link1.href = "https://quereps.github.io/design.css";
  document.head.appendChild(link1);


  if(settings.gridIdArray && settings.gridIdArray.length>0){

    console.log("I got the grIds");
    GetIRResults(settings.gridIdArray, settings);

  }

  
  else{




    /*Tests*/




    APICallsModule.getMissionVersions(missionId).then((data)=>{
      console.log(data);
    });

    /*Tests*/


    console.log("placeId: ",placeId);

   APICallsModule.getPlaceData(placeId).then((placeData)=>{



    savedPlaceData = placeData;
    console.log("savedPlaceData: ",savedPlaceData, placeId, missionId);
    
     APICallsModule.getMissionResponses(placeId,missionId,600000000,10).then((lastItems)=>{
        console.log("lastItems: ",lastItems);
 //    });
      

 //   APICallsModule.getLastMissionResponse(placeId,missionId,600000).then((lastItem)=>{
      settings.missionResponses = lastItems;

      let lastItem = lastItems[0];
      console.log(lastItem);

      interfaceModule.removeNotification();
      vpSetResults("missionTimeStamp",moment(lastItem.completed_at).valueOf());
      
      savedResponseData = lastItem;
      



        vpShowLoader();

        APICallsModule.getGrid(lastItem.id).then(async (photo_grids)=>{

          interfaceModule.removeNotification();


          // Create an array of promises from getTags

          console.log("photo_grids: ",photo_grids);

          let tagPromises = photo_grids.map(async grid => {
              const tags = await APICallsModule.getTags(grid.id);
              interfaceModule.removeNotification();
              extractIRData(tags);
          });

          await Promise.all(tagPromises);


          if(settings.specificFunction){
            console.log("Specific Function Detected");
            settings.specificFunction(skuList,settings);
          }

          interfaceModule.createReport(settings, skuList, sections);

          
        }).catch((err)=>{
    interfaceModule.notification("error","No Photo Grid found.");
    console.error(err);
   });

      }).catch((err)=>{
    interfaceModule.notification("error","No mission responses found.");
    console.error(err);
   });





   }).catch((err)=>{
    interfaceModule.notification("error","Place not found.");
    console.error(err);
   });
   
  }
  //  $('#table-container').append(tableElement);

 };



 return {
    Run: function (settings) {
      init(settings);
    },
  }
})(jQuery, ksAPI);

