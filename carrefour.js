//this is a test there and there




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



var oosMOLExtract = function(){
  let upc = vpGetResults("oosMOL.A3");
  let expected = vpGetResults("oosMOL.A5");
  let name = vpGetResults("oosMOL.A7");

  let oosompID = 1;

  for(let item in upc){
    
   // vpSetResults("oos_ids.A"+oosompID,upc[item][0].value);
    fillInData("oos_ids",oosompID,placeID+"_"+upc[item][0].value);
    //const container = vpGetLabel("oos_restocked.A"+oosompID);

    addTile("oos_restocked.A"+oosompID,oosompID,null,{
        data:{
          title: name[item][0].value,
          //number: upc[item][0].value,
        },
        resultLabel:"Expected Facings",
        result:{
          expected: expected[item][0].value,
        },
        barcode:upc[item][0].value,
  });

   /* jQuery(container).append(htmlTile(
      {
        data:{
          title: name[item][0].value,
          number: upc[item][0].value,
        },
        result:{
          expected: expected[item][0].value,
        }

  }));*/
    barcodeGenerate(upc[item][0].value);

    oosompID++;
  }
  

}



var complianceCheck = function(){

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
    let sku=skuList[theupc];

    if(!skuList[theupc].facingCompliance){
      console.log("Facings are not compliant",skuList[theupc].facingCompliance);

      fillInData("fc_ids",faceCompID,placeID+"_"+skuList[theupc].upc);
      addTile("fc_restocked.A"+faceCompID,faceCompID,skuList[theupc],{
      object:sku,
      data:{
        title: sku.name+" "+sku.size,
        subtitle: sku.category,
        //description: sku.size,
        //number: sku.upc,
      },
      resultLabel:"Availability",
      meter:{
        value: sku.facings,
        full: sku.expFacings
      },
        barcode:sku.upc,
});
      //addCheckbox("facingCompliance-container #fc"+skuList[theupc].upc,"fc_restocked",faceCompID);
      barcodeGenerate(sku.upc);
      faceCompID++;
    }


    skuList[theupc].checkPricingCompliance(exp_price);

    if(skuList[theupc].pricingCompliance===false){
      console.log("Pricing are not compliant",skuList[theupc].pricingCompliance);

      fillInData("pc_ids",priceCompID,placeID+"_"+skuList[theupc].upc);
      addTile("pc_replaced.A"+priceCompID,priceCompID,skuList[theupc],{
      object:sku,
      data:{
        title: sku.name+" "+sku.size,
        subtitle: sku.category,
        //description: sku.size,
        //number: sku.upc,
      },
      resultLabel:"Prices",
      result:{
        expected: sku.expPricing,
        actual: sku.prices
      },
        barcode:sku.upc,
});
      //addCheckbox("priceCompliance-container #fc"+skuList[theupc].upc,"fp_replaced",priceCompID);
       barcodeGenerate(sku.upc);
      priceCompID++;
    }


    console.log("Result Compliance: ",skuList[theupc].pricingCompliance);

  }

  vpHideLoader();
}

var fillInData = function(question,nextSlot,data){
  vpSetResults(question+".A"+nextSlot,data);
}



var addTile = function(destination,id,sku,profile){

  let container = vpGetLabel(destination);
  const dataTable = ["size","classification","subclassification"];
  jQuery(container).empty();
  jQuery(container).html(interfaceModule.htmlTile(profile));
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



var updateDM = function(upc,column,value){
  console.log("updateOOSDM: ",upc);
  getFilteredObjects(upc).then((record)=>{
    const itemId = extractIdFromXML(record);
    editModelObject(itemId,column,value);
  })
};


 var init = async function (settings) {

  APICallsModule.Run(settings);


  const link1 = document.createElement("link");
  link1.rel = "stylesheet";
  link1.href = "https://quereps.github.io/design.css";
  document.head.appendChild(link1);

  const link2 = document.createElement("link");
  link2.rel = "stylesheet";
  link2.href = "https://quereps.github.io/pkshot.css";
  document.head.appendChild(link2);

  console.log("iniiiiit");



   companyID = settings.companyID;
   missionID = settings.missionID;
   tokenV1 = settings.tokenV1;
   tokenV2 = settings.tokenV2;
   features = settings.features;
   report = settings.report;
   photoGrid = settings.photoGrid;
  placeID = vpGetTextResults("placeID");


   APICallsModule.getPlaceData(placeID).then((placeData)=>{
       let tableElement = interfaceModule.createTable(placeData, "Place", {
        "Name":placeData.name,
        "City":placeData.city,
        "Address":placeData.address
      });


      $('#table-container').append(tableElement);

      





   });
   

  //  $('#table-container').append(tableElement);

 };



  var update = async function (settings) {




          vpShowLoader();

            missionID = settings.missionID;
            const placeID = settings.placeID;


            console.log(placeID);

            APICallsModule.getLastMissionResponse(placeID,missionID,600000).then((lastItem)=>{

         interfaceModule.removeNotification();

         vpSetResults("missionTimeStamp",moment(lastItem.completed_at).valueOf());

        let tableElement = interfaceModule.createTable(lastItem,"Latest Mission", {
          "Completed":moment(lastItem.completed_at).fromNow(),
          "Completed By":lastItem.user.first_name+" "+lastItem.user.last_name
        });


        $('#table-container-latestMission').append(tableElement);

        /*if(features.images){
          getImages(lastItem);
        }*/

        vpShowLoader();

        APICallsModule.getGrid(lastItem.id).then(async (photo_grids)=>{

          interfaceModule.removeNotification();


          // Create an array of promises from getTags
          let tagPromises = photo_grids.map(async grid => {
              const tags = await APICallsModule.getTags(grid.id);
              interfaceModule.removeNotification();
              //extractData(tags);
              extractIRData(tags);
          });

          await Promise.all(tagPromises);

          vpSetResults("upcs",arrayToPipe(Object.keys(skuList)));


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

          
        });

      });

          
  }


 return {
    Run: function (settings) {
      init(settings);
    },
    Update: function(settings){
      update(settings);
    },
    updateDM:function(a,b,c){
      updateDM(a,b,c);
    },
  }
})(jQuery, ksAPI);

