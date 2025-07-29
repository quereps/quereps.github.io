
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
    barcode: skuArray[currentSKU],
  }),

  oos: (sku, name, skuArray, exp) => ({
    data: {
      title: name[sku],
      // number: skuArray[sku],
    },
    resultLabel: "Expected Facings",
    result: {
      expected: exp[sku],
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
              const exp = vpGetTextResults("onShelf.A2").split(',').map(s => s.trim());
              //complianceCheck();

              for(let sku in skuArray){
                const currentSKU = skuArray[sku];
                const expFacings = exp[sku];

                const myTile = interfaceModule.htmlTile({
                  data:{
                    title:skuList[currentSKU].name,
                    subtitle:skuList[currentSKU].brand,
                  },
                  resultLabel:"Availability",
                  meter: {
                    value:skuList[currentSKU].facings,
                    full:expFacings,
                  },
                  barcode:skuArray[sku],
                });

                jQuery("#mustHaveAvailability").append(myTile);
                barcodeGenerate(skuArray[sku]);

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
