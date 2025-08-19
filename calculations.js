
function toTitleCase(input) {
  if (input && input.length>0 && !isAllCaps(input)){
  return input
    .replace(/[_\-]+/g, ' ')                 // Replace underscores/hyphens with space
    .replace(/([a-z])([A-Z])/g, '$1 $2')     // Add space between camelCase
    .toLowerCase()                           // Convert entire string to lowercase
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
  }else{
    return input;
  }
}

function isAllCaps(str) {
  return str === str.toUpperCase() && /[A-Z]/.test(str);
}

let mostSeenBrandFamily = function(skuList){
  const brandCounts = {};
  Object.values(skuList).forEach(item => {
    const brand = item.brand_family;
    if (brandCounts[brand]) {
      brandCounts[brand]++;
    } else {
      brandCounts[brand] = 1;
    }
  });

  let mostCommonBrand = null;
  let maxCount = 0;
  for (const brand in brandCounts) {
    if (brandCounts[brand] > maxCount) {
      mostCommonBrand = brand;
      maxCount = brandCounts[brand];
    }
  }
  return mostCommonBrand;
}


let arrayToPipe = function(arr){
  return arr.join('|');
}


let getTimeStamps = function(minBack) {
  let timeframeMinutes = minBack;

  // Get the current time as a Date object
  let now = new Date();
  
  // Convert the current time to a timestamp in milliseconds (UTC)
  let nowTimestampMs = now.getTime();
  
  // Calculate the past timestamp by subtracting the specified minutes (in ms)
  let pastTimestampMs = nowTimestampMs - timeframeMinutes * 60 * 1000;
  
  // EST is UTC-5: subtract 5 hours in milliseconds (this ignores DST)
  const EST_OFFSET_MS = 5 * 60 * 60 * 1000;
  
  // Convert to EST by subtracting the offset, then convert milliseconds to seconds
  //let nowTimestampSeconds = Math.floor((nowTimestampMs - EST_OFFSET_MS) / 1000);
  //let pastTimestampSeconds = Math.floor((pastTimestampMs - EST_OFFSET_MS) / 1000);

  let nowTimestampSeconds = Math.floor(nowTimestampMs / 1000);
  let pastTimestampSeconds = Math.floor(pastTimestampMs / 1000);
  
  return {
    back: pastTimestampSeconds,
    now: nowTimestampSeconds
  };
}


function getAverage(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return sum / arr.length;
}


function rankObjects(obj, rankBy, attributes) {
  const items = Object.values(obj);

  items.sort((a, b) => b[rankBy] - a[rankBy]);

  const result = items.map(item => {
    return attributes.reduce((acc, attr) => {
      acc[attr] = item[attr];
      return acc;
    }, {});
  });

  console.log(result);
  return result;
}