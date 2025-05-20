

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
