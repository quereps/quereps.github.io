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


  /*  vpSetResults("upcs",arrayToPipe(Object.keys(skuList)));

    setTimeout(()=>{
      selectAllMOL("ingest").then((a)=>{
        console.log(a);
      });

    }, 2000);
*/
    

  }

var complianceCheck = function(){
  console.log("complianceCheck start");
  const upcList = vpGetResults("ingest.A3");

  for(let upc in upcList){

    let theupc = upcList[upc][0].value;
    let exp_facings = vpGetResults("ingest.A5")[upc][0].value;
    let exp_price = vpGetResults("ingest.A6")[upc][0].value;

    console.log(theupc,exp_facings,exp_price);

    if(!skuList[theupc].checkFacingsCompliance(exp_facings)){
      console.log("Facings are not compliant");
      addToMatrix("oosMatrix","C4",skuList[theupc]);
    }


    skuList[theupc].checkPricingCompliance(exp_price);
    console.log("Result Compliance: ",skuList[theupc].facingCompliance);

  }
}



var addToMatrix = function(question,idColumn,sku){
  var nextSlot = vpGetResults(question+"."+idColumn).length+1;

  vpSetResults(question+".A"+nextSlot+"."+idColumn,sku.upc);

  const labelElm = jQuery(".aDivQId_"+question+" #SKULabel"+nextSlot);

  jQuery(labelElm).append(sku.name);

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
   const placeID = vpGetTextResults("PlaceID");


   getPlaceData(placeID).then((placeData)=>{
       let tableElement = createTable(placeData, "Place", {
        "Name":placeData.name,
        "City":placeData.city,
        "Address":placeData.address
      });


      $('#table-container').append(tableElement);

      getLastMissionResponse(placeID,missionID,600000).then((lastItem)=>{

         removeNotification();

        let tableElement = createTable(lastItem,"Latest Mission", {
          "Completed":moment(lastItem.completed_at).fromNow(),
          "Completed By":lastItem.user.first_name+" "+lastItem.user.last_name
        });


        $('#table-container').append(tableElement);

        /*if(features.images){
          getImages(lastItem);
        }*/


        getGrid(lastItem.id).then(async (photo_grids)=>{

          removeNotification();


          // Create an array of promises from getTags
          let tagPromises = photo_grids.map(async grid => {
              const tags = await getTags(grid.id);
              removeNotification();
              //extractData(tags);
              extractIRData(tags);
          });

          await Promise.all(tagPromises);

          vpSetResults("upcs",arrayToPipe(Object.keys(skuList)));

          setTimeout(()=>{
            selectAllMOL("ingest").then((a)=>{
              complianceCheck();
            });

          }, 2000);

          
          //createReport();
        });

      });





   });
   

  //  $('#table-container').append(tableElement);

 };


 return {
    Run: function (settings) {
      init(settings);
    },
  }
})(jQuery, ksAPI);

