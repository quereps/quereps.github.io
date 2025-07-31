var APIModule = (function ($, ksAPI) {

  let sections = {};
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

   let realogram = [];


   //let missionResponses = [];

   
   //let currentMissionResponses = 0;

   let settings = {};

 
  var extractIRData = async function(data){

    console.log("Extracting Data: ", data)

    for(let item in data){

      let upcTarget = "";

         const y = data[item].values.shelf_index_y;
        const x = data[item].values.shelf_index_x;
        let type = "";

          if (!realogram[y]) {
              realogram[y] = [];
            }

            realogram[y][x] = data[item].values;

            let IRData = data[item].values;

            if (data[item].type == "coldbox_unrecognizable_product") {
              realogram[y][x].type = "unknown"; // <-- Assignment!
              upcTarget = "Unrecognized";
              type = "Unrecognized";
            }
            else if (data[item].type == "empty_facing") {
              realogram[y][x].type = "empty"; // <-- Assignment!
              upcTarget = "Empty Facing";
              type = "Empty Facing";
            }
            else if (data[item].type == "shelf_product" && data[item].values.upc) {
              realogram[y][x].type = "sku"; // <-- Assignment!
              upcTarget = data[item].values.upc;
              type = "SKU";
              
            }

              //console.log(data[item]);

              //To move in its own function
              const key = data[item].values.classification;
              sections[key] = (sections[key] ?? 0) + 1;


        //console.log(data[item]);

        //let upcTarget = data[item].values.upc;
        let skuListTarget = skuList[upcTarget];

        

        if(!skuListTarget){
          skuList[upcTarget] = new skuObj({type:type,upc:upcTarget, IRData: IRData});
          skuList[upcTarget].addFacing(IRData);
        }
        else{
            skuList[upcTarget].addFacing(IRData);
        }

          if(skuList[upcTarget].prices){
            Array.prototype.push.apply(skuListTarget.prices, data[item].values.prices);
          }
          else{
            skuList[upcTarget].prices = data[item].values.prices;
          }

    }    

  }






var addTile = function(destination,Id,sku,profile){
  let container = vpGetLabel(destination);
  const dataTable = ["size","classification","subclassification"];
  jQuery(container).empty();
  jQuery(container).html(htmlTile(profile));
};




var GetIRResults = async function(photo_grIds, settings){

//vpShowLoader();
 // return new Promise(async (resolve, reject) => {

interfaceModule.notification("Loading","Getting Tags");

try {

          console.log("photo_grIds: ",photo_grIds);
          // Create an array of promises from getTags
          let tagPromises = photo_grIds.map(async grId => {

              console.log(grId);
              const tags = await APICallsModule.getTags(grId.Id);
              interfaceModule.removeNotification();
              extractIRData(tags);
          });

          await Promise.all(tagPromises);

          if(settings.specificFunction){
            settings.specificFunction();
          }

          interfaceModule.createReport(settings, skuList, sections);
        

    } catch (error) {
      console.error("Failed to get IR Results:", error);
      throw error;
    }

//});
 
} 



const clearResults = function(){
  skuList = {};
  jQuery("#table-container").empty();
  jQuery(".sectionContainer").empty();
}

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
            settings.specificFunction(skuList);
          }
          
          

          console.log(skuList);
          /*Coke Demo specifics END*/

          interfaceModule.createReport(settings, skuList, sections);

        });

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


          for(let grid of photo_grids){
            APICallsModule.getTaskResponse(grid.metadata.task_response.id).then((data)=>{
              console.log(data.value[0].s3);
            });
              
            };
          
          


          let tagPromises = photo_grids.map(async grid => {

          
             

              const tags = await APICallsModule.getTags(grid.id);
              interfaceModule.removeNotification();
              extractIRData(tags);
          });

          await Promise.all(tagPromises);


/*Testing Planogram*/
          let pogPromises = photo_grids.map(async grid => {
              const pogs = await APICallsModule.getPlanogram(companyId,grid.id);
              //interfaceModule.removeNotification();
              //extractIRData(tags);
              console.log("pogs",pogs);
          });

          await Promise.all(pogPromises);
/*Testing Planogram*/

          if(settings.report){
          interfaceModule.createReport(settings, skuList, sections);
        }else{
          vpHideLoader();
        }

        if(settings.specificFunction){
            console.log("Specific Function Detected");
            settings.specificFunction(skuList,settings);
          }

          
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
    ChangeMissionResponse: function (amount) {
      ChangeMissionResponse(amount);
    },
    getSKUList : function(){
      return skuList;
    },
    skuList,
    companyId

  }
})(jQuery, ksAPI);

