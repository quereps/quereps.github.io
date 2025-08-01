
const complianceModule = (function($, ksAPI){

  let skuList = {};

  let complianceData = {
    results:{},
    getTotal: function () {
      return Object.values(this.results).reduce((sum, val) => sum + val, 0);
    },
    getPercentages: function () {
        const total = this.getTotal();
        const percentages = {};
        for (let key in this.results) {
          percentages[key] = total ? ((this.results[key] / total) * 100).toFixed(1) + "%" : "0%";
        }
        return percentages;
      }
    };
  


const displayTemplates = {
  presence: (SKUindex,currentSKU, skuList, skuArray, dmData) => ({
    data: {
      title: skuList[currentSKU].name,
      subtitle: skuList[currentSKU].brand,
    },
    resultLabel: "Availability",
    meter: {
      value: skuList[currentSKU].facings,
      full: dmData[exp],
    },
    upc: skuList[currentSKU].upc,
    barcode:true,
  }),
  presenceSimple: (SKUindex,currentSKU, skuList, skuArray, dmData) => ({
    data: {
      title: skuList[currentSKU].name+" "+skuList[currentSKU].size,
    },
    result:{
      resultLabel: "Availability",
      check:skuList[currentSKU].presence,
      checkIcon:"https://app.form.com/fs/v1/h/1bfwXHoEd90XVh2qaOgP83a-19gdGBMLCCrPVPlGHgE/275043.png",
    },
    packshot:true,
    cssClass:"dirRow noWrap",
    upc: skuList[currentSKU].upc,
    barcode:true,
  }),

  oos: (SKUindex,currentSKU, skuList, skuArray, dmData) => ({
    data: {
      title: dmData.name[SKUindex],
      //number: skuArray[SKUindex],
    },
    result: {
      resultLabel: "Expected Facings",
      expected: dmData.exp[SKUindex],
    },
    upc: skuArray[SKUindex],
    barcode:true,
    packshot:true,
    cssClass:"dirRow noWrap",
  }),
};



  const complianceReportCreation = async function(report, containerNum){

    let destination = "#"+report.options.destination+" #Container"+containerNum+" .content";
    interfaceModule.notification("loading","Calculating Compliance",destination);

    let mol=report.mol;

    let dmData = {};

      setTimeout(()=>{
              selectAllMOL(mol).then((a)=>{

              for(let data of report.dmData){
                dmData[data.name] = vpGetTextResults(mol+".A"+data.col).split(',').map(s => s.trim());
              }

              

              console.log("dmData: ",dmData);

              const skuArray = vpGetTextResults(mol+".A"+report.skuColumn).split(',').map(s => s.trim());


              complianceData.results[report.title] = skuArray.length;

              if(report.score==true){
                console.log("Applying score");
                jQuery("#"+report.options.destination+" #Container"+containerNum+" .score").append(complianceData.getPercentages()[report.title]);
              }


              for(let currentSKU of skuArray){
                SKUindex = skuArray.indexOf(currentSKU);

                const myTile = interfaceModule.htmlTile(
                  report.displayTemplate(SKUindex,currentSKU, skuList, skuArray, dmData)
                );

                interfaceModule.removeNotification(destination);

                jQuery("#"+report.options.destination+" #Container"+containerNum+" .content").append(myTile);
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
    getcomplianceData: function () {
      return complianceData;
    },
    displayTemplates,
    
  }

})(jQuery, ksAPI);
