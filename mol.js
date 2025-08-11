
function commaToPipe(ref){
  const text = vpGetTextResults(ref) || '';
  vpSetResults(ref, text.replace(/,/g, '|'));
}


/*
function selectAllMOL(dm){

  //console.log("I am in selectAllMOL");

  return new Promise((resolve, reject) => {
        vpResetResults(dm);
        const $labels = jQuery(`.aDivQId_${dm} .lookupCheckbox label`);






        $labels.each((i, el) => jQuery(el).click());


    // Now poll every 200ms up to 10 times (so up to ~2 seconds) to see if vpResetResults(dm).length > 0
    let attempts = 0;
    let prev = 0;

    const intervalId = setInterval(() => {
      attempts++;
      const results = vpGetResults(dm);
      const newLength = vpGetResults(dm).length;

      if (results && results.length > 0 && newLength==prev) {
        clearInterval(intervalId);
        setTimeout(()=>{resolve("It worked!");}, 1000);
        
      } else if (attempts >= 10) {
        clearInterval(intervalId);
        reject("Something went wrong (no results after clicking).");
      }
      prev=newLength;
      console.log("prev: ",prev);
    }, 200);


  });
}
*/


function selectAllMOL(dm) {
  return new Promise((resolve, reject) => {
    vpResetResults(dm);

    let labelAttempts = 0;
    const labelInterval = setInterval(() => {
      const $labels = jQuery(`.aDivQId_${dm} .lookupCheckbox label`);

      if ($labels.length > 0) {
        clearInterval(labelInterval);

        // Click each label
        $labels.each((i, el) => jQuery(el).click());

        // Now poll every 200ms up to 10 times to see if vpResetResults(dm) has results
        let attempts = 0;
        let prev = 0;

        const intervalId = setInterval(() => {
          attempts++;
          const results = vpGetResults(dm);
          const newLength = results.length;

          if (results && results.length > 0 && newLength === prev) {
            clearInterval(intervalId);
            setTimeout(() => resolve("It worked!"), 1000);
          } else if (attempts >= 10) {
            clearInterval(intervalId);
            reject("Something went wrong (no results after clicking).");
          }
          prev = newLength;
          console.log("prev:", prev);
        }, 200);
      } else if (++labelAttempts >= 20) { // ~4 seconds max wait for labels
        clearInterval(labelInterval);
        reject("Labels not found within timeout.");
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




/*var molToSKUList = function(mol,mapping){
  console.log(mol,mapping);

    let data = {};

  for (const [field, column] of Object.entries(mapping)) {
    console.log(`Field: ${field} | Column: ${column}`);
    data[field] = vpGetTextResults(mol + ".A" + column);
  }

  console.log("data",data);

  let IRData = {};
  

  let upcTarget = IRData.upc;
  IRModule.createOrAddSKU("SKU",upcTarget,IRData);

}*/

var molToSKUList = function(mol, mapping){
  // 1) Read raw strings for each field
  const data = {};
  for (const [field, column] of Object.entries(mapping)) {
    const txt = vpGetTextResults(`${mol}.A${column}`) ?? "";
    data[field] = String(txt);
  }

  console.log("data",data);

  // 2) Helper: split on commas and trim
  const splitVals = (s) => s
    .split(",")
    .map(x => x.trim())
    .filter(x => x.length > 0);

  // 3) Convert each field string -> array
  const arrays = {};
  for (const [field, str] of Object.entries(data)) {
    arrays[field] = splitVals(str);
  }

  // 4) Sanity check lengths (use UPC count as the driver)
  const upcs = arrays.upc || [];
  if (!upcs.length) {
    console.warn("No UPCs found in data.upc");
    return;
  }
  const expected = upcs.length;
  for (const [field, arr] of Object.entries(arrays)) {
    if (arr.length !== expected) {
      console.warn(`Field "${field}" has ${arr.length} values; expected ${expected}`);
    }
  }

  // 5) Build one IR object per UPC and send to IRModule
  const IRDataByUpc = {};           // optional: keep a keyed map if you want it
  for (let i = 0; i < expected; i++) {
    const obj = {};
    for (const field of Object.keys(arrays)) {
      obj[field] = arrays[field][i] ?? null;  // null if a field was short
    }
    const upc = String(obj.upc);             // keep as string to preserve leading zeros
    IRDataByUpc[upc] = obj;

    IRModule.createOrAddSKU("SKU", upc, obj,{addFacing:false});
  }

  // Return whatever is convenient for debugging/inspection
  return IRDataByUpc;
};


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
    vpHIdeLoader();
    jQuery(".HBUTTONS").show();
  } , 1500); 
}