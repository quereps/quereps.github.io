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

  }

var complianceCheck = function(){
  console.log("complianceCheck start");
  const upcList = vpGetResults("ingest.A3");

  for(let upc in upcList){

    let theupc = upcList[upc][0].value;
    let exp_facings = vpGetResults("ingest.A5")[upc][0].value;
    let exp_price = vpGetResults("ingest.A6")[upc][0].value;

    console.log(theupc,exp_facings,exp_price);

    skuList[theupc].checkFacingsCompliance(exp_facings);

    if(!skuList[theupc].facingCompliance){
      console.log("Facings are not compliant",skuList[theupc].facingCompliance);
      addToMatrix("inStockMatrix","C4","C5",skuList[theupc]);
    }


    skuList[theupc].checkPricingCompliance(exp_price);
    console.log("Result Compliance: ",skuList[theupc].pricingCompliance);

  }
}



var addToMatrix = function(question,upcColumn,dmIDColumn,sku){
  var nextSlot = vpGetResults(question+"."+upcColumn).length+1;
  var placeID = vpGetTextResults("PlaceID");

  vpSetResults(question+".A"+nextSlot+"."+upcColumn,sku.upc);
  vpSetResults(question+".A"+nextSlot+"."+dmIDColumn,placeID+"_"+sku.upc);

  const labelElm = jQuery(".aDivQId_"+question+" div#SKULabel"+nextSlot);

  const dataTable = ["classification","subclassification","size"];

  jQuery(labelElm).empty();
  jQuery(labelElm).append(sku.htmlTile(sku.name,null,sku.upc,sku.supplier,sku.facings,sku.expFacings,dataTable,true));

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


  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://quereps.github.io/design.css"; // Replace with your actual file path
  document.head.appendChild(link);

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

          /*setTimeout(()=>{
            selectAllMOL("ingest").then((a)=>{
              complianceCheck();
            });

          }, 2000);*/

          
          //createReport();
        });

      });





   });
   

  //  $('#table-container').append(tableElement);

 };

  var update = async function () {

            vpResetResults("inStockMatrix");
            vpResetResults("oosMatrix");
            setTimeout(()=>{
            selectAllMOL("ingest").then((a)=>{
              complianceCheck();
            });
            //selectAllMOL("ingest_1").then((a)=>{
              //complianceCheck();
            //});

          }, 2000);
  }


 return {
    Run: function (settings) {
      init(settings);
    },
    Update: function(){
      update();
    }
  }
})(jQuery, ksAPI);

