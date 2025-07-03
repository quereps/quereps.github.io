
let sections = {};
 let skuList = {};
 let features = {};
 let report = {};
 let realogram = [];


  let ingest = "";
  let placeID = "";
  let companyID = "";
  let missionID = "";
  let tokenV1 = "";
  let tokenV2 = "";
  let photoGrid = "";
  let savedPlaceData = {};
  let savedResponseData = {};

var APIModule = (function ($, ksAPI) {

  var extractIRData = async function(data){

    for(let item in data){


      let skuListTarget = skuList[upcTarget];
      let upcTarget = "";

         const y = data[item].values.shelf_index_y;
    const x = data[item].values.shelf_index_x;

          if (!realogram[y]) {
              realogram[y] = [];
            }

            realogram[y][x] = data[item].values;

            if (data[item].type == "coldbox_unrecognizable_product") {
              realogram[y][x].type = "unknown"; // <-- Assignment!
              upcTarget = "Unrecognized";
            }
            else if (data[item].type == "empty_facing") {
              realogram[y][x].type = "empty"; // <-- Assignment!
              upcTarget = "Empty Facing";
            }
            else if (data[item].type == "shelf_product" && data[item].values.upc) {
              realogram[y][x].type = "sku"; // <-- Assignment!
              upcTarget = skuList[upcTarget];
            }

              console.log(data[item]);

              //To move in its own function
              const key = data[item].values.classification;
              sections[key] = (sections[key] ?? 0) + 1;


        //console.log(data[item]);

        //let upcTarget = data[item].values.upc;
        //let skuListTarget = skuList[upcTarget];

        let IRData = data[item].values;

        if(!skuListTarget){
          skuList[upcTarget] = new skuObj({IRData: IRData});
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


var createReport = function(){

  console.log(report);

    for(var element in report){

      var current = report[element];
      var containerID = "Container"+element;

      createHTMLSection(element,current?.title,current?.logo,current?.type,current?.options);

      if(current.type=="place"){
        placeSection(savedPlaceData,current.options,containerID);
      }

      if(current.type=="response"){
        MissionResponseSection(savedResponseData,containerID);
      }


      if(current.type=="number"){
        numberTile(graph(current.dimmension,current?.options?.asPercentage),containerID,current.options);
      }


      if(current.type=="sections"){
        showSections(containerID);
      }

       if(current.type=="graph"){
        JSONToGraph(graph(current.dimmension,current?.settings?.asPercentage), current.dimmension ,current.graphType, containerID, current.settings);
      }
 
      if(current.type=="skuList"){
        JSONToHTMLTable(rankObjects(skuList, "facings", current.columns), containerID, current.settings) 
      }

      if(current.type=="pog"){
        POG(current.category,containerID);
      }

    }

    vpHideLoader();
}




 var init = async function (settings) {

  placeID = vpGetTextResults("placeID");

  const link1 = document.createElement("link");
  link1.rel = "stylesheet";
  link1.href = "https://quereps.github.io/design.css";
  document.head.appendChild(link1);

  console.log("iniiiiit");

   companyID = settings.companyID;
   missionID = settings.missionID;
   tokenV1 = settings.tokenV1;
   tokenV2 = settings.tokenV2;
   features = settings.features;
   report = settings.report;
   photoGrid = settings.photoGrid;
    


   getPlaceData(placeID).then((placeData)=>{

    savedPlaceData = placeData;

    
      

    getLastMissionResponse(placeID,missionID,600000).then((lastItem)=>{
      removeNotification();
      vpSetResults("missionTimeStamp",moment(lastItem.completed_at).valueOf());
      
      savedResponseData = lastItem;
      

      if(features.images){
          //getImages(lastItem);
      }




        vpShowLoader();

        getGrid(lastItem.id).then(async (photo_grids)=>{

          removeNotification();


          // Create an array of promises from getTags
          let tagPromises = photo_grids.map(async grid => {
              const tags = await getTags(grid.id);
              removeNotification();
              extractIRData(tags);
          });

          await Promise.all(tagPromises);

          createReport();

          
        });

      });





   });
   

  //  $('#table-container').append(tableElement);

 };





 return {
    Run: function (settings) {
      init(settings);
    },
    Update: function(settings){
      update(settings);
    }
  }
})(jQuery, ksAPI);

