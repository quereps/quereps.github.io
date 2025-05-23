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


  



var extractData = function(data){

  for(let item in data){

    const y = data[item].values.shelf_index_y;
    const x = data[item].values.shelf_index_x;


    if (!realogram[y]) {
      realogram[y] = [];
    }

    realogram[y][x] = data[item].values;

    if (data[item].type == "coldbox_unrecognizable_product") {
      realogram[y][x].type = "unknown"; // <-- Assignment!
    }
    else if (data[item].type == "empty_facing") {
      realogram[y][x].type = "empty"; // <-- Assignment!
    }
    else if (data[item].type == "shelf_product" && data[item].values.upc) {
      realogram[y][x].type = "sku"; // <-- Assignment!

      console.log(data[item]);

      //To move in its own function
      const key = data[item].values.classification;
      sections[key] = (sections[key] ?? 0) + 1;

      let upcTarget = data[item].values.upc;

      console.log("upcTarget:"+ upcTarget);

      let skuListTarget = skuList[upcTarget];

      console.log("skuListTarget:"+ skuListTarget);

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

      
      else{
        console.log("new");
          
        }

       
      }
      
    

     
    
    //checks();

    }





let createReport = function(){

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

  //  $('#table-container').append(tableElement);



 };


 return {
    Run: function (settings) {
      init(settings);
    },
  }
})(jQuery, ksAPI);



/*(function($, ksAPI){
  ksAPI.runCustomCode(function () {
    APIModule.Run(ukDemo);
  });
})(jQuery, ksAPI);
*/
/*
var ukDemo = {
      companyID:"5402",
      missionID:"4219984",
      tokenV1:"580c0c7f5d511ec2aceb2d9b4e7d9f22e5cb169fea02045c6353c8af0bd0e6e1",
      tokenV2:"ce13e6d56a8e16e9e1c4eb39b73243183d5aebb304921da5d1b8b0b9ff802516",
      inventoryDM:"inventory",
      features:{
        sections:true,
        skuList:true,
        images:true,
      },
     }
*/
   
