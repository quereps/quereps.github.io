var removeNotification = function() {
  // Get the container element
  var container = document.getElementById('table-container');
  
  if (!container) {
    console.error("Container #table-container not found.");
    return;
  }
  
  // Look for the error message element within the container
  var errorDiv = container.querySelector('.notification');
  
  // If an error message is found, remove it
  if (errorDiv) {
    container.removeChild(errorDiv);
  }
};


var notification = function(type,message) {
  // Get the container element
  var container = document.getElementById('table-container');
  
  if (!container) {
    console.error("Container #table-container not found.");
    return;
  }
  
  // Remove any existing error message (assumed to have the class 'error-message')
  var existingError = container.querySelector('.notification');
  if (existingError) {
    container.removeChild(existingError);
  }
  
  // Create a new div element for the error message
  var errorDiv = document.createElement('div');
  
  // Assign a class for styling and identification
  errorDiv.className = 'notification '+type;
  
  // Set the text content to the provided message
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

    // Get the list of keys to exclude, defaulting to an empty array if not provided
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

    // If a destination is provided, inject the table HTML into the DOM
    if(destination){
        jQuery("#" + destination + " .content").append(html);
    }

    // Return the full HTML string (useful if needed elsewhere)
    return html;
}





/*function JSONToGraph(jsonArray, title, type, destination, settings) {

    console.log("JSONToGraph Start");
    //let entries = Object.entries(jsonArray);

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

    const backgroundColors = labels.map(label => settings?.colorMap[label] || '#CCCCCC');

    // Create a new canvas and append it to a parent container
    let parent = jQuery("#"+destination+" .canvasContainer")[0] || document.body; // fallback to body
    let canvas = document.createElement('canvas');
    canvas.width = 250;
    canvas.height = 250;
    canvas.style.width = "100px";
    canvas.style.height = "100px";
    parent.appendChild(canvas);


    //https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels
    ChartDataLabels && Chart.register(ChartDataLabels);

    // Create the chart
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
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis:settings.indexAxis || "",
            plugins: {
              title: {
              display: true,             // Show the title
              text: title,
            },
            legend: {
                display: settings.legend
            },
            datalabels: {
              formatter: (value, context) => context.chart.data.labels[context.dataIndex],
              color: '#fff',
              font: {
                weight: 'bold',
                size: 10
              },
              anchor: 'end',
              align: 'start',
              offset: 10
            }
        }
        }
    });
}*/


function numberTile(jsonArray,destination,settings){

  console.log(jsonArray[settings.filter]);

  let value = jsonArray[settings.filter]+"%";
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
      
  /*    //const backgroundColors = labels.map(label => settings?.colorMap[label] || '#CCCCCC');
      const backgroundColors = labels.map(label => {
      // Check if any key in colorMap is contained in the label
      for (const [key, color] of Object.entries(settings?.colorMap || {})) {
          if (label.toLowerCase().includes(key.toLowerCase())) {
              return color;
          }
      }
      return '#CCCCCC'; // default color
  });*/

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
          display: false, // completely hides the x-axis (ticks, grid, and line)
          grid: {
            display: false, // hides grid lines
            drawBorder: false
          },
          ticks: {
            display: false // hides axis values (numbers/labels)
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
        let background = settings?.background || "";

        if(settings?.wrap==false){
          classToAdd="noWrap";
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
       
        
        
        var Container = jQuery('<div style="background:'+settings?.background+'" class="container '+classToAdd+' '+type+'" id="Container'+id+'">'+headerHTML+'<div class="content"></div></div>');
        //var Container = jQuery('<div class="container '+type+'" id="Container'+id+'"><h3><img height="40" src="'+imageURL+'"/>'+title+'</h3></div>');
        jQuery('#table-container').append(Container);

       /* if (getData && typeof getData === "function") {
        getData();
    }*/
}



/*function graph (category){

  var graphData = {};

  for(let sku in skuList){
    var current = skuList[sku];
    var categoryValue = skuList[sku][category];

     var facings = Number(current.facings) || 0;

     if (!graphData[categoryValue]) {
      graphData[categoryValue] = 0;
    }


    graphData[categoryValue] += facings;

  }

  return graphData;

}*/


function graphold(category, asPercentage = false) {

  console.log("asPercentage: ",asPercentage);

  const graphData = {};
  let totalFacings = 0;

  for (let sku in skuList) {
    const current = skuList[sku];
    const categoryValue = current[category];
    const facings = Number(current.facings) || 0;

    if (!graphData[categoryValue]) {
      graphData[categoryValue] = 0;
    }

    graphData[categoryValue] += facings;
    totalFacings += facings;
  }

  if (asPercentage && totalFacings > 0) {
    for (let key in graphData) {
      graphData[key] = +(graphData[key] / totalFacings * 100).toFixed(2);
    }
  }

  console.log("graphData: ",graphData);

  return graphData;
}


function graph(category, asPercentage = false, filter = null) {
  console.log("asPercentage: ", asPercentage);
  console.log("filter: ", filter);
  
  const graphData = {};
  let totalFacings = 0;
  
  for (let sku in skuList) {
    const current = skuList[sku];
    
    // Apply filter if provided
    if (filter && current[filter.property] !== filter.value) {
      continue; // Skip this SKU if it doesn't match the filter
    }
    
    const categoryValue = current[category];
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
  
  console.log("graphData: ", graphData);
  return graphData;
}


    var showSections = function(destination){

      jQuery('#'+destination+" .content").addClass("buttons");

      for(let filter in sections){
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
          actual   = 0
        } = {},
        meter: {
          value = 0,
          full   = 0
        } = {},
        barcode = ""
      }){

      let htmlContent = "";

      let low = 0;
      let high = 0;
      if (full) {
        low  = full * 0.2;
        high = full * 0.8;
      }

    let titleHTML = title ? "<h1>"+title+"</h1>" : ""; 
    let subtitleHTML = subtitle ? "<h2>"+subtitle+"</h2>" : ""; 
    let descHTML = description ? "<p class='description'>"+description+"</p>" : ""; 
    let coloredHTML = number ? "<div class='colored'>"+number+"</div>" : ""; 
    let barcodeHTML = barcode ? "<img class='barcode' id='barcode"+barcode+"' src='' />" : "";
    let packshot = barcode ? "<div class='packshot pshot"+barcode+"''></div>" : "";

    let titleGroupHTML = "<div class='titleGroupHTML'>"+titleHTML+barcodeHTML+descHTML+coloredHTML+"</div>";

    let headerHTML = "<div class='header'>"+packshot+titleGroupHTML+"</div>"  
    

    let meterHTML="";
    let expectationHTML="";
    let expectedHTML = "";

    let resultContainerHTML = "";
 

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
   
    resultContainerHTML = "<div class='resultContainer'><h4>"+resultLabel+"</h4>"+meterHTML+expectationHTML+expectedHTML+"</div>" 
   

    let tableHTML = "<table>";

    

    if(table){
      for(let i in table){
          let item = table[i];
          tableHTML=tableHTML+"<tr><th>"+item+"</th><td>"+object[table[i]]+"</td></tr>";
          htmlContent=htmlContent+tableHTML;
      }

    }
    

    tableHTML = tableHTML+"</table>";


    htmlContent = headerHTML+resultContainerHTML;
  
    const HTMLOutput = "<div class='SKULabel' id='fc"+barcode+"'>"+htmlContent+"</div>";

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
};



let createMap = function(z,address){


const link1 = document.createElement("link");
  link1.rel = "stylesheet";
  link1.href = "https://unpkg.com/leaflet/dist/leaflet.css";
  document.head.appendChild(link1);



//https://unpkg.com/leaflet/dist/leaflet.js
  //<div id="map" style="height: 400px;"></div>
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  console.log("creating map...");


  fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.length > 0) {
      const lat = data[0].lat;
      const lon = data[0].lon;
      console.log("Coordinates:", lat, lon);

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



const placeSection = function(placeID,options,destination){

  getPlaceData(placeID).then((placeData)=>{

  let tableElement = createTable(placeData, {
        "Name":placeData.name,
        "City":placeData.city,
        "Address":placeData.address,
      });
      jQuery('#'+destination+" .content").append(tableElement);

      if(options.map==true){

          jQuery('#'+destination+" .content").append('<div id="map" style="height: 250px;width:50%;"></div>');
          createMap(10,placeData.address+" "+placeData.postal_code+" "+placeData.city);
      }

    })
}




const MissionResponseSection = function(missionData,destination){




        let tableElement = createTable(missionData, {
          "Completed":missionData.completed_at+" ("+moment(missionData.completed_at).fromNow()+")",
          "Completed By":missionData.user.first_name+" "+missionData.user.last_name,
          "Distance to place": `${parseFloat(missionData?.distance_to_place).toFixed(2) || "0.00"} miles`,
           "ID":missionData.id,
        });
        jQuery('#'+destination+" .content").append(tableElement);
}
