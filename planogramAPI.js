var planogramAPIModule = (function ($, ksAPI) {

 
 var init = async function (settingsImport) {

  getPlanogram(gridID).then((data)=>{
    console.log("POG Data",data)
  })

 };



 return {
    Run: function (settings) {
      init(settings);
    },
  }
})(jQuery, ksAPI);

