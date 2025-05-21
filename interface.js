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



function createHTMLSection(name, imageURL,getData){
        name = name.replace(/\s+/g, "_"); // Replace spaces with underscores
        var Container = jQuery('<div id="'+name+'Container"><h3><img height="70" src="'+imageURL+'"/>'+name+'</h3></div>');
        jQuery('#table-container').append(Container);
        if (getData && typeof getData === "function") {
        getData();
    }
}



function graph = function(category, destination){

  var graphData = {};

  for(let sku in skuList){
    var current = skuList[sku];
    var categoryValue = skuList[sku][category];

    graphData[categoryValue] = graphData[categoryValue]+current.facings;

  }

  console.log(graphData);

  //jQuery("#"+destination).append(html);
}







