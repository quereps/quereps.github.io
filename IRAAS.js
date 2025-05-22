//this is a test there and there

let sections = {};
 let skuList = {};
 let features = {};
 let report = {};

 let ingest = "";
  let companyID = "";
  let missionID = "";
  let tokenV1 = "";
  let tokenV2 = "";
  let photoGrid = "";

var APIModule = (function ($, ksAPI) {

class skuObj {
  constructor({upc = "", IRData = ""}){

    console.log("Constructor",IRData);

    this.heightArray = [];
    this.widthArray = [];
    this.shelf_index_xArray = [];
    this.shelf_index_yArray = [];
    this.stack_indexArray = [];

    if(IRData){
      this.facings=0;
      this.name = IRData.name;
      this.upc = IRData.upc;
      this.guid = IRData.guid;
      
      this.classification = IRData.classification;
      this.subclassification = IRData.subclassification;

      this.size = IRData.size;
      
      this.supplier = IRData.supplier;
      this.brand_family = IRData.brand_family;
      this.brand = IRData.brand;
    }
    return this;
    
  }


  addFacing(IRData){
    if(IRData){
      this.facings++;
      this.shelf_index_xArray.push(IRData.shelf_index_x);
      this.shelf_index_yArray.push(IRData.shelf_index_y);
      this.stack_indexArray.push(IRData.stack_index);
      this.heightArray.push(IRData.height);
      this.widthArray.push(IRData.width);

      this.updateAverages();
    }
  }

  updateAverages(){
    this.shelf_index_x = getAverage(this.shelf_index_xArray);
    this.shelf_index_y = getAverage(this.shelf_index_yArray);
    this.stack_index = getAverage(this.stack_indexArray);
    this.height = getAverage(this.heightArray);
    this.width = getAverage(this.widthArray);
  }

  getIRData(data){
      console.log("getIRData: ",data);
      this.IRData = data;
  }

barcode() {
  let format;
  if (this.upc.length === 8) {
    format = "EAN8";
  } else if (this.upc.length === 13) {
    format = "EAN13";
  } else {
    console.warn(`UPC length ${this.upc.length} isn’t EAN8/13—using Code128`);
    format = "CODE128";
  }

  JsBarcode("#barcode" + this.upc, this.upc, {
    format,
    lineColor: "#000",
    width: 1,
    height: 10,
    displayValue: true,
    margin: 0,
    background: "#fafafa",
    fontSize: "0.8em"
  });
}

    
  }
  



var extractData = function(data){

  for(let item in data){

    if(data[item].type=="shelf_product" && data[item].values.upc){

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

      createHTMLSection(element,current.title,current.logo);

      if(current.type=="sections"){
        //createHTMLSection(element,current.title,current.logo);
        showSections(containerID);
      }

       if(current.type=="graph"){
        //createHTMLSection(element,current.title,current.logo);

        JSONToGraph(graph(current.dimmension), current.dimmension ,current.graphType, containerID);

      }

      
      if(current.type=="skuList"){
        //createHTMLSection(element,current.title,current.logo);
        JSONToHTMLTable(rankObjects(skuList, "facings", current.columns), containerID) 
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
    GetIRAAS:function(imageURL){

      jQuery("#table-container").empty();

      if(imageURL){

        console.log("imageURL",imageURL);
        //var imageURL = "https://app.form.com/"+vpGetResults("Q1.A1")[0].urlDownload;
        //var imageURL = "https://app.form.com/"+imageURL+"?filename=image.jpg";

        //https://app.form.com/app/public/download/file/74689b288733eff59741c0b49cb1158b/1575907578/109542884/412390885
        //var imageURL = "https://stitched-images.gospotcheck.com/scene_id%3A19085710%2Cgrid_id%3A23391756/kpi_response/0/realogram/0da32b9b-739c-47d6-98fe-3e74fb0e5c38/0.jpg?auto=format%2Ccompress&quality=70&fit=cover&optimize=true";
        sendIRPhoto(imageURL, companyID, photoGrid).then((data)=>{
          getTags(data.id).then((data)=>{
            extractData(data);
            createReport();
          });
        });
      }
      
    }
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
   
