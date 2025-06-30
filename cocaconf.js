
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

var APIModule = (function ($, ksAPI) {

  var extractIRData = async function(data){

    for(let item in data){


        //console.log(data[item]);

        let upcTarget = data[item].values.upc;
        let skuListTarget = skuList[upcTarget];
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

      createHTMLSection(element,current.title,current.logo,current.type);

      if(current.type=="sections"){
        showSections(containerID);
      }

       if(current.type=="graph"){
        JSONToGraph(graph(current.dimmension), current.dimmension ,current.graphType, containerID, current.settings);
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
       let tableElement = createTable(placeData, "Place", {
        "Name":placeData.name,
        "City":placeData.city,
        "Address":placeData.address
      });


      //$('#table-container-place').append(tableElement);

      getLastMissionResponse(placeID,missionID,600000).then((lastItem)=>{

         removeNotification();

         vpSetResults("missionTimeStamp",moment(lastItem.completed_at).valueOf());

        let tableElement = createTable(lastItem,"Latest Mission", {
          "Completed":moment(lastItem.completed_at).fromNow(),
          "Completed By":lastItem.user.first_name+" "+lastItem.user.last_name
        });


        $('#table-container-latestMission').append(tableElement);

        /*if(features.images){
          getImages(lastItem);
        }*/

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

