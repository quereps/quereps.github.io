var planogramAPIModule = (function ($, ksAPI) {

 
const init = function(){
  console.log("hey:",settings);
}



 return {
    Run: function (settings) {
      init(settings);
    },
  }
})(jQuery, ksAPI);

