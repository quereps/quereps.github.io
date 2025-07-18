carrefour = function(skuList){

  console.log("Carrefour Special Start");


  const link2 = document.createElement("link");
  link2.rel = "stylesheet";
  link2.href = "https://quereps.github.io/pkshot.css";
  document.head.appendChild(link2);


  vpSetResults("upcDetected",arrayToPipe(Object.keys(skuList)));

  vpSetResults("mainBrandDetected",mostSeenBrandFamily(skuList));


  setTimeout(()=>{
              selectAllMOL("mol").then((a)=>{


              const skuArray = vpGetTextResults("mol.A1").split(',').map(s => s.trim());
              const exp = vpGetTextResults("mol.A2").split(',').map(s => s.trim());
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
                });

                jQuery("#Containeravailability .content").append(myTile);
                interfaceModule.barcodeGenerate(skuArray[sku]);

              }
                

            });
            selectAllMOL("mol2").then((a)=>{

              const skuArray = vpGetTextResults("mol2.A1").split(',').map(s => s.trim());
              const exp = vpGetTextResults("mol2.A2").split(',').map(s => s.trim());
              const name = vpGetTextResults("mol2.A3").split(',').map(s => s.trim());


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