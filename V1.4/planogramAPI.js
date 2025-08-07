var planogramAPIModule = (function ($, ksAPI) {

 
 var init = async function (companyId,gridId) {

  console.log("gridId",companyId,gridId);

  APICallsModule.getPlanogram(companyId,gridId).then((data)=>{
    console.log("POG Data",data);
  })

 };



 return {
    Run: function (companyId,gridId) {
      init(companyId,gridId);
    },
  }
})(jQuery, ksAPI);

