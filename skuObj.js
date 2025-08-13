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


  /*updateData(IRData){
      this.name = !this.name ? IRData?.name || this.type || "";
      //this.upc = IRData.upc || this.type || "";
      this.guid = !this.guid ? IRData?.guid || this.type || "";
      
      this.classification = !this.classification ? IRData?.classification || this.type || "";
      this.subclassification = !this.subclassification ? IRData?.subclassification || this.type || "";

      this.size = !this.size ? IRData?.size || this.type || "";
      
      this.supplier = !this.supplier ? IRData?.supplier || this.type || "";
      this.brand_family = !this.brand_family ? IRData?.brand_family || this.type || "";
      this.brand = !this.brand ? IRData?.brand || this.type || "";
  }*/

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
 
   /* updateStatus(status,overwrite){
      if(!this.availabilityStatus || overwrite==1){
        this.availabilityStatus = status;
      }
      if(!this.expected==true){
          this.availabilityStatus = "VOID";
      }
    }*/

/*
    updateStatus(status, overwrite){
      if (!this.availabilityStatus || overwrite === 1) {
        this.availabilityStatus = status;
      }
      if (this.expected !== true) {
        this.availabilityStatus = "VOID";
      }
    }
*/

    /*checkAvailability(){

      console.log("checkAvailability", this);
      if(this.facings>0 || (this.expected==true && this.presence==true)){
          this.availabilityStatus = "In Stock";
      }

      else if(this.expected==true || (this.facings==0 || this.presence==false)){
        this.availabilityStatus = "Out of Stock";
      }

      else if(!this.expected==true && (this.facings>0 || this.presence==true)){
        this.availabilityStatus = "VOID";
      }
    }
*/

checkAvailability() {
  const hasFacings = Number(this.facings) > 0;
  const present    = this.presence === true;     // seen/report evidence
  const expected   = this.expected === true;     // ranged/listed

  // Expected items
  if (expected) {
    this.availabilityStatus = (present || hasFacings) ? "In Stock" : "Out of Stock";
    return;
  }

  // Not explicitly expected (false OR undefined)
  if (present || hasFacings) {
    // seen but not expected -> unexpected/void on shelf
    this.availabilityStatus = "VOID";
    return;
  }

  // Explicitly not expected and not present
  if (this.expected === false) {
    this.availabilityStatus = "VOID";
    return;
  }

  // No presence and no expectation data yet
  this.availabilityStatus = "Undefined";
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
















