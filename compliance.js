
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
      title: skuList[currentSKU].name+" "+skuList[currentSKU].size,
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



  const complianceReportCreation = async function(report, containerNum){

    let mol=report.mol;

    let dmData = {};

    console.log("containerNum: ",containerNum);

      setTimeout(()=>{
              selectAllMOL(mol).then((a)=>{


              for(let data of report.dmData){
                dmData[data.name] = vpGetTextResults(mol+".A"+data.col).split(',').map(s => s.trim());
              }

              console.log("dmData: "+dmData);

              const skuArray = vpGetTextResults(mol+".A"+report.skuColumn).split(',').map(s => s.trim());
              const exp = vpGetTextResults(mol+".A4").split(',').map(s => s.trim());
              const name = vpGetTextResults(mol+".A3").split(',').map(s => s.trim());
              //complianceCheck();

              console.log("skuArray: ",skuArray);


              for(let currentSKU of skuArray){
                const expFacings = exp[skuArray.indexOf(currentSKU)];
                console.log("currentSKU: ",currentSKU);
                SKUindex = skuArray.indexOf(currentSKU);

                const myTile = interfaceModule.htmlTile(
                  report.displayTemplate(SKUindex,currentSKU, skuList, skuArray, expFacings)
                );


                jQuery("#"+report.options.destination+" #Container"+containerNum).append(myTile);
                interfaceModule.barcodeGenerate(currentSKU);
                

              }
                

            });

          }, 2500);

  }


  function init(settings){

      const link2 = document.createElement("link");
  link2.rel = "stylesheet";
  link2.href = "https://quereps.github.io/pkshot.css";
  document.head.appendChild(link2);

    skuList = APIModule.skuList;

    let upcDetectedQRef = APIModule.getSettings().config.upcDetectedQRef;
    //let sections = settings.sections;

    vpSetResults(upcDetectedQRef,arrayToPipe(Object.keys(skuList)));

    //for(let complianceReport in sections){

     // currentComplianceReport = sections[complianceReport];
     // interfaceModule.createHTMLSection("comp_"+complianceReport,currentComplianceReport?.title,currentComplianceReport?.logo,currentComplianceReport?.type,currentComplianceReport?.options);


      //complianceModule.complianceReportCreation(currentComplianceReport, complianceReport);


        

//}
  }






 return {
    Run: function (settings) {
      init(settings);
    },
    complianceReportCreation: function (currentComplianceReport, complianceReport) {
      complianceReportCreation(currentComplianceReport, complianceReport);
    },
    displayTemplates,
  }

})(jQuery, ksAPI);
