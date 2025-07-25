


var APICallsModule = (function ($, ksAPI) {

  let tokenV1 = "";
  let tokenV2 = "";
  let companyID = "";

  var APICall = async function (method, url, token, body) {
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



  var sendIRPhoto = async function(imageURL, companyID, photogrid){
    return new Promise(async (resolve, reject) => {
    
      url = "https://api.gospotcheck.com/external/v2/companies/"+companyID+"/image_rec/photo_grids";
      var body = {
          "image_url": imageURL, 
          "photo_type_id": photogrid
      }

      try {
        const data = await APICall("POST",url, tokenV2, body);

        console.log("Place Data received:", data);

        resolve(data);

      } catch (error) {
        console.error("Failed to get Tags:", error);
        reject(error);
      }

      });
  }


var getPlaceData = async function(placeID){

    //return new Promise(async (resolve, reject) => {

      console.log("placeID: ",placeID);

      

      try {
        const url = "https://admin.gospotcheck.com/external/v1/places/"+placeID;
        const data = await APICall("GET",url, tokenV1);

        console.log("Place Data received:", data);

        return data.data;

      } catch (error) {
        console.error("Failed to get Tags:", error);
        throw error;
      }
  //});
}





var getMissionResponse = async function(missionResponseID){

  //  return new Promise(async (resolve, reject) => {

    //url = "https://admin.gospotcheck.com//external/v1/mission_responses?campaign_id.eq="+campaingnID+"&place_id.eq="+placeID+"&completed_at.gt="+getTimeStamps(timeFrame).back+"&include=user,task_responses";
    url = "https://admin.gospotcheck.com//external/v1/mission_responses/"+missionResponseID+"&include=user";


    try { 
      const data = await APICall("GET",url, tokenV1);

      console.log("Response Data received:", data);

      if(data && data.data){

        //var lastItem = data.data[data.data.length - 1];
        //resolve(lastItem);
        //const sorted = data.data.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
        //const latestItems = sorted.slice(0, limit);
        return data.data;

      }
      else{
        console.log("No mission responses found");

        notification("error","No mission responses found in the last "+timeFrame+" minute !! Checking again in 5 seconds.")
        
        setTimeout(function() {
          getMissionResponses(placeID, campaignID, timeFrame, limit).then(resolve).catch(reject);
        }, 5000);

    }
  } catch (error) {
      console.error("Failed to get Mission responses:", error);
      throw error; 
    }
    //  });
}




var getMissionResponses = async function(placeID,campaignID,timeFrame, limit){

  //  return new Promise(async (resolve, reject) => {

    //url = "https://admin.gospotcheck.com//external/v1/mission_responses?campaign_id.eq="+campaingnID+"&place_id.eq="+placeID+"&completed_at.gt="+getTimeStamps(timeFrame).back+"&include=user,task_responses";
    url = "https://admin.gospotcheck.com//external/v1/mission_responses?campaign_id.eq="+campaignID+"&place_id.eq="+placeID+"&completed_at.gt="+getTimeStamps(timeFrame).back+"&include=user";


    try {
      const data = await APICall("GET",url, tokenV1);

      console.log("Response Data received:", data);

      if(data && data.data){

        //var lastItem = data.data[data.data.length - 1];
        //resolve(lastItem);
        const sorted = data.data.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
        const latestItems = sorted.slice(0, limit);
        return latestItems;

      }
      else{
        console.log("No mission responses found");

        notification("error","No mission responses found in the last "+timeFrame+" minute !! Checking again in 5 seconds.")
        
        setTimeout(function() {
          getMissionResponses(placeID, campaignID, timeFrame, limit).then(resolve).catch(reject);
        }, 5000);

    }
  } catch (error) {
      console.error("Failed to get Mission responses:", error);
      throw error; 
    }
    //  });
}


var getLastMissionResponse = async function(placeID, campaignID, timeFrame) {

  console.log(placeID,campaignID,timeFrame);

 // return new Promise(async (resolve, reject) => {

    const url = "https://admin.gospotcheck.com//external/v1/mission_responses?campaign_id.eq=" + campaignID + "&place_id.eq=" + placeID + "&completed_at.gt=" + getTimeStamps(timeFrame).back + "&include=user";

    try {
      const data = await APICall("GET", url, tokenV1);

      console.log("Response Data received:", data);

      if (data && data.data && data.data.length > 0) {
        // Sort by completed_at (most recent last)
        const sorted = data.data.sort((a, b) => new Date(a.completed_at) - new Date(b.completed_at));
        
        const lastItem = sorted[sorted.length - 1];
        return (lastItem);

      } else {
        console.log("No mission responses found");
        notification("error", "No mission responses found in the last " + timeFrame + " minute !! Checking again in 5 seconds.");
        setTimeout(function() {
          getLastMissionResponse(placeID, campaignID, timeFrame);
        }, 5000);
      }

    } catch (error) {
      console.error("Failed to get last Mission response:", error);
      throw error;
    }
 // });
};




var getGrid = async function(MRID){

 // return new Promise(async (resolve, reject) => {
    url = "https://api.gospotcheck.com/external/v2/companies/"+companyID+"/image_rec/photo_grids?mission_response_id="+MRID;
    try {
      const data = await APICall("GET",url, tokenV2);
      //const data = await APICall("POST",url, tokenV2,{"photo_grid_id":GridID});
      console.log("Grid Data received:", data);

      if(data && data.photo_grids && data.photo_grids.length>0){

        

        

        return data.photo_grids;

      }
      else{
        console.log("No Grid found");

        notification("Loading","IR Processing.");

        setTimeout(function(){
          getGrid(MRID)}, 5000);
        }

        
        
    } catch (error) {
      console.error("Failed to get Grids:", error);
      throw error;
    }

 //    });
}

var getTags = async function(GridID){

//  return new Promise((resolve, reject) => {

  //console.log("Getting Tags:", companyID, GridID, tokenV2);

    const url = "https://api.gospotcheck.com/external/v2/companies/"+companyID+"/image_rec/tags?photo_grid_id="+GridID+"&offset=0&limit=500";
    
    try{
    const data = await APICall("GET",url, tokenV2);

      console.log("tag response: ",data);

       if(data &&  data.tags && data.tags.length>0){

          console.log("We got data: ",data.tags);

          interfaceModule.removeNotification();
          return data.tags;
      }
      else{
        console.log("No Tags found");
        interfaceModule.notification("Loading", "Getting the tags.");
        await new Promise(res => setTimeout(res, 5000));
        return await getTags(GridID);
      }

      console.log("Tags Data received:", data);

    } catch (error){
      console.error("Failed to get Tags:", error);
      throw error;
    }
//})
}


var initAPI = function(settings){
  tokenV1 = settings.tokenV1;
  tokenV2 = settings.tokenV2;
  companyID = settings.companyID;
}


 return {
    Run: function (settings) {
      initAPI(settings);
    },
    getPlaceData: function (placeID) {
      return getPlaceData(placeID);
    },
    getLastMissionResponse: function (placeID, campaignID, timeFrame) {
      return getLastMissionResponse(placeID, campaignID, timeFrame);
    },
    getMissionResponses: function (placeID, campaignID, timeFrame,limit) {
      return getMissionResponses(placeID, campaignID, timeFrame,limit);
    },
    getMissionResponse: function (missionResponseID) {
      return getMissionResponse(missionResponseID);
    },
    getTags: function (GridID) {
      return getTags(GridID);
    },
    getGrid: function (MRID) {
      return getGrid(MRID);
    },
  }
})(jQuery, ksAPI);