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

  htmlTile(title,subtitle,description,result,target,dataTable,barcode){
    let HTMLOutput = "";

    let titleHTML = title ? "<h1>"+title+"</h1>" : ""; 
    let subtitleHTML = title ? "<h2>"+subtitle+"</h2>" : ""; 
    let descHTML = title ? "<p class='description'>"+description+"</p>" : ""; 
    let numberHTML = result ? "<div class='result'>"+result+"</div>" : ""; 
    let targetHTML = target ? "<div class='target'>"+target+"</div>" : ""; 
    let low = target/100*20;
    let high = target/100*80;

    let gaugeHTML = result && target ? "<meter value="+result+" min='0' max="+target+" low="+low+" high="+high+" optimum="+target+"></meter>" : ""; 
    let resultHTML = "<div class='result'>"+numberHTML+targetHTML+gaugeHTML+"</div>"
    let tableHTML = "<table>"

    for(let i in dataTable){
        let item = dataTable[i];
        tableHTML=tableHTML+"<tr><th>"+item+"</th><td>"+this[dataTable[i]]+"</td></tr>";
    }

    tableHTML = tableHTML+"</table>";

    if(barcode){
      let barcodeHTML = "<img class='barcode' id='barcode"+this.upc+"' scr='' />";
    }

    HTMLOutput = titleHTML+subtitleHTML+descHTML+resultHTML+tableHTML;

    console.log(HTMLOutput);
    return HTMLOutput;
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



    console.log(this.facings,"______",exp);

    this.expFacings = Number(exp);
    if(Number(this.facings) === Number(exp)){
      this.facingCompliance = true;
    }
    else{
      this.facingCompliance =  false;
    }
  }

    checkPricingCompliance(exp){
      this.expPricing = exp;
      if(this.prices[0] == exp){
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