



var deeplinkModule = (function ($, ksAPI) {

const init = function(settings){
  console.log("init");
  let link = "gospotcheck://companies/5420/missions/4269551/places/56276410/mission_responses/?start=true&customer_data=%7B%22typeImport%22%3A%22test%22%2C%22UPCImport%22%3A%221234567890%22%7D&completion_trigger=%7B%22action_type%22%3A%22url_redirect%22%2C%22value%22%3A%22https%3A%2F%2Fapp.form.com%2Ff%2F41790533%2F1676%2F%3FLQID%3D1%26PlaceID%3D56276410%22%2C%22mx_options%22%3A%5B%22status%22%2C%22mx_user_id%22%5D%7D";

  return link;
}

 return {
    Run: function (settings) {  
      return init(settings);
    },
    
  }
})(jQuery, ksAPI);
