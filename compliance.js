
const complianceModule = (function($, ksAPI){

  let skuList = {};

const displayTemplates = {
  presence: (SKUindex,currentSKU, skuList, skuArray, expFacings) => ({
    data: {
      title: skuList[currentSKU].name,
      subtitle: skuList[currentSKU].brand,
    },
    resultLabel: "Availability",
    meter: {
      value: skuList[currentSKU].facings,
      full: expFacings,
    },
    upc: skuList[currentSKU].upc,
    barcode:true,
  }),
  presenceSimple: (SKUindex,currentSKU, skuList, skuArray, expFacings) => ({
    data: {
      title: skuList[currentSKU].name,
      subtitle: skuList[currentSKU].brand,
      number: skuList[currentSKU].upc,
    },
    result:{
      check:skuList[currentSKU].presence,
      checkIcon:"https://app.form.com/fs/v1/h/1bfwXHoEd90XVh2qaOgP83a-19gdGBMLCCrPVPlGHgE/275043.png",
    },
    packshot:true,
    cssClass:"dirRow",
    //resultLabel: "Availability",
    //meter: {
    //  value: skuList[currentSKU].facings,
    //  full: expFacings,
    //},
    upc: skuList[currentSKU].upc,
    barcode:false,
  }),

  oos: (SKUindex,currentSKU, skuList, skuArray, expFacings) => ({
    data: {
      title: name[SKUindex],
      // number: skuArray[sku],
    },
    resultLabel: "Expected Facings",
    result: {
      expected: expFacings,
    },
    upc: skuArray[SKUindex],
    barcode:true,
  }),
};


  function init(settings){

    skuList = APIModule.skuList;

    let upcDetectedQRef = settings.upcDetectedQRef;
    let sections = settings.sections;

    vpSetResults(upcDetectedQRef,arrayToPipe(Object.keys(skuList)));

    for(let complianceReport in sections){

      currentComplianceReport = sections[complianceReport];
      interfaceModule.createHTMLSection(complianceReport,currentComplianceReport?.title,currentComplianceReport?.logo,currentComplianceReport?.type,currentComplianceReport?.options);

        let mol=currentComplianceReport.mol;

      setTimeout(()=>{
              selectAllMOL(mol).then((a)=>{


              const skuArray = vpGetTextResults(mol+".A"+currentComplianceReport.skuColumn).split(',').map(s => s.trim());
              const exp = vpGetTextResults(mol+".A2").split(',').map(s => s.trim());
              const name = vpGetTextResults(mol+".A3").split(',').map(s => s.trim());
              //complianceCheck();

              console.log("skuArray: ",skuArray);


              for(let currentSKU of skuArray){
                const expFacings = exp[skuArray.indexOf(currentSKU)];
                console.log("currentSKU: ",currentSKU);
                SKUindex = skuArray.indexOf(currentSKU);

                const myTile = interfaceModule.htmlTile(
                  currentComplianceReport.displayTemplate(SKUindex,currentSKU, skuList, skuArray, expFacings)
                );


                jQuery("#"+currentComplianceReport.destination).append(myTile);
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
    displayTemplates,
  }

})(jQuery, ksAPI);
