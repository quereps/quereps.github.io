class skuObj {
  constructor({type = "",upc = "", IRData = ""/*, complianceData = ""*/}){

    //console.log("Constructor",IRData);


    this.type = type;
    this.heightArray = [];
    this.widthArray = [];
    this.prices = [];
    this.shelf_index_xArray = [];
    this.shelf_index_yArray = [];
    this.stack_indexArray = [];
    //this.expected = false;
    //this.presence = false;
    this.availabilityStatus = "Undefined";
    this.upc = upc;
    this.facings=0;

    if(IRData && IRData!= null){
      this.updateData(IRData);
    }

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

  updateData(IRData) {
    const isEmpty = val => val === undefined || val === null || val === "";

    if (isEmpty(this.name)) this.name = IRData?.name || this.type || "";
    if (isEmpty(this.guid)) this.guid = IRData?.guid || this.type || "";
    if (isEmpty(this.classification)) this.classification = IRData?.classification || this.type || "";
    if (isEmpty(this.subclassification)) this.subclassification = IRData?.subclassification || this.type || "";
    if (isEmpty(this.size)) this.size = IRData?.size || this.type || "";
    if (isEmpty(this.supplier)) this.supplier = IRData?.supplier || this.type || "";
    if (isEmpty(this.brand_family)) this.brand_family = IRData?.brand_family || this.type || "";
    if (isEmpty(this.brand)) this.brand = IRData?.brand || this.type || "";
  }
 
 

  checkAvailability() {
  const expected = this.expected === true;
  const present  = this.presence === true;
  const absent   = this.presence === false;
  const scanned  = present || absent; // true if we got any scan

  if (expected) {
    if (present)        { this.availabilityStatus = "In Stock";     return; }
    if (absent)         { this.availabilityStatus = "Out of Stock"; return; }
    /* expected but not scanned at all */
    this.availabilityStatus = "VOID";
    return;
  }

  // Not expected
  if (scanned) {
    this.availabilityStatus = "Unexpected"; // or keep as "In Stock"/"OOS" if you prefer
    return;
  }

  this.availabilityStatus = "Undefined";
}


/*  checkFacingsCompliance(exp){
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
    }*/

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
















