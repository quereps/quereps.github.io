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



var oosMOLExtract = function(){
  let upc = vpGetResults("oosMOL.A3");
  let expected = vpGetResults("oosMOL.A5");
  let name = vpGetResults("oosMOL.A7");

  let oosompID = 1;

  for(let item in upc){
    
    vpSetResults("oos_ids.A"+oosompID,upc[item][0].value);
    const container = vpGetLabel("oos_restocked.A"+oosompID);

    jQuery(container).append(htmlTile(
      {
        data:{
          title: name[item][0].value,
          number: upc[item][0].value,
        },
        result:{
          expected: expected[item][0].value,
        }

  }));

    oosompID++;
  }
  

}



var complianceCheck = function(){

  var placeID = vpGetTextResults("PlaceID");

  let faceCompID = 1;
  let priceCompID = 1;
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

      fillInData("fc_ids",faceCompID,placeID+"_"+skuList[theupc].upc);
      addFacingTile("fc_restocked.A"+faceCompID,faceCompID,skuList[theupc]);
      //addCheckbox("facingCompliance-container #fc"+skuList[theupc].upc,"fc_restocked",faceCompID);
      faceCompID++;
    }


    skuList[theupc].checkPricingCompliance(exp_price);

    if(skuList[theupc].pricingCompliance===false){
      console.log("Pricing are not compliant",skuList[theupc].pricingCompliance);

      fillInData("pc_ids",priceCompID,placeID+"_"+skuList[theupc].upc);
      addPricingTile("pc_replaced.A"+priceCompID,priceCompID,skuList[theupc]);
      //addCheckbox("priceCompliance-container #fc"+skuList[theupc].upc,"fp_replaced",priceCompID);
      priceCompID++;
    }


    console.log("Result Compliance: ",skuList[theupc].pricingCompliance);

  }
}

var fillInData = function(question,nextSlot,data){
  vpSetResults(question+".A"+nextSlot,data);
}

var addFacingTile = function(destination,id,sku){

  let container = vpGetLabel(destination);
  const dataTable = ["size","classification","subclassification"];
  jQuery(container).html(htmlTile(
    {
      object:sku,
      data:{
        title: sku.name,
        subtitle: sku.category,
        description: sku.size,
        number: sku.upc,
      },
      result:{
        expected: sku.expFacings,
        actual: sku.facings
      }

}));
};

var addPricingTile = function(destination,id,sku){
  let container = vpGetLabel(destination);
  const dataTable = ["size","classification","subclassification"];
  //jQuery(container).append(htmlTile(sku.name,null,sku.upc,sku.supplier,sku.prices,sku.expPricing,dataTable,sku.upc));
  jQuery(container).html(htmlTile(
    {
      object:sku,
      data:{
        title: sku.name,
        subtitle: sku.category,
        description: sku.size,
        number: sku.upc,
      },
      result:{
        expected: sku.expPricing,
        actual: sku.prices
      }
}));
} 



/*var addToMatrix = function(question,upcColumn,dmIDColumn,sku){
  var nextSlot = vpGetResults(question+"."+upcColumn).length+1;
  var placeID = vpGetTextResults("PlaceID");

  vpSetResults(question+".A"+nextSlot+"."+upcColumn,sku.upc);
  vpSetResults(question+".A"+nextSlot+"."+dmIDColumn,placeID+"_"+sku.upc);

  const labelElm = jQuery(".aDivQId_"+question+" div#SKULabel"+nextSlot);

  const dataTable = ["classification","subclassification","size"];

  jQuery(labelElm).empty();
  jQuery(labelElm).append(sku.htmlTile(sku.name,null,sku.upc,sku.supplier,sku.facings,sku.expFacings,dataTable,true));

} 
*/



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

      





   });
   

  //  $('#table-container').append(tableElement);

 };



  var update = async function (settings) {

            missionID = settings.missionID;
            const placeID = settings.placeID;


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

            vpResetResults("fc_restocked");
            vpResetResults("pc_replaced");
            vpResetResults("oos_restocked");
            vpResetResults("oos_ids");
            vpResetResults("fc_ids");
            vpResetResults("pc_ids");
            setTimeout(()=>{
            selectAllMOL("ingest").then((a)=>{
              complianceCheck();
            });
            selectAllMOL("oosMOL").then((a)=>{
              oosMOLExtract();
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
    Update: function(settings){
      update(settings);
    }
  }
})(jQuery, ksAPI);

