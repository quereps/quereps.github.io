
const complianceModule = (function($, ksAPI){

  let skuList = {};

const tileTemplates = {
  presence: (currentSKU, skuList, skuArray, expFacings) => ({
    data: {
      title: skuList[currentSKU].name,
      subtitle: skuList[currentSKU].brand,
    },
    resultLabel: "Availability",
    meter: {
      value: skuList[currentSKU].facings,
      full: expFacings,
    },
    barcode: skuList[currentSKU],
  }),

  oos: (sku, name, skuArray, expFacings) => ({
    data: {
      title: name[sku],
      // number: skuArray[sku],
    },
    resultLabel: "Expected Facings",
    result: {
      expected: expFacings,
    },
    barcode: skuArray[sku],
  }),
};


  function init(settings){

    skuList = APIModule.skuList;

    let upcDetectedQRef = settings.upcDetectedQRef;
    let sections = settings.sections;

    vpSetResults(upcDetectedQRef,arrayToPipe(Object.keys(skuList)));

    for(let complianceReport in sections){

        currentComplianceReport = sections[complianceReport];

        let mol=currentComplianceReport.mol;

      setTimeout(()=>{
              selectAllMOL(mol).then((a)=>{


              const skuArray = vpGetTextResults(mol+".A"+currentComplianceReport.skuColumn).split(',').map(s => s.trim());
              const exp = vpGetTextResults(mol+".A2").split(',').map(s => s.trim());
              //complianceCheck();

              console.log("skuArray: ",skuArray);


              for(let currentSKU of skuArray){
                const expFacings = exp[skuArray.indexOf(currentSKU)];
                const myTile = interfaceModule.htmlTile(
                  currentComplianceReport.tileTemplate.presence(currentSKU, skuList, skuArray, expFacings)
                );

                jQuery("#mustHaveAvailability").append(myTile);
                interfaceModule.barcodeGenerate(currentSKU);

              }
                

            });

          }, 1000);

}
  }



 return {
    Run: function (settings) {
      init(settings);
    },
    tileTemplates,
  }

})(jQuery, ksAPI);
