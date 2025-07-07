cokeSpecial = function(){
  setTimeout(()=>{
              selectAllMOL("mol").then((a)=>{


              const skuArray vpGetTextResults("mol.A1").split(',').map(s => s.trim());
              //complianceCheck();
                const myTile = htmlTile({
                  data:{
                    title:"Availability",
                    subtitle:"Must have SKUs",
                    description:"",
                    number:"",
                  },
                });

                jQuery("#mustHaveAvailability").append(myTile);

            });
            selectAllMOL("mol2").then((a)=>{

              const skuArray vpGetTextResults("mol2.A1").split(',').map(s => s.trim());
              //oosMOLExtract();
            });

          }, 1000);
}