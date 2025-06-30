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




var createTable = function(data, title, structure) {
  // Create a table element with an optional border.
  var $table = jQuery('<table class="customTable"></table>');

  // If a title is provided, add a caption to the table.
  if (title) {
    $table.append(jQuery('<caption></caption>').text(title));
  }

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

    const excludeList = settings.exclude  || [];

    const filteredArray = jsonArray.filter(obj => {
        const key = Object.keys(obj)[0];
        return !settings.exclude?.includes(key);
    });

    const keys = Array.from(
        filteredArray.reduce((set, obj) => {
            Object.keys(obj).forEach(key => set.add(key));
            return set;
        }, new Set())
    );

    let html = "<table class='customTable'><thead><tr>";
    html += keys.map(key => `<th>${key}</th>`).join("");
    html += "</tr></thead><tbody>";

    filteredArray.forEach(obj => {
        html += "<tr>";
        html += keys.map(key => `<td>${obj[key] !== undefined ? obj[key] : ""}</td>`).join("");
        html += "</tr>";
    });

    html += "</tbody></table>";

    if(destination){
      jQuery("#"+destination).append(html);
    }

    return html;
}



function JSONToGraph(jsonArray, title, type, destination, settings) {

    console.log("JSONToGraph Start");
    //let entries = Object.entries(jsonArray);

    const excluding = settings?.exclude || [];

    let entries = Object.entries(jsonArray).filter(([k, v]) => !excluding?.includes(k));
    entries.sort((a, b) => b[1] - a[1]);
    const labels = entries.map(([k, v]) => k);
    const data = entries.map(([k, v]) => v);

    jQuery("#"+destination).append("<div class='canvasContainer'></div>");

    // Remove any previous canvas with this id (if re-rendering)
    //let oldCanvas = document.getElementById(canvasID);
    //if (oldCanvas) {
    //    oldCanvas.remove();
    //}

    const backgroundColors = labels.map(label => settings?.colorMap[label] || '#CCCCCC');

    // Create a new canvas and append it to a parent container
    let parent = jQuery("#"+destination+" .canvasContainer")[0] || document.body; // fallback to body
    let canvas = document.createElement('canvas');
    canvas.width = 250;
    canvas.height = 250;
    canvas.style.width = "100px";
    canvas.style.height = "100px";
    parent.appendChild(canvas);

    // Destroy previous chart if needed
    //if (window.currentChart) {
   //     window.currentChart.destroy();
   // }


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
            responsive: false,
            maintainAspectRatio: false,
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
}


function createHTMLSection(id,name, imageURL,type, getData){

        console.log("createHTMLSection: ",id,name);

        title = name;
        name = name.replace(/\s+/g, "_"); // Replace spaces with underscores
        var Container = jQuery('<div class="container '+type+'" id="Container'+id+'"><h3><img height="40" src="'+imageURL+'"/>'+title+'</h3></div>');
        jQuery('#table-container').append(Container);
        if (getData && typeof getData === "function") {
        getData();
    }
}



function graph (category){

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

}





    var showSections = function(destination){

      jQuery('#'+destination).addClass("buttons");

      for(let filter in sections){
          var button = jQuery('<div id="filter'+filter+'" class="filter '+filter+'">'+filter+'</div>');
          jQuery('#'+destination).append(button);

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
   
    resultContainerHTML = "<div class='resultContainer'><h4>"+resultLabel+" :</h4>"+meterHTML+expectationHTML+expectedHTML+"</div>" 
   

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

