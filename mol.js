
function commaToPipe(ref){
  vpSetResults(ref,vpGetTextResults(ref).replace(/,/g, '|'));
}

function selectAllMOL(dm){
        vpResetResults(dm);
        jQuery(".aDivQId_"+dm+" .lookupCheckbox label").each(function() { jQuery(this).click(); });
}


function selectRandomMOL(dm, qty) {
    vpResetResults(dm);

    let items = jQuery(".aDivQId_" + dm + " .lookupCheckbox label").toArray();

    // Shuffle the array
    let shuffled = items.sort(() => 0.5 - Math.random());

    // Limit to qty
    let selected = shuffled.slice(0, qty);

    // Click each selected item
    selected.forEach(el => jQuery(el).click());
}





var molToMatrix = function(mapping){

  setTimeout(()=>{

    for(let config in mapping){

      vpShowLoader();

      let item = mapping[config];

      let itemData = vpGetResults(item.from);

      for(let value in itemData){

        let valueData = itemData[value][0].value;

        console.log(value);
        vpSetResults(item.to+".A"+(Number(value)+1),valueData);
      }

    }
    vpHideLoader();
    jQuery(".HBUTTONS").show();
  } , 1500); 
}