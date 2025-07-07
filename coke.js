cokeSpecial = function(){
  setTimeout(()=>{
              selectAllMOL("mol").then((a)=>{
              //complianceCheck();
                const myTile = htmlTile({
                  data:{
                    title = "Availability",
                    subtitle = "Must have SKUs",
                    description = "",
                    number = "",
                  },
                });

                jQuery("#mustHaveAvailability").append(myTile);

            });
            selectAllMOL("mol2").then((a)=>{
              //oosMOLExtract();
            });

          }, 1000);
}