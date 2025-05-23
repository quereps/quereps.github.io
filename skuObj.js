class skuObj {
  constructor({upc = "", IRData = ""}){

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
      this.heightArray.push(IRData.height);
      this.widthArray.push(IRData.width);

      this.updateAverages();
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

barcode() {
  let format;
  if (this.upc.length === 8) {
    format = "EAN8";
  } else if (this.upc.length === 13) {
    format = "EAN13";
  } else {
    console.warn(`UPC length ${this.upc.length} isn’t EAN8/13—using Code128`);
    format = "CODE128";
  }

  JsBarcode("#barcode" + this.upc, this.upc, {
    format,
    lineColor: "#000",
    width: 1,
    height: 10,
    displayValue: true,
    margin: 0,
    background: "#fafafa",
    fontSize: "0.8em"
  });
}

    
  }