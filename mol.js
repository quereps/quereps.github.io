
function commaToPipe(ref){
  const text = vpGetTextResults(ref) || '';
  vpSetResults(ref, text.replace(/,/g, '|'));
}

function selectAllMOL(dm){

  //console.log("I am in selectAllMOL");

  return new Promise((resolve, reject) => {
        vpResetResults(dm);
        const $labels = jQuery(`.aDivQId_${dm} .lookupCheckbox label`);
        $labels.each((i, el) => jQuery(el).click());


    // Now poll every 200ms up to 10 times (so up to ~2 seconds) to see if vpResetResults(dm).length > 0
    let attempts = 0;
    const intervalId = setInterval(() => {
      attempts++;
      const results = vpGetResults(dm);
      if (results && results.length > 0) {
        clearInterval(intervalId);
        setTimeout(()=>{resolve("It worked!");}, 1000);
        
      } else if (attempts >= 10) {
        clearInterval(intervalId);
        reject("Something went wrong (no results after clicking).");
      }
    }, 200);


  });
}


function selectRandomMOL(dm, qty) {

    return new Promise((resolve, reject) => {
    vpResetResults(dm);

    const items = jQuery(".aDivQId_" + dm + " .lookupCheckbox label").toArray();

    // Shuffle the array
    const shuffled = items.sort(() => 0.5 - Math.random());

    // Limit to qty
    const selected = shuffled.slice(0, qty);

    // Click each selected item
    selected.forEach(el => jQuery(el).click());

         let attempts = 0;
    const intervalId = setInterval(() => {
      attempts++;
      const results = vpGetResults(dm);
      if (results && results.length > 0) {
        clearInterval(intervalId);
        resolve("It worked!");
      } else if (attempts >= 10) {
        clearInterval(intervalId);
        reject("Something went wrong (no results after clicking).");
      }
    }, 200);
  });
}


function getMOLLength(dm){
  return jQuery(".aDivQId_" + dm + " .lookupCheckbox label").length;
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