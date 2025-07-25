var planogramAPIModule = (function ($, ksAPI) {

 
 var init = async function (gridId) {

  console.log("gridId",gridId);

  APICallsModule.getPlanogram(gridId).then((data)=>{
    console.log("POG Data",data);
  })

 };



 return {
    Run: function (gridId) {
      init(gridId);
    },
  }
})(jQuery, ksAPI);

