
const legendColors = {
  "Coca": "#e7151e",
  "Red Bull": "#009ede",
  "Fanta": "#f87f00",
  "Monster": "#9ac435",
  "Lucozade": "#A66EFF",
  "Pepsi": "#0e0f94",
  "7Up": "#35A8F4",
  "Oasis": "#F05A7A",
  "Dr Pepper": "#920528",
  "Ribena": "#F8CE5C",
  "Glaceau": "#42B9BD",
  "Unrecognized":"#cccccc",
  "Empty":"#cccccc",
};

const fallbackPalette = [
  '#007dc6', // Kroger Blue (Primary)
  '#4ca0e1', // Light Blue
  '#002f6c', // Dark Blue (Kroger corporate palette)
  '#7ec4f7', // Pastel Blue
  '#52565e', // Kroger Grey (neutral for contrast)
  '#e3e9ef', // Very Light Blue-Grey
  '#49b28b', // Fresh Green (for positive/OK status)
  '#f7d354', // Soft Yellow (for warning/neutral)
  '#f78c40', // Muted Orange (for secondary highlight)
  '#cfcfcf', // Light Grey (for background or filler)
  '#7356a6', // Soft Violet (gentle accent, not too prominent)
  '#d46a6a', // Soft Red (for negative/error)
  '#8fbcbb', // Gentle Teal (adds variety, still cool palette)
  '#ffd8b1', // Peach (subtle, low priority)
  '#7e8f7c', // Muted Olive (for very low emphasis)
  '#b0c4de', // Pale Blue (soft for large data sets)
  '#dee5ee', // Lightest Blue-Grey (almost white)
  '#f3e7f3', // Very Light Lilac (soft filler)
  '#808080', // Medium Grey (classic, good for "other" or nulls)
  '#444444'  // Dark Grey (for outlines/contrast)
];



const reportTemplates = {
  placeData: {
        type:"place",
        title:"Place",
        logo:"https://app.form.com/fs/v1/h/XPpqtoQBS7264PDKTZLfkykHxNDvIZMcjR5D4recFyk/277606.png",
          options:{
            width:"40%",
            destination:"intro",
          }
      },
      responseData: {
        type:"response",
        title:"Response",
        logo:"https://app.form.com/fs/v1/h/ikwVdohQfA6RF1rXRaZ_5cb94aHsGa9pocnQjSALzbc/277592.png",
          options:{
            width:"40%",
            destination:"intro",
        }
      },
      skuList:{
        type:"skuList",
        title:"SKU List",
        logo:"https://app.form.com/fs/v1/h/aMdkGmN080RYiT1L7rDWkrKEKuFd-b76KN8Wt-djYao/277611.png",
        columns:["upc", "brand","name", "facings"],
        settings:{
            legend:false,
          exclude:["undefined","Unrecognized","Empty Facing"],
        } 
      },
      supplierShare:{
        type:"graph",
        title:"Suppliers",
        logo:"https://app.form.com/fs/v1/h/ayYV9BfGgRa2acx899yrpYD2EChBtrQoXiMwKcEy504/277594.png",
        dimension:"supplier",
        graphType:"pie",
        settings:{
            legend:true,
          exclude:["undefined","Unrecognized","Empty Facing"],
          colorMap:legendColors || [],
          fallbackPalette:fallbackPalette || [],
          showLabels:true,
          labelType:"label",
          asPercentage:true,
        }    
      },
        brandShare:{
        type:"graph",
        title:"Share of Shelf per Brand",
        logo:"https://app.form.com/fs/v1/h/o2Hec5ANCkdseEnpn-lMSfjWJg5I4VTFnGY4yVyEDR4/277586.png",
        dimension:"brand",
        graphType:"bar",
        settings:{
            legend:false,
          exclude:["undefined","Unrecognized","Empty Facing"],
          colorMap:legendColors || [],
            fallbackPalette:fallbackPalette || [],
            indexAxis: 'y',
            limit:10,
            showLabels:true,
            labelType:"value",
            asPercentage:true,
        }    
      }
};


var interfaceModule = (function ($, ksAPI) {


  let skuList = {};
  let settings = {};
  let realogram = [];
   let placeId = "";
   let  companyId = "";
   let missionId = "";

var removeNotification = function(destination) {

  let destinationContainer = destination || "main_frame";
  // Get the container element
  var container = document.getElementById(destinationContainer);
  
  if (!container) {
    console.error("Container #"+destinationContainer+" not found.");
    return;
  }
  
  // Look for the error message element within the container
  var errorDiv = container.querySelector('.notification');
  
  // If an error message is found, remove it
  if (errorDiv) {
    container.removeChild(errorDiv);
  }
};


var notification = function(type,message,destination) {

  let destinationContainer = destination || "main_frame";
  // Get the container element

  console.log("destinationContainer: ",destinationContainer);


  var container = document.getElementById(destinationContainer);
  
  if (!container) {
    console.error("Container #"+destinationContainer+" not found.");
    return;
  }
  
  // Remove any existing error message (assumed to have the class 'error-message')
  var existingError = container.querySelector('.notification');
  if (existingError) {
    container.removeChild(existingError);
  }
  
  // Create a new div element for the error message
  var errorDiv = document.createElement('div');
  
  // Assign a class for styling and Identification
  errorDiv.className = 'notification '+type;
  
  // Set the text content to the provIded message
  errorDiv.textContent = message;
  
  // Append the new error message to the container
  container.appendChild(errorDiv);
};




var createTable = function(data, structure) {
  // Create a table element with an optional border.
  var $table = jQuery('<table class="customTable"></table>');

  // Create the table body.
  var $tbody = jQuery('<tbody></tbody>');
  
  // Iterate through the structure.
  // Each property in the structure object represents one row of the table,
  // where the key is the label and the value is the display value.
  jQuery.each(structure, function(label, value) {
    var $row = jQuery('<tr></tr>');
    // Add the label cell.
    $row.append(jQuery('<th></th>').text(label));
    // Add the corresponding value cell.
    $row.append(jQuery('<td></td>').text(value));
    $tbody.append($row);
  });

  $table.append($tbody);
  return $table;
};




function JSONToHTMLTable(jsonArray, destination, settings) {

    // Get the list of keys to exclude, defaulting to an empty array if not provIded
    const excludeList = settings?.exclude || [];

    // Filter the input array to exclude objects whose *first key* is in the exclude list
    const filteredArray = jsonArray.filter(obj => {
        const key = Object.keys(obj)[0]; // Only checks the first key
        return !settings?.exclude?.includes(key);
    });

    // Extract all unique keys from the filtered array to use as table headers
    const keys = Array.from(
        filteredArray.reduce((set, obj) => {
            Object.keys(obj).forEach(key => set.add(key));
            return set;
        }, new Set())
    );

    // Begin building the HTML table string
    let html = "<table class='customTable IRDataTable'><thead><tr>";
    
    // Add table headers with title-cased key names
    html += keys.map(key => `<th>${toTitleCase(key)}</th>`).join("");
    html += "</tr></thead><tbody>";

    // Add table rows and cells for each object in the filtered array
    filteredArray.forEach(obj => {
        html += "<tr>";
        html += keys.map(key => `<td>${obj[key] !== undefined ? obj[key] : ""}</td>`).join("");
        html += "</tr>";
    });

    html += "</tbody></table>";

    // If a destination is provIded, inject the table HTML into the DOM
    if(destination){
        jQuery("#" + destination + " .content").append(html);
    }

    // Return the full HTML string (useful if needed elsewhere)
    return html;
}






function numberTile(jsonArray,destination,settings){

  console.log("Creating Number Tile");

  console.log(jsonArray[settings.filter]);

  let unit = settings?.asPercentage==true ? "%" : "";

  //let value = jsonArray[settings.filter]+unit || 0+unit;

  let value = (jsonArray[settings.filter] != null && jsonArray[settings.filter] !== "") 
      ? jsonArray[settings.filter] + unit 
      : "0" + unit;

  let html = "<h4>"+value+"</h4>"; 

  if(destination){
      jQuery("#"+destination+" .content").append(html);
    }
}

function JSONToGraph(jsonArray, title, type, destination, settings) {

    console.log("JSONToGraph Start: ",jsonArray);
    const excluding = settings?.exclude || [];
    let entries = Object.entries(jsonArray).filter(([k, v]) => !excluding?.includes(k));
    entries.sort((a, b) => b[1] - a[1]);
    let labels = entries.map(([k, v]) => k);
    let data = entries.map(([k, v]) => v);
    const limit = settings?.limit || null;
    if(limit != null){
      labels = labels.slice(0, limit);
      data = data.slice(0, limit);
    }
    
    jQuery("#"+destination+" .content").append("<div class='canvasContainer'></div>");
      

    const backgroundColors = labels.map(label => {
      for (const [key, color] of Object.entries(settings?.colorMap || {})) {
        if (label.toLowerCase().includes(key.toLowerCase())) {
          return color;
        }
      }

      // Use fallback palette if no match
      const palette = settings?.fallbackPalette || [
        '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
        '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
        '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
        '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
      ];
      const index = labels.indexOf(label) % palette.length;
      return palette[index];
    });

    let parent = jQuery("#"+destination+" .canvasContainer")[0] || document.body;
    let canvas = document.createElement('canvas');
    canvas.width = 250;
    canvas.height = 250;
    canvas.style.width = "100px";
    canvas.style.height = "100px";
    parent.appendChild(canvas);
    
    // Conditionally register the plugin
    if (typeof ChartDataLabels !== 'undefined') {
        Chart.register(ChartDataLabels);
    }
    
    // Build options object conditionally
    const chartOptions = {
        color: '#ffffff',
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: settings.indexAxis || "",
        plugins: {
            title: {
                display: false,
                text: toTitleCase(title),
            },
            legend: {
                display: settings.legend,
                labels: {
                  color: "#000",
                }
            }
        }
    };

    if(type=="bar"){

      chartOptions.scales = {
        x: {
          display: false, // completely hIdes the x-axis (ticks, grId, and line)
          grid: {
            display: false, // hIdes grId lines
            drawBorder: false
          },
          ticks: {
            display: false // hIdes axis values (numbers/labels)
          }
        },
        y: {
          display: true,
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            display: true
          }
        }
      };
    }
    

    //https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels
    // Add datalabels only if the plugin is available and enabled
    if (typeof ChartDataLabels !== 'undefined' && settings?.showLabels !== false) {
        chartOptions.plugins.datalabels = {
            formatter: (value, context) => {
                const type = settings?.labelType || "label"; // default to label
                const formatedValue = settings?.asPercentage ? value+"%" : value;
                return type === "value"
                    ? formatedValue
                    : context.chart.data.labels[context.dataIndex];
            },
            color: '#fff',
            font: {
                weight: 'bold',
                size: 10
            },
            anchor: 'end',
            align: 'start',
            offset: 2
        };
    }
    
    window.currentChart = new Chart(canvas, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: "Count",
                data: data,
                backgroundColor: backgroundColors,
            }]
        },
        options: chartOptions
    });
}


function createHTMLSection(id,name, imageURL,type, settings){

        console.log("createHTMLSection: ",id,name);

        let classToAdd="";
        let style="";
        let background = settings?.background ? "background:"+settings?.background+";" : "";
        style += background;
        let width = settings?.width ? "wIdth:"+settings?.width+";" : "";
        style += width;
        let color = settings?.color ? "color:"+settings?.color+";" : "";
        style += color;
        let maxHeight = settings?.maxHeight ? "max-height:"+settings?.maxHeight+";" : "";
        style += maxHeight;
        let destination = settings?.destination || "";

        if(settings?.wrap==false){
          classToAdd="noWrap";
        }

        if(settings?.gap==true){
          classToAdd+="gap";
        }

        if(settings?.grow==false){
          classToAdd+="noGrow";
        }

        if(settings?.stretch==true){
          classToAdd+="stretch";
        }

        title = name || "";
        //name = title.replace(/\s+/g, "_"); // Replace spaces with underscores
        headerHTML = "";

        if (title) {
          headerHTML = '<h3>';
          headerHTML += (imageURL ? '<img height="40" src="'+imageURL+'"/>' : '');
          headerHTML += title ? title : '';
          headerHTML += '</h3>';
        }
       
        
        
        var Container = jQuery('<div style="'+style+'" class="container '+classToAdd+' '+type+'" id="Container'+id+'">'+headerHTML+'<div class="content"></div></div>');
        //var Container = jQuery('<div class="container '+type+'" Id="Container'+Id+'"><h3><img height="40" src="'+imageURL+'"/>'+title+'</h3></div>');
        jQuery('#'+destination).append(Container);


}



function graph(category, asPercentage = false, filter = null) {
  //console.log("asPercentage: ", asPercentage);
  //console.log("filter: ", filter);
  
  const graphData = {};
  let totalFacings = 0;
  
  //console.log("SKU List: ", skuList);
  //console.log("category: ",category);


  for (let sku in skuList) {
    const current = skuList[sku];

    //console.log("current: ", current);
    
    // Apply filter if provIded
    if (filter && current[filter.property] !== filter.value) {
      console.log("checking filter");
      continue; // Skip this SKU if it doesn't match the filter
    }
    
   // const categoryValue = current[category];
    if (!category) {
        console.warn("Missing 'category' parameter in graph() call.");
        return {};
      }

      const categoryValue = current[category];
      if (!categoryValue) {
        console.warn("Missing expected category key:", category, "in SKU:", current);
      }





    const facings = Number(current.facings) || 0;
    
    if (!graphData[categoryValue]) {
      graphData[categoryValue] = 0;
    }
    
    graphData[categoryValue] += facings;
    totalFacings += facings;
  }
  
  if (asPercentage && totalFacings > 0) {
    for (let key in graphData) {
      graphData[key] = +(graphData[key] / totalFacings * 100).toFixed(0);
    }
  }
  
  //console.log("graphData: ", graphData);
  return graphData;
}


    var showSections = function(sections, destination, settings){

      jQuery('#'+destination+" .content").addClass("buttons");

      for(let filter in sections){

          // Skip if this filter is in settings.exclude
        if (settings?.exclude && settings?.exclude.includes(filter)) continue;

          var button = jQuery('<div id="filter'+filter+'" class="filter '+filter+'">'+filter+'</div>');
          jQuery('#'+destination+" .content").append(button);

      }
}



var POG = function(category,destination){

  if(realogram && realogram.length>0){
    var POGElement = jQuery('<div class="pog '+category+'"></div>');
    jQuery('#'+destination).append(POGElement);

    for(let shelf in realogram){
      let currentShelf = realogram[shelf];

      var ShelfElement = jQuery('<div class="shelf shelf_'+shelf+'"></div>');
      jQuery('#'+destination+" .pog").append(ShelfElement);

      for(let sku in currentShelf){
        var currentSKU = currentShelf[sku];

        console.log(currentSKU);

        var SKUElement = jQuery('<div style="width:'+Math.round(currentSKU.width)+'em;height:'+Math.round(currentSKU.height)+'em;" class="sku '+currentSKU.type+' '+currentSKU[destination]+' sku_'+sku+'"></div>');
        jQuery('#'+destination+" .pog .shelf_"+shelf).append(SKUElement);

      }

    }

  }
  
}



 function htmlTile(
      {
        object = {},
        data:{
          title = "",
          subtitle = "",
          description = "",
          number = "",
        },
        table = [],
        resultLabel = "",
        result: {
          expected = 0,
          actual   = 0,
          check = "",
          checkIcon = "https://app.form.com/fs/v1/h/1bfwXHoEd90XVh2qaOgP83a-19gdGBMLCCrPVPlGHgE/275043.png",
        } = {},
        meter: {
          value = 0,
          full   = 0
        } = {},
        barcode = false,
        packshot = false,
        cssClass = "",
        upc="",
        action: {
          target = "",
          icon = "",
        } = {},
      }){

      let htmlContent = "";

      let low = 0;
      let high = 0;
      if (full) {
        low  = Math.round(full * 0.3);
        high = Math.round(full * 0.7);
      }

    let titleHTML = title ? "<h1>"+title+"</h1>" : ""; 
    let subtitleHTML = subtitle ? "<h2>"+subtitle+"</h2>" : ""; 
    let descHTML = description ? "<p class='description'>"+description+"</p>" : ""; 
    let coloredHTML = number ? "<div class='colored'>"+number+"</div>" : ""; 
    let barcodeHTML = barcode ? "<img class='barcode' id='barcode"+upc+"' src='' />" : "";
    let packshotHTML = packshot ? "<div class='packshot pshot"+upc+"''></div>" : "";

    let titleGroupHTML = "<div class='titleGroupHTML'>"+titleHTML+subtitleHTML+barcodeHTML+descHTML+coloredHTML+"</div>";

    let headerHTML = "<div class='header'>"+packshotHTML+titleGroupHTML+"</div>"  
    

    let meterHTML="";
    let expectationHTML="";
    let expectedHTML = "";

    let resultContainerHTML = "";
    let actionContainer = "";
 

    if(value && full){
      let valueHTML = value ? "<div class='value'>"+value+"</div>" : ""; 
      let fullHTML = full ? "<div class='full'>"+full+"</div>" : ""; 
      let gaugeHTML = (value && full) ? "<meter value="+value+" min='0' max="+full+" low="+low+" high="+high+" optimum="+full+"></meter>" : ""; 
      meterHTML = "<div class='resultContainer'>"+valueHTML+gaugeHTML+fullHTML+"</div>"
    }

    if(expected && actual){
      expectationHTML = "<div class='expectationDiv'><div class='actual'>"+actual+"</div><div class='expected'>"+expected+"</div></div>"; 
    }

    if(expected && !actual){
      expectedHTML = "<div class='expected'>"+expected+"</div>"; 
    }
   
    //console.log("check: ",check);
    let checkHTML = check ? "<div class='check check_"+check+"''></div>" : "";
    //console.log("checkHTML: ",checkHTML);

    resultContainerHTML = "<div class='resultContainer'><h4>"+resultLabel+"</h4>"+checkHTML+meterHTML+expectationHTML+expectedHTML+"</div>" 
   

    let tableHTML = "<table>";

    

    if(table){
      for(let i in table){
          let item = table[i];
          tableHTML=tableHTML+"<tr><th>"+item+"</th><td>"+object[table[i]]+"</td></tr>";
          htmlContent=htmlContent+tableHTML;
      }

    }
    

    tableHTML = tableHTML+"</table>";


    if(target && icon){
      let actionHTML = "<a class='action' href='"+target+"'><img width='40' src='"+icon+"'/></a>";
      actionContainer = actionContainer+actionHTML;
    }



    htmlContent = headerHTML+resultContainerHTML+actionContainer;
  
    const HTMLOutput = "<div class='SKULabel check_"+check+" "+cssClass+"' id='fc"+upc+"'>"+htmlContent+"</div>";

    console.log(HTMLOutput);
    return HTMLOutput;
  }



function addCheckbox(elm,checkboxQuestion,num){

  //let QNum = vpFindQuestion(checkboxQuestion).prefix;
  //let checkBoxToMove = vpGetElements(checkboxQuestion+".A"+num);
  //jQuery('.aDivQId_'+checkboxQuestion+' tr.mobileFriendControl.aDivQA_'+QNum+'_A'+num).appendTo('#'+elm);
  //jQuery(checkBoxToMove).appendTo('#'+elm);

  let button = "<div class='restock'>Restocked</div>"
  jQuery(button).appendTo('#'+elm);
}

function toggleCheckbox(a){
  if(vpGetResults(a) && vpGetResults(a).length==0){
    vpSetResults(a);
  }
  else{
      vpResetResults(a);
  }
}


function barcodeGenerate(code) {

  if(code && code.length>0 && jQuery("#barcode" + code) && jQuery("#barcode" + code).length>0){
    let format;
    if (code.length === 8) {
      format = "EAN8";
    } else if (code.length === 13) {
      format = "EAN13";
    } else {
      console.warn(`UPC length ${code.length} isn’t EAN8/13—using Code128`);
      format = "CODE128";
    }

    JsBarcode("#barcode" + code, code, {
      format,
      lineColor: "#000",
      width: 1,
      height: 15,
      displayValue: true,
      margin: 0,
      background: "#fafafa",
      fontSize: 10
    });
  }else{
    console.log("No barcode to render");
  }
  
};



let createMap = function(z,address){


const link1 = document.createElement("link");
  link1.rel = "stylesheet";
  link1.href = "https://unpkg.com/leaflet/dist/leaflet.css";
  document.head.appendChild(link1);



//https://unpkg.com/leaflet/dist/leaflet.js
  //<div Id="map" style="height: 400px;"></div>
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  console.log("creating map...");


  fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.length > 0) {
      const lat = data[0].lat;
      const lon = data[0].lon;
      //console.log("Coordinates:", lat, lon);

      // Now you can initialize your Leaflet map
      const map = L.map('map').setView([lat, lon], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Define custom icon
        const redIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          iconSize:     [25, 41],
          iconAnchor:   [12, 41],
          popupAnchor:  [1, -34],
          shadowSize:   [41, 41]
        });

      L.marker([lat, lon], { icon: redIcon }).addTo(map);
    }
  });


}



const placeSection = function(placeId,options,destination){

  //console.log("placeSection: ", placeId);

  APICallsModule.getPlaceData(placeId).then((placeData)=>{

  let tableElement = createTable(placeData, {
        "Name":placeData.name,
        "City":placeData.city,
        "Address":placeData.address,
      });
      jQuery('#'+destination+" .content").append(tableElement);

      if(options?.map==true){

          jQuery('#'+destination+" .content").append('<div id="map" style="height: 250px;width:50%;"></div>');
          createMap(10,placeData.address+" "+placeData.postal_code+" "+placeData.city);
      }

    })
}




const MissionResponseSection = function(placeId,missionId,destination){


      APICallsModule.getLastMissionResponse(placeId,missionId,600000).then((missionData)=>{

        let tableElement = createTable(missionData, {
          "Completed":moment(missionData.completed_at).format('DD/MM/YYYY')+" ("+moment(missionData.completed_at).fromNow()+")",
          "Completed By":missionData.user.first_name+" "+missionData.user.last_name,
          "Distance to place": `${parseFloat(missionData?.distance_to_place).toFixed(2) || "0.00"} miles`,
        });
        jQuery('#'+destination+" .content").append(tableElement);

        let buttons = `
          <button id="prevMRID" type="button" onclick="APIModule.ChangeMissionResponse(-1)">Previous</button>
          <button id="nextMRID" type="button" onclick="APIModule.ChangeMissionResponse(1)">Next</button>
        `;
        jQuery('#' + destination + " .content").append(buttons);
        jQuery('#prevMRID').prop('disabled', true);


        if(settings.currentMissionResponses+1==settings.missionResponses.length){
              jQuery('#nextMRID').prop('disabled', true);
            }
            else{
              jQuery('#nextMRID').prop('disabled', false);
            }

            if(settings.currentMissionResponses==0){
              jQuery('#prevMRID').prop('disabled', true);
            }
            else{
              jQuery('#prevMRID').prop('disabled', false);
            }
  });
}


var photo = function(containerId){ 

  let photosArray = APIModule.photoURLs;

  for(let photo of photosArray){
    let photoDiv = "<img src='"+photo+"'></img>";
    jQuery('#'+containerId+" .content").append(photoDiv);
  }
  
}




const EmptyReport = function(){
  //jQuery("#table-container").empty();
  jQuery(".sectionContainer").empty();
}


var createReport = function(settingsImport,skuListImport,sectionsImport){


  EmptyReport();

  complianceModule?.Run(settings);

  console.log("Creating Report");

  
  skuList = skuListImport;
  sections = sectionsImport;
  settings = settingsImport;
  config = settingsImport.config;
  report = settingsImport.report;

  companyId = config.companyId;
  placeId = config.placeId;
  missionId = config.missionId;
  

  //console.log("report: ",report);

  //console.log("skuList: ",skuList);

    for(var element in report){

      var current = report[element];
      var containerId = "Container"+element;

      createHTMLSection(element,current?.title,current?.logo,current?.type,current?.options);

      if(current.type=="place"){
        placeSection(placeId,current.options,containerId);
      }

      if(current.type=="Compliance"){
        complianceModule.complianceReportCreation(current, element);
      }

      if(current.type=="response"){
        MissionResponseSection(placeId,missionId,containerId);
      }


      if(current.type=="number"){

        //console.log("graph dimension: ", current.dimension);
        //console.log("first SKU keys: ", Object.keys(Object.values(skuList)[0]));

        numberTile(graph(current.dimension,current?.options?.asPercentage),containerId,current.options);
      }


      if(current.type=="sections"){
        showSections(sections,containerId,current.options);
      }

       if(current.type=="graph"){

        let data = graph(current.dimension,current?.settings?.asPercentage,current?.settings?.filter);
       
        if(Object.keys(data).length>0){
          JSONToGraph(data, current.dimension ,current.graphType, containerId, current.settings);
        } else{
          jQuery("#"+containerId).hide();
        }
        
      }
 
      if(current.type=="skuList"){
        JSONToHTMLTable(rankObjects(skuList, "facings", current.columns), containerId, current.settings) 
      }

      if(current.type=="pog"){
        POG(current.category,containerId);
      }

      if(current.type=="photo"){
        photo(containerId);
      }

    }

    vpHideLoader();
}


function loadReportTemplates(){
  return reportTemplates;
} 

 return {
    createReport: function (settings,skuList,sections) {  
      return createReport(settings,skuList,sections);
    },
    removeNotification: function (destination) {
      removeNotification(destination);
    },
    notification: function (type,message,destination) {
      notification(type,message,destination);
    },
    htmlTile: function (settings) {
      //console.log("htmlTile import",settings);
      return htmlTile(settings);
    },
    barcodeGenerate: function (code) {
      barcodeGenerate(code);
    },
    createHTMLSection: function (id,name, imageURL,type, settings) {
      createHTMLSection(id,name, imageURL,type, settings);
    },
    createTable: function (data, structure) {
      createTable(data, structure);
    },
    loadReportTemplates: function(){
      return loadReportTemplates();
    }
  }
})(jQuery, ksAPI);
