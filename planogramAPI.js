var APIModule = (function ($, ksAPI) {

 
const init = function(){
  console.log("hey");
}



 return {
    Run: function (settings) {
      init(settings);
    },
  }
})(jQuery, ksAPI);

