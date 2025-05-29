
function commaToPipe(ref){
  vpSetResults(ref,vpGetTextResults(ref).replace(/,/g, '|'));
}

function selectMOL(dm){
        vpResetResults(dm);
        jQuery(".aDivQId_"+dm+" .lookupCheckbox label").each(function() { jQuery(this).click(); });
      }