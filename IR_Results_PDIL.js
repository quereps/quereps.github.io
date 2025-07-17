var APIModule = (function ($, ksAPI) {

  let sections = {};
 let skuList = {};
 let report = {};


  let placeID = "";
   let  companyID = "";
   let missionID = "";
   let tokenV1 = "";
   let tokenV2 = "";
   let features = "";
   let photoGrid = "";

   let realogram = [];


   let missionResponses = [];


 
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






var addTile = function(destination,id,sku,profile){
  let container = vpGetLabel(destination);
  const dataTable = ["size","classification","subclassification"];
  jQuery(container).empty();
  jQuery(container).html(htmlTile(profile));
};




var GetIRResults = async function(photo_grids, settings){

//vpShowLoader();
 // return new Promise(async (resolve, reject) => {

interfaceModule.notification("Loading","Getting Tags");

try {

          console.log("photo_grids: ",photo_grids);
          // Create an array of promises from getTags
          let tagPromises = photo_grids.map(async grid => {

              console.log(grid);
              const tags = await APICallsModule.getTags(grid.id);
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
  jQuery("#table-container").empty();
}

 const ChangeMissionResponse = function(amount){
    
    console.log("ChangeMissionResponse: ",amount);

    clearResults();
 }


 var init = async function (settings) {
  console.log("iniiiiit");

   placeID = settings.placeID;
     companyID = settings.companyID;
    missionID = settings.missionID;
    tokenV1 = settings.tokenV1;
    tokenV2 = settings.tokenV2;
    features = settings.features;
    report = settings.report;
    photoGrid = settings.photoGrid;


   APICallsModule.Run({
    companyID:companyID,
    placeID:placeID,
    tokenV1:tokenV1,
    tokenV2:tokenV2
   });

   const link1 = document.createElement("link");
  link1.rel = "stylesheet";
  link1.href = "https://quereps.github.io/design.css";
  document.head.appendChild(link1);


  if(settings.gridIdArray && settings.gridIdArray.length>0){

    console.log("I got the grids");
    GetIRResults(settings.gridIdArray, settings);

  }

  
  else{




   APICallsModule.getPlaceData(placeID).then((placeData)=>{



    savedPlaceData = placeData;

    
     APICallsModule.getMissionResponses(placeID,missionID,600000,10).then((lastItems)=>{
  //      console.log("lastItems: ",lastItems);
 //    });
      

 //   APICallsModule.getLastMissionResponse(placeID,missionID,600000).then((lastItem)=>{
      missionResponses = lastItems;

      let lastItem = lastItems[0];
      console.log(lastItem);

      interfaceModule.removeNotification();
      vpSetResults("missionTimeStamp",moment(lastItem.completed_at).valueOf());
      
      savedResponseData = lastItem;
      

      if(features.images){
          //getImages(lastItem);
      }




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

  }
})(jQuery, ksAPI);

