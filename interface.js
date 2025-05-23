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


function createHTMLSection(id,name, imageURL,getData){

        console.log("createHTMLSection: ",id,name);

        title = name;
        name = name.replace(/\s+/g, "_"); // Replace spaces with underscores
        var Container = jQuery('<div id="Container'+id+'"><h3><img height="40" src="'+imageURL+'"/>'+title+'</h3></div>');
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
  
  html=category;

  jQuery('#'+destination).append(html);
}
