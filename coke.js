








cokeSpecial = function(){
  setTimeout(()=>{
              selectAllMOL("mol").then((a)=>{


              const skuArray vpGetTextResults("mol.A1").split(',').map(s => s.trim());
              //complianceCheck();

              for(let sku in skuArray){
                const currentSKU = skuArray[sku];

                const myTile = htmlTile({
                  data:{
                    title:skuList[currentSKU].name,
                    subtitle:skuList[currentSKU].brand,
                    description:"",
                    number:skuList[currentSKU].facings,
                  },
                });

                jQuery("#mustHaveAvailability").append(myTile);

              }
                

            });
            selectAllMOL("mol2").then((a)=>{

              const skuArray vpGetTextResults("mol2.A1").split(',').map(s => s.trim());
              //oosMOLExtract();
            });

          }, 1000);
}