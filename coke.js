cokeSpecial = function(){
  setTimeout(()=>{
              selectAllMOL("mol").then((a)=>{
              //complianceCheck();
                htmlTile({
                  data:{
                    title = "Availability",
                    subtitle = "Must have SKUs",
                    description = "",
                    number = "",
                  },
                })
            });
            selectAllMOL("mol2").then((a)=>{
              //oosMOLExtract();
            });

          }, 1000);
}