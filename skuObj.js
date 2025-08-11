class skuObj {
  constructor({type = "",upc = "", IRData = ""/*, complianceData = ""*/}){

    console.log("Constructor",IRData);


    this.type = type;
    this.heightArray = [];
    this.widthArray = [];
    this.prices = [];
    this.shelf_index_xArray = [];
    this.shelf_index_yArray = [];
    this.stack_indexArray = [];
    this.presence = false;
    this.availabilityStatus = "";
    this.upc = upc;
    this.facings=null;

    if(IRData && IRData!= null){
      
      

      this.updateData(IRData);

    }


/*    if(complianceData){
      this.availabilityStatus = complianceData.availabilityStatus || "";
    }*/

    return this;
  }
 
  addFacing(IRData){
      this.presence = true;
      this.facings ? this.facings++ : this.facings=1;

    if(IRData){      
      this.shelf_index_xArray.push(IRData.shelf_index_x);
      this.shelf_index_yArray.push(IRData.shelf_index_y);
      this.stack_indexArray.push(IRData.stack_index);
      if (IRData.height) this.heightArray.push(IRData.height);
      if (IRData.width) this.widthArray.push(IRData.width);

      this.updateAverages();

      this.updateData(IRData);
    }
  }


  updateData(IRData){
      this.name = IRData?.name || this.type || "";
      //this.upc = IRData.upc || this.type || "";
      this.guid = IRData?.guid || this.type || "";
      
      this.classification = IRData?.classification || this.type || "";
      this.subclassification = IRData?.subclassification || this.type || "";

      this.size = IRData?.size || this.type || "";
      
      this.supplier = IRData?.supplier || this.type || "";
      this.brand_family = IRData?.brand_family || this.type || "";
      this.brand = IRData?.brand || this.type || "";
  }

    updateStatus(status,overwrite){
      if(!this.availabilityStatus || overwrite==1){
        this.availabilityStatus = status;
      }
      if(!this.expected){
          this.availabilityStatus = "VOID";
      }
    }


    checkAvailability(){
      if(this.facings>0){
          this.availabilityStatus = "In Stock";
      }

      else if(this.facings==0 && this.expected==true){
        this.availabilityStatus = "Out of Stock";
      }

      else if(this.facings==0 && !this.expected){
        this.availabilityStatus = "VOID";
      }
    }


  checkFacingsCompliance(exp){
    console.log("facings:", this.facings, typeof this.facings);
    console.log("exp:", exp, typeof exp);

    this.expFacings = Number(exp);
    if(this.facings >= exp){
      this.facingCompliance = true;
    }
    else{
      this.facingCompliance =  false;
    }
  }

    checkPricingCompliance(exp){
      this.expPricing = exp;
      if(this.prices.length==0){
        this.pricingCompliance = null;
        return null;
      }
      else if(this.prices[0] == exp){
        this.pricingCompliance = true;
        return true;
      }
      else{
        this.pricingCompliance =  false;
        return false;
      }
    }

  updateAverages(){
    this.shelf_index_x = getAverage(this.shelf_index_xArray);
    this.shelf_index_y = getAverage(this.shelf_index_yArray);
    this.stack_index = getAverage(this.stack_indexArray);
    this.height = getAverage(this.heightArray);
    this.width = getAverage(this.widthArray);
  }

  getIRData(data){
      console.log("getIRData: ",data);
      this.IRData = data;
  }
}
















