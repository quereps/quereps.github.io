
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




var molToSKUList = function(mol,mapping){
  console.log(mol,mapping);

    let data = {};

   


  for (const [field, column] of Object.entries(mapping)) {
    console.log(`Field: ${field} | Column: ${column}`);
    data[field] = vpGetTextResults(mol + ".A" + column);
  }


  let IRData = {};

  let upcTarget = IRData.upc;
  IRModule.createOrAddSKU("SKU",upcTarget,IRData);

}


/*function molToSKUList(mol, mapping) {
  // 1) Pull all columns up-front as arrays
  const cols = {};
  for (const [field, column] of Object.entries(mapping)) {
    const arr = vpGetTextResults(`${mol}.A${column}`) || [];
    cols[field] = Array.isArray(arr) ? arr : [arr];
  }

  // 2) Determine how many rows we have (the longest column wins)
  const rows = Math.max(0, ...Object.values(cols).map(a => a.length));

  // 3) Build one IRData per row and push
  for (let i = 0; i < rows; i++) {
    const IRData = {};
    for (const field of Object.keys(cols)) {
      IRData[field] = cols[field][i] ?? null; // tolerate ragged columns
    }

    const upcTarget = IRData.upc; // or String(IRData.upc).trim() if needed
    IRModule.createOrAddSKU("SKU", upcTarget, IRData);
  }
 
  return rows; // how many created
}*/


/*function molToSKUList(mol, mapping) {
  // 1) Fetch each mapped column as an array
  const cols = {};
  for (const [field, column] of Object.entries(mapping)) {
    const out = vpGetTextResults(`${mol}.A${column}`) || [];
    cols[field] = Array.isArray(out) ? out : [out];
  }

  // 2) Decide row count (prefer UPC length if present, else longest column)
  const rowCount = (cols.upc && cols.upc.length)
    ? cols.upc.length
    : Math.max(0, ...Object.values(cols).map(a => a.length));

  // 3) Build one IRData per row
  for (let i = 0; i < rowCount; i++) {
    const IRData = {};

    for (const [field, arr] of Object.entries(cols)) {
      // broadcast singletons; tolerate ragged columns
      IRData[field] = (arr[i] !== undefined) ? arr[i]
                    : (arr.length === 1 ? arr[0] : null);
    }

    // 4) One call per row with a scalar UPC
    const upcTarget = IRData.upc?.toString().trim();
    if (!upcTarget) continue;              // skip empty UPC rows
    IRModule.createOrAddSKU("SKU", upcTarget, IRData);
  }
}*/


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