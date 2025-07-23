


var APICallsModule = (function ($, ksAPI) {

  let tokenV1 = "";
  let tokenV2 = "";
  let companyId = "";

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



  var sendIRPhoto = async function(imageURL, companyId, photogrId){
    return new Promise(async (resolve, reject) => {
    
      url = "https://api.gospotcheck.com/external/v2/companies/"+companyId+"/image_rec/photo_grIds";
      var body = {
          "image_url": imageURL, 
          "photo_type_Id": photogrId
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


var getPlaceData = async function(placeId){

    //return new Promise(async (resolve, reject) => {

      console.log("placeId: ",placeId);

      

      try {
        const url = "https://admin.gospotcheck.com/external/v1/places/"+placeId;
        const data = await APICall("GET",url, tokenV1);

        console.log("Place Data received:", data);

        return data.data;

      } catch (error) {
        console.error("Failed to get Tags:", error);
        throw error;
      }
  //});
}





var getMissionResponse = async function(missionResponseId){

  //  return new Promise(async (resolve, reject) => {

    //url = "https://admin.gospotcheck.com//external/v1/mission_responses?campaign_Id.eq="+campaingnId+"&place_Id.eq="+placeId+"&completed_at.gt="+getTimeStamps(timeFrame).back+"&include=user,task_responses";
    url = "https://admin.gospotcheck.com//external/v1/mission_responses/"+missionResponseId+"&include=user";


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
          getMissionResponses(placeId, campaignId, timeFrame, limit).then(resolve).catch(reject);
        }, 5000);

    }
  } catch (error) {
      console.error("Failed to get Mission responses:", error);
      throw error; 
    }
    //  });
}




var getMissionResponses = async function(placeId,campaignId,timeFrame, limit){

  //  return new Promise(async (resolve, reject) => {

    //url = "https://admin.gospotcheck.com//external/v1/mission_responses?campaign_Id.eq="+campaingnId+"&place_Id.eq="+placeId+"&completed_at.gt="+getTimeStamps(timeFrame).back+"&include=user,task_responses";
    url = "https://admin.gospotcheck.com//external/v1/mission_responses?campaign_Id.eq="+campaignId+"&place_Id.eq="+placeId+"&completed_at.gt="+getTimeStamps(timeFrame).back+"&include=user";


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
          getMissionResponses(placeId, campaignId, timeFrame, limit).then(resolve).catch(reject);
        }, 5000);

    }
  } catch (error) {
      console.error("Failed to get Mission responses:", error);
      throw error; 
    }
    //  });
}


var getLastMissionResponse = async function(placeId, campaignId, timeFrame) {

  console.log(placeId,campaignId,timeFrame);

 // return new Promise(async (resolve, reject) => {

    const url = "https://admin.gospotcheck.com//external/v1/mission_responses?campaign_Id.eq=" + campaignId + "&place_Id.eq=" + placeId + "&completed_at.gt=" + getTimeStamps(timeFrame).back + "&include=user";

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
          getLastMissionResponse(placeId, campaignId, timeFrame);
        }, 5000);
      }

    } catch (error) {
      console.error("Failed to get last Mission response:", error);
      throw error;
    }
 // });
};




var getGrId = async function(MRId){

 // return new Promise(async (resolve, reject) => {
    url = "https://api.gospotcheck.com/external/v2/companies/"+companyId+"/image_rec/photo_grIds?mission_response_Id="+MRId;
    try {
      const data = await APICall("GET",url, tokenV2);
      //const data = await APICall("POST",url, tokenV2,{"photo_grId_Id":GrIdId});
      console.log("GrId Data received:", data);

      if(data && data.photo_grIds && data.photo_grIds.length>0){

        

        

        return data.photo_grIds;

      }
      else{
        console.log("No GrId found");

        notification("Loading","IR Processing.");

        setTimeout(function(){
          getGrId(MRId)}, 5000);
        }

        
        
    } catch (error) {
      console.error("Failed to get GrIds:", error);
      throw error;
    }

 //    });
}

var getTags = async function(GrIdId){

//  return new Promise((resolve, reject) => {

  console.log("Getting Tags:", companyId, GrIdId, tokenV2);

    const url = "https://api.gospotcheck.com/external/v2/companies/"+companyId+"/image_rec/tags?photo_grId_Id="+GrIdId+"&offset=0&limit=500";
    
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
        return await getTags(GrIdId);
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
  companyId = settings.companyId;
}


 return {
    Run: function (settings) {
      initAPI(settings);
    },
    getPlaceData: function (placeId) {
      return getPlaceData(placeId);
    },
    getLastMissionResponse: function (placeId, campaignId, timeFrame) {
      return getLastMissionResponse(placeId, campaignId, timeFrame);
    },
    getMissionResponses: function (placeId, campaignId, timeFrame,limit) {
      return getMissionResponses(placeId, campaignId, timeFrame,limit);
    },
    getMissionResponse: function (missionResponseId) {
      return getMissionResponse(missionResponseId);
    },
    getTags: function (GrIdId) {
      return getTags(GrIdId);
    },
    getGrId: function (MRId) {
      return getGrId(MRId);
    },
  }
})(jQuery, ksAPI);