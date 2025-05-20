//this is a test there and there

let sections = {};
 let skuList = {};
 let features = {};

 let ingest = "";
  let companyID = "";
  let missionID = "";
  let tokenV1 = "";
  let tokenV2 = "";

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
  


  var APICall = function (method, url, token, body) {
    return fetch(url, {
      body: JSON.stringify(body),
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Return the parsed JSON response
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error; // Re-throw the error to handle it in the caller
      });
  };



var createTable = function(data, title, structure) {
  // Create a table element with an optional border.
  var $table = $('<table border="1"></table>');

  // If a title is provided, add a caption to the table.
  if (title) {
    $table.append($('<caption></caption>').text(title));
  }

  // Create the table body.
  var $tbody = $('<tbody></tbody>');
  
  // Iterate through the structure.
  // Each property in the structure object represents one row of the table,
  // where the key is the label and the value is the display value.
  $.each(structure, function(label, value) {
    var $row = $('<tr></tr>');
    // Add the label cell.
    $row.append($('<th></th>').text(label));
    // Add the corresponding value cell.
    $row.append($('<td></td>').text(value));
    $tbody.append($row);
  });

  $table.append($tbody);
  return $table;
};



var getPlaceData = async function(placeID){
    url = "https://admin.gospotcheck.com/external/v1/places/"+placeID;
    try {
      const data = await APICall("GET",url, tokenV1);
      //const data = await APICall("POST",url, tokenV2,{"photo_grid_id":GridID});
      console.log("Place Data received:", data);

      let tableElement = createTable(data,"Store", {
        "Name":data.data.name,
        "City":data.data.city,
        "Address":data.data.address
      });


      $('#table-container').append(tableElement);


      getLastMissionResponse(placeID,missionID);

    } catch (error) {
      console.error("Failed to get Tags:", error);
    }
}



let getTimeStamps = function(minBack) {
  let timeframeMinutes = minBack;

  // Get the current time as a Date object
  let now = new Date();
  
  // Convert the current time to a timestamp in milliseconds (UTC)
  let nowTimestampMs = now.getTime();
  
  // Calculate the past timestamp by subtracting the specified minutes (in ms)
  let pastTimestampMs = nowTimestampMs - timeframeMinutes * 60 * 1000;
  
  // EST is UTC-5: subtract 5 hours in milliseconds (this ignores DST)
  const EST_OFFSET_MS = 5 * 60 * 60 * 1000;
  
  // Convert to EST by subtracting the offset, then convert milliseconds to seconds
  //let nowTimestampSeconds = Math.floor((nowTimestampMs - EST_OFFSET_MS) / 1000);
  //let pastTimestampSeconds = Math.floor((pastTimestampMs - EST_OFFSET_MS) / 1000);

  let nowTimestampSeconds = Math.floor(nowTimestampMs / 1000);
  let pastTimestampSeconds = Math.floor(pastTimestampMs / 1000);
  
  return {
    back: pastTimestampSeconds,
    now: nowTimestampSeconds
  };
}





var getImages = function(data){

  let imagesArray = data.task_responses[0].value;
  console.log("imagesArray",imagesArray);


  var $imageContainer = $('<div id="gallery"></div>');

  for(let value in imagesArray){

    let imageURL = imagesArray[value].s3;
    $imageContainer.append($('<div class="image"><img src="'+imageURL+'"/></div>'));
  }

   $('#table-container').append($imageContainer);
}



var getLastMissionResponse = async function(placeID,campaingnID){


  let timeFrame = 6000000;

    url = "https://admin.gospotcheck.com//external/v1/mission_responses?campaign_id.eq="+campaingnID+"&place_id.eq="+placeID+"&completed_at.gt="+getTimeStamps(timeFrame).back+"&include=user,task_responses";

    try {
      const data = await APICall("GET",url, tokenV1);
      //const data = await APICall("POST",url, tokenV2,{"photo_grid_id":GridID});
      console.log("Response Data received:", data);

      if(data && data.data){

        removeNotification();

        var lastItem = data.data[data.data.length - 1];

        let tableElement = createTable(lastItem,"Latest Mission", {
          "Completed":moment(lastItem.completed_at).fromNow(),
          "Completed By":lastItem.user.first_name+" "+lastItem.user.last_name
        });


        $('#table-container').append(tableElement);


        getGrid(lastItem.id);


        //getImages(lastItem);

        if(features.images){
          getImages(lastItem);
        }

      }
      else{
        console.log("No mission responses found");

        notification("error","No mission responses found in the last "+timeFrame+" minute !! Checking again in 5 seconds.")
        
        setTimeout(function(){
          getLastMissionResponse(placeID,campaingnID)}, 5000);
        }

      

      

    } catch (error) {
      console.error("Failed to get Tags:", error);
    }
}




var getGrid = async function(MRID){
    url = "https://api.gospotcheck.com/external/v2/companies/"+companyID+"/image_rec/photo_grids?mission_response_id="+MRID;
    try {
      const data = await APICall("GET",url, tokenV2);
      //const data = await APICall("POST",url, tokenV2,{"photo_grid_id":GridID});
      console.log("Grid Data received:", data);

      if(data && data.photo_grids && data.photo_grids.length>0){

        removeNotification();


        // Create an array of promises from getTags
        let tagPromises = data.photo_grids.map(grid => getTags(grid.id));

        await Promise.all(tagPromises);

        createReport();

           

      }
      else{
        console.log("No Grid found");

        notification("Loading","IR Processing.");

        setTimeout(function(){
          getGrid(MRID)}, 5000);
        }
        
    } catch (error) {
      console.error("Failed to get Grids:", error);
    }
}

var getTags = async function(GridID){

  return new Promise((resolve, reject) => {

    url = "https://api.gospotcheck.com/external/v2/companies/"+companyID+"/image_rec/tags?photo_grid_id="+GridID+"&offset=0&limit=500";
    
    APICall("GET",url, tokenV2).then((data) => {

       if(data &&  data.tags && data.tags.length>0){
          removeNotification();
          extractData(data.tags);
          resolve();
      }
      else{
        console.log("No Tags found");

        notification("Loading","Getting the tags.");

        setTimeout(() => getTags(GridID).then(resolve).catch(reject), 5000);
      }

      console.log("Tags Data received:", data);

    })
      //const data = await APICall("POST",url, tokenV2,{"photo_grid_id":GridID});
 .catch ((error) => {
      console.error("Failed to get Tags:", error);
      reject(error);
    })
})
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


    var addFilters = function(){

      //console.log("hey: "+sections);
      for(let filter in sections){
//console.log("hoooo: "+sections[filter],"hey"+filter);
          var button = $('<div id="filter'+filter+'" class="filter '+filter+'">'+filter+'</div>');
          $('#filtersContainer').append(button);

      }
}


var removeNotification = function() {
  // Get the container element
  var container = document.getElementById('table-container');
  
  if (!container) {
    console.error("Container #table-container not found.");
    return;
  }
  
  // Look for the error message element within the container
  var errorDiv = container.querySelector('.notification');
  
  // If an error message is found, remove it
  if (errorDiv) {
    container.removeChild(errorDiv);
  }
};


var notification = function(type,message) {
  // Get the container element
  var container = document.getElementById('table-container');
  
  if (!container) {
    console.error("Container #table-container not found.");
    return;
  }
  
  // Remove any existing error message (assumed to have the class 'error-message')
  var existingError = container.querySelector('.notification');
  if (existingError) {
    container.removeChild(existingError);
  }
  
  // Create a new div element for the error message
  var errorDiv = document.createElement('div');
  
  // Assign a class for styling and identification
  errorDiv.className = 'notification '+type;
  
  // Set the text content to the provided message
  errorDiv.textContent = message;
  
  // Append the new error message to the container
  container.appendChild(errorDiv);
};

    




let createReport = function(){

      var filtersContainer = $('<div id="filtersContainer"></div>');
      $('#table-container').append(filtersContainer);

      if(features.sections){
        addFilters();
      }
      

    //if(!$(".oosContainer")){
      var oosContainer = $('<div id="oosContainer"><h3><img src="https://em-content.zobj.net/source/apple/419/package_1f4e6.png"/>Restock</h3></div>');
      $('#table-container').append(oosContainer);
    //}

   // if(!$(".pricingContainer")){
      var pricingContainer = $('<div id="pricingContainer"><h3><img src="https://em-content.zobj.net/source/apple/419/label_1f3f7-fe0f.png"/>Price Tags</h3></div>');
      $('#table-container').append(pricingContainer);
   // }

  for(let sku in skuList){
    skuList[sku].showTile();
  }
}




 var init = function (settings) {

   companyID = settings.companyID;
   missionID = settings.missionID;
   tokenV1 = settings.tokenV1;
   tokenV2 = settings.tokenV2;
   features = settings.features;

  let placeID = vpGetTextResults("PlaceID");

  getPlaceData(placeID);
 };

 return {
    Run: function (settings) {
      init(settings);
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
        images:true,
      },
     }
*/
   
