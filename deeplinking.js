



var interfaceModule = (function ($, ksAPI) {

const init = function(settings){
  console.log("init");
}

 return {
    Run: function (settings) {  
      return init(settings);
    },
    
  }
})(jQuery, ksAPI);
