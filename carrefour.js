//this is a test there and there

let sections = {};
 let skuList = {};
 let features = {};
 let report = {};
 let realogram = [];


 let ingest = "";
  let companyID = "";
  let missionID = "";
  let tokenV1 = "";
  let tokenV2 = "";
  let photoGrid = "";

var APIModule = (function ($, ksAPI) {
  var extractIRData = function(data){

    for(let item in data){


        console.log(data[item]);

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
        JSONToGraph(graph(current.dimmension), current.dimmension ,current.graphType, containerID);
      }
 
      if(current.type=="skuList"){
        JSONToHTMLTable(rankObjects(skuList, "facings", current.columns), containerID) 
      }

      if(current.type=="pog"){
        POG(current.category,containerID);
      }

    }


}




 var init = async function (settings) {

  console.log("iniiiiit");

   companyID = settings.companyID;
   missionID = settings.missionID;
   tokenV1 = settings.tokenV1;
   tokenV2 = settings.tokenV2;
   features = settings.features;
   report = settings.report;
   photoGrid = settings.photoGrid;


   getPlaceData(vpGetTextResults("PlaceID")).then((placeData)=>{
       let tableElement = createTable(placeData, "Place", {
        "Name":data.name,
        "City":data.city,
        "Address":data.address
      });


      $('#table-container').append(tableElement);

   });
   

  //  $('#table-container').append(tableElement);

 };


 return {
    Run: function (settings) {
      init(settings);
    },
  }
})(jQuery, ksAPI);

