carrefourSpecial = function(skuList,settings){

  console.log("Carrefour Special Start");



  const deepLinkSettings = {
    companyID: settings.companyID,
    placeID: settings.placeID,
    MissionID:"4269552",
    callBack:"https://app.form.com/f/41790533/1676/?LQID=1&PlaceID="+settings.placeID
  };

//gospotcheck://companies/5420/missions/4269551/places/56276410/mission_responses/?start=true&customer_data=%7B%22typeImport%22%3A%22test%22%2C%22UPCImport%22%3A%221234567890%22%7D&completion_trigger=%7B%22action_type%22%3A%22url_redirect%22%2C%22value%22%3A%22https%3A%2F%2Fapp.form.com%2Ff%2F41790533%2F1676%2F%3FLQID%3D1%26PlaceID%3D56276410%22%2C%22mx_options%22%3A%5B%22status%22%2C%22mx_user_id%22%5D%7D


  const link2 = document.createElement("link");
  link2.rel = "stylesheet";
  link2.href = "https://quereps.github.io/pkshot.css";
  document.head.appendChild(link2);


  vpSetResults("upcDetected",arrayToPipe(Object.keys(skuList)));

  vpSetResults("mainBrandDetected",mostSeenBrandFamily(skuList));


  setTimeout(()=>{
              selectAllMOL("mol").then((a)=>{


              const skuArray = vpGetTextResults("mol.A3").split(',').map(s => s.trim());
              const exp = vpGetTextResults("mol.A5").split(',').map(s => s.trim());
              //complianceCheck();

              interfaceModule.createHTMLSection("availability","Availability", "https://app.form.com/fs/v1/h/o2Hec5ANCkdseEnpn-lMSfjWJg5I4VTFnGY4yVyEDR4/277586.png",null, {
                wrap:true,
                destination:"compliance",
                gap:true,
                width:"100%",
              });

              
              

              for(let sku in skuArray){
                const currentSKU = skuArray[sku];
                const expFacings = exp[sku];

                let deepLinkparams = [
                  {name:"typeImport",val:"test"},
                  {name:"UPCImport",val:skuArray[sku]}
                ];

                const myTile = interfaceModule.htmlTile({
                  data:{
                    title:skuList[currentSKU].name,
                    subtitle:skuList[currentSKU].brand,
                  },
                  //resultLabel:"Availability",
                  meter: {
                    value:skuList[currentSKU].facings,
                    full:expFacings,
                  },
                  barcode:skuArray[sku],
                  action: {
                    target:deeplinkModule.Run(deepLinkSettings,deepLinkparams),
                    icon:"https://app.form.com/fs/v1/h/PCwNudvw8L-hmK9oC33Zf0gy91O2iB7hwhtfMcJzOLQ/278054.png",
                  }
                });

                jQuery("#Containeravailability .content").append(myTile);
                interfaceModule.barcodeGenerate(skuArray[sku]);

              }
                

            });
            selectAllMOL("mol2").then((a)=>{

              const skuArray = vpGetTextResults("mol2.A3").split(',').map(s => s.trim());
              const exp = vpGetTextResults("mol2.A5").split(',').map(s => s.trim());
              const name = vpGetTextResults("mol2.A7").split(',').map(s => s.trim());


              interfaceModule.createHTMLSection("outOfStocksContainer","Out of Stocks", "https://app.form.com/fs/v1/h/bFLXhbgnom1ZggCaWvkZ9bQl32YRRzNtKf40YEA3cvA/277593.png",null, {
                wrap:true,
                destination:"compliance",
                gap:true,
                width:"100%",
              });
              //oosMOLExtract();
              for(let sku in skuArray){

                const myTile = interfaceModule.htmlTile({
                  data:{
                    title:name[sku],
                    //number:skuArray[sku],
                  },
                  resultLabel:"Expected Facings",
                  result:{
                    expected:exp[sku],
                  },
                  barcode:skuArray[sku],
                });



                jQuery("#ContaineroutOfStocksContainer .content").append(myTile);

                interfaceModule.barcodeGenerate(skuArray[sku]);

              }


            });

          }, 2000);
}