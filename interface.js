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
  var $table = jQuery('<table border="1"></table>');

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




function JSONToHTMLTable(jsonArray, destination) {
    const keys = Array.from(
        jsonArray.reduce((set, obj) => {
            Object.keys(obj).forEach(key => set.add(key));
            return set;
        }, new Set())
    );

    let html = "<table><thead><tr>";
    html += keys.map(key => `<th>${key}</th>`).join("");
    html += "</tr></thead><tbody>";

    jsonArray.forEach(obj => {
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



function JSONToGraph(jsonArray, title, type, destination) {

    console.log("JSONToGraph Start");
    let entries = Object.entries(jsonArray);
    entries.sort((a, b) => b[1] - a[1]);
    const labels = entries.map(([k, v]) => k);
    const data = entries.map(([k, v]) => v);

    jQuery("#"+destination).append("<div class='canvasContainer'></div>");

    // Remove any previous canvas with this id (if re-rendering)
    //let oldCanvas = document.getElementById(canvasID);
    //if (oldCanvas) {
    //    oldCanvas.remove();
    //}

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

    // Create the chart
    window.currentChart = new Chart(canvas, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: "Count",
                data: data,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
              display: true,             // Show the title
              text: title,
            },
            legend: {
                display: false
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




   function htmlTile(title,subtitle,colored,description,result,target,dataTable,barcode){
    let HTMLOutput = "";

    let titleHTML = title ? "<h1>"+title+"</h1>" : ""; 
    let subtitleHTML = subtitle ? "<h2>"+subtitle+"</h2>" : ""; 
    let coloredHTML = colored ? "<div class='colored'>"+colored+"</div>" : ""; 
    let descHTML = description ? "<p class='description'>"+description+"</p>" : ""; 
    let numberHTML = result ? "<div class='result'>"+result+"</div>" : ""; 
    let targetHTML = target ? "<div class='target'>"+target+"</div>" : ""; 
    let low = target/100*20;
    let high = target/100*80;
    let barcodeHTML = barcode ? "<img class='barcode' id='barcode"+barcode+"' scr='' />" : "";

    let gaugeHTML = result && target ? "<meter value="+result+" min='0' max="+target+" low="+low+" high="+high+" optimum="+target+"></meter>" : ""; 
    let resultHTML = "<div class='resultContainer'>"+numberHTML+gaugeHTML+targetHTML+"</div>"
    let tableHTML = "<table>"

    if(dataTable){
        //for(let i in dataTable){
       //   let item = dataTable[i];
      //    tableHTML=tableHTML+"<tr><th>"+item+"</th><td>"+this[dataTable[i]]+"</td></tr>";
      //}

    }
    

    tableHTML = tableHTML+"</table>";

    HTMLOutput = "<div id='fc"+barcode+"'>"+titleHTML+subtitleHTML+coloredHTML+descHTML+barcodeHTML+resultHTML+tableHTML+"</div>";

    console.log(HTMLOutput);
    return HTMLOutput;
  }



function addCheckbox(elm){
  jQuery('#'+elm).append('<label onclick="console.log(''test'')">Restocked</label>');
}
