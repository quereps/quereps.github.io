








cokeSpecial = function(){
  setTimeout(()=>{
              selectAllMOL("mol").then((a)=>{


              const skuArray = vpGetTextResults("mol.A1").split(',').map(s => s.trim());
              const exp = vpGetTextResults("mol.A2").split(',').map(s => s.trim());
              //complianceCheck();

              for(let sku in skuArray){
                const currentSKU = skuArray[sku];
                const expFacings = exp[sku];

                const myTile = htmlTile({
                  data:{
                    title:skuList[currentSKU].name,
                    subtitle:skuList[currentSKU].brand,
                    description:"",
                    
                    //number:skuList[currentSKU].facings,
                  },
                  resultLabel:"Availability",
                  meter: {
                    value:skuList[currentSKU].facings,
                    full:expFacings,
                  }
                });

                jQuery("#mustHaveAvailability").append(myTile);

              }
                

            });
            selectAllMOL("mol2").then((a)=>{

              const skuArray = vpGetTextResults("mol2.A1").split(',').map(s => s.trim());
              const exp = vpGetTextResults("mol.A2").split(',').map(s => s.trim());
              const name = vpGetTextResults("mol.A3").split(',').map(s => s.trim());
              //oosMOLExtract();
              for(let sku in skuArray){
                const currentSKU = skuArray[sku];

                const myTile = htmlTile({
                  data:{
                    title:currentSKU,
                    subtitle:name[sku],
                    number:exp[sku],
                  },
                  resultLabel:"Expected Facings",
                });

                jQuery("#outOfStocks").append(myTile);

              }


            });

          }, 1000);
}