



var deeplinkModule = (function ($, ksAPI) {

const init = function(settings, params) {
  console.log("init");

  let company = settings.companyId;
  let missionId = settings.missionId;
  let placeId = settings.placeId;

  // Build customer_data from params array
  let customer_data_obj = {};
  params.forEach(p => {
    customer_data_obj[p.name] = p.val;
  });
  let customer_data = encodeURIComponent(JSON.stringify(customer_data_obj));

  // Example completion_trigger object
  let completion_trigger_obj = {
    action_type: "url_redirect",
    value: settings.callBack || "https://app.form.com/f/41790533/1676/?LQId=1&PlaceId=" + placeId,
    mx_options: ["status", "mx_user_Id"]
  };
  let completion_trigger = encodeURIComponent(JSON.stringify(completion_trigger_obj));

  let link = "gospotcheck://companies/" + company
      + "/missions/" + missionId
      + "/places/" + placeId
      + "/mission_responses/?start=true"
      + "&customer_data=" + customer_data
      + "&completion_trigger=" + completion_trigger;

  return link;
};

 return {
    Run: function (settings, params) {  
      return init(settings, params);
    },
    
  }
})(jQuery, ksAPI);
