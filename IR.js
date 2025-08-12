var IRModule = (function ($, ksAPI) {
 let skuList = {};

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

              createOrAddSKU(upcTarget,IRData,{addFacing:true});

    }    

  }


let checkAvailability = function(){
  for(let sku of skuList){
    sku.checkAvailability();
    console.log("New Status: "+sku.availabilityStatus);
  }
}


let createOrAddSKU = function(type,upcTarget,IRData,complianceData){

  console.log("IRData",IRData);
  console.log("complianceData",complianceData);
  let skuListTarget = skuList[upcTarget];
  
  //console.log("IRData",IRData);
        

        if(!skuListTarget){
          skuList[upcTarget] = new skuObj({type:type,upc:upcTarget, IRData: IRData});
        }
          else{
          skuList[upcTarget].updateData(IRData);
        }

        if(complianceData.addFacing==true){
            skuList[upcTarget].addFacing(IRData);
        }

        if(complianceData.expected==true){
            skuList[upcTarget].expected=true;
        }

        if(complianceData.availabilityStatus){
            console.log("will update status");
            skuList[upcTarget].updateStatus(complianceData.availabilityStatus,complianceData.overwrite);
        }

          if(IRData && skuListTarget?.prices){
            Array.prototype.push.apply(skuListTarget.prices, IRData?.prices);
          }
          else if(IRData){
            skuList[upcTarget].prices = IRData?.prices || [];
          }

            skuList[upcTarget].hasPriceTag== skuList[upcTarget]?.prices?.length>0 ? true : false;
}





var GetIRResults = async function(photo_grIds, settings){

//vpShowLoader();
 // return new Promise(async (resolve, reject) => {

interfaceModule.notification("loading","Getting Tags");

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

          //interfaceModule.createReport(settings, skuList, sections);
        

    } catch (error) {
      console.error("Failed to get IR Results:", error);
      throw error;
    }

//});
 
} 



const clearResults = function(){
  skuList = {};
  photoURLs = [];
  jQuery("#table-container").empty();
  jQuery(".sectionContainer").empty();
}

 var getGridData = function(missionResponseID){

          APICallsModule.getGrid(missionResponseID).then(async (photo_grids)=>{

          interfaceModule.removeNotification();


          // Create an array of promises from getTags

          console.log("photo_grids: ",photo_grids);


          for(let grid of photo_grids){
            APICallsModule.getTaskResponse(grid.metadata.task_response.id).then((data)=>{
              let image = data.value[0].s3;
              console.log(image);
              photoURLs.push(image);
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

        getGridData(lastItem.id);


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
    getSKUList : function(){
      return skuList;
    },
  getGridData: function (gridID) {
    getGridData(gridID);
  },
  createOrAddSKU: function (type,upcTarget,IRData,complianceData) {
    createOrAddSKU(type,upcTarget,IRData,complianceData);
  },
  checkAvailability: function () {
    checkAvailability();
  },


  
  }
})(jQuery, ksAPI);

