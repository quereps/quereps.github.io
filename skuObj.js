class skuObj {
  constructor({type = "";upc = "", IRData = ""}){

    console.log("Constructor",IRData);

    this.heightArray = [];
    this.widthArray = [];
    this.shelf_index_xArray = [];
    this.shelf_index_yArray = [];
    this.stack_indexArray = [];

    if(IRData){
      this.facings=0;
      this.name = IRData.name;
      this.upc = IRData.upc;
      this.guid = IRData.guid;
      
      this.classification = IRData.classification;
      this.subclassification = IRData.subclassification;

      this.size = IRData.size;
      
      this.supplier = IRData.supplier;
      this.brand_family = IRData.brand_family;
      this.brand = IRData.brand;
    }

    return this;
    
  }

  addFacing(IRData){
    if(IRData){
      this.facings++;
      this.shelf_index_xArray.push(IRData.shelf_index_x);
      this.shelf_index_yArray.push(IRData.shelf_index_y);
      this.stack_indexArray.push(IRData.stack_index);
      if (IRData.height) this.heightArray.push(IRData.height);
      if (IRData.width) this.widthArray.push(IRData.width);

      this.updateAverages();
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