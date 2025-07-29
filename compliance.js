
const complianceModule = (function($, ksAPI){

  let skuList = {};

  const tileTemplates = {
    presence:{
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
                },
    oos:{
                  data:{
                    title:name[sku],
                    //number:skuArray[sku],
                  },
                  resultLabel:"Expected Facings",
                  result:{
                    expected:exp[sku],
                  },
                  barcode:skuArray[sku],
                },
  }


  function init(settings){

    skuList = APIModule.skuList;

    let upcDetectedQRef = settings.upcDetectedQRef;

    vpSetResults(upcDetectedQRef,arrayToPipe(Object.keys(skuList)));


  }



 return {
    Run: function (settings) {
      init(settings);
    },
  }

})(jQuery, ksAPI);
