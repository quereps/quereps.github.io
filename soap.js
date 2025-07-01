

const username = "Florian";
const password = "2W30or6lD";
const modelId = 81622413;
const valueToMatch = "test"; // or dynamic value



const editModelObject = function(a,col,val){

  const body = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <editModelObject xmlns="http://model.v81.api.keysurvey.com">
      <model xmlns="">
        <id>${a}</id>
        <keyFieldName>internal_id</keyFieldName>
        <properties>
          <entry>
            <key>${col}</key>
            <value>${val}</value>
          </entry>
        </properties>
      </model>
      <modelId xmlns="">${modelId}</modelId>
    </editModelObject>
  </s:Body>
</s:Envelope>`;

  callSOAPAPI(body).then((a)=>{
      console.log("my response: ",a);
    });

} ;




const getDatamodelsList = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:v81="http://www.keysurvey.com/API/v81"
        xmlns:mod="http://model.v81.api.keysurvey.com">
  <soapenv:Header>
    <v81:auth>
      <login>${username}</login>
      <password>${password}</password>
    </v81:auth>
  </soapenv:Header>
  <soapenv:Body>
    <mod:listModels/>
  </soapenv:Body>
</soapenv:Envelope>`


const getItemsList = function(){
const body = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:v81="http://www.keysurvey.com/API/v81"
                  xmlns:mod="http://model.v81.api.keysurvey.com">
  <soapenv:Header>
    <v81:auth>
    <login>${username}</login>
    <password>${password}</password>
  </v81:auth>
  </soapenv:Header>
  <soapenv:Body>
    <mod:getModelObjectsByFilter>
      <modelId>81622413</modelId>
      <filterId>0</filterId> <!-- Pass 0 or omit if you're not using filters -->
    </mod:getModelObjectsByFilter>
  </soapenv:Body>
</soapenv:Envelope>`;


  callSOAPAPI(body).then((a)=>{
      console.log("my response: ",a);
    });

  }



const getModelByID = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:v81="http://www.keysurvey.com/API/v81"
                  xmlns:mod="http://model.v81.api.keysurvey.com">
  <soapenv:Header>
    <v81:auth>
    <login>${username}</login>
    <password>${password}</password>
  </v81:auth>
  </soapenv:Header>
  <soapenv:Body>
    <mod:getModelById>
      <modelId>81622413</modelId>
    </mod:getModelById>
  </soapenv:Body>
</soapenv:Envelope>`



const getFilteredObjects = function(a){
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:v81="http://www.keysurvey.com/API/v81"
                  xmlns:mod="http://model.v81.api.keysurvey.com">
  <soapenv:Header>
    <v81:auth>
      <login>${username}</login>
    <password>${password}</password>
    </v81:auth>
  </soapenv:Header>
  <soapenv:Body>
    <mod:getFilteredObjects>
      <modelId>${modelId}</modelId>
      <filter>
        <name>test</name>
        <logicalCondition>F1</logicalCondition>
        <filters>
          <fieldName>upc</fieldName>
          <condition>LIKE</condition>
          <values>${a}</values>
        </filters>
      </filter>
    </mod:getFilteredObjects>
  </soapenv:Body>
</soapenv:Envelope>`;
  callSOAPAPI(body).then((a)=>{
      console.log("my response: ",a);
    });
}


const gpt = function (value) {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:v81="http://www.keysurvey.com/API/v81"
                  xmlns:mod="http://model.v81.api.keysurvey.com">
  <soapenv:Header>
    <v81:auth>
      <login>${username}</login>
      <password>${password}</password>
    </v81:auth>
  </soapenv:Header>
  <soapenv:Body>
    <mod:getFilteredObjects>
      <modelId>${modelId}</modelId>
      <filter>
        <name>Temp Filter</name>
        <logicalCondition>AND</logicalCondition>
        <filters>
          <filter>
            <fieldName>upc</fieldName>
            <condition>EQUAL</condition>
            <values>${value}</values>
          </filter>
        </filters>
      </filter>
    </mod:getFilteredObjects>
  </soapenv:Body>
</soapenv:Envelope>`;

  callSOAPAPI(body).then((a) => {
    console.log("my response: ", a);
  });
};




const createFilter = function(){
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:v81="http://www.keysurvey.com/API/v81"
                  xmlns:mod="http://model.v81.api.keysurvey.com">
  <soapenv:Header>
    <v81:auth>
      <login>${username}</login>
      <password>${password}</password>
    </v81:auth>
  </soapenv:Header>
  <soapenv:Body>
    <mod:createFilter>
      <modelId>${modelId}</modelId>
      <filter>
        <id>12345</id>
        <name>My Filter</name>
        <logicalCondition>F1</logicalCondition>
        <filters>
            <fieldName>upc</fieldName>
            <condition>EQUAL</condition>
            <values>5201314145011</values>
        </filters>
      </filter>
    </mod:createFilter>
  </soapenv:Body>
</soapenv:Envelope>`;

callSOAPAPI(body).then((a)=>{
      console.log("my response: ",a);
    });
  } 


const getFilters = function(){
   const body = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:v81="http://www.keysurvey.com/API/v81"
                  xmlns:mod="http://model.v81.api.keysurvey.com">
  <soapenv:Header>
    <v81:auth>
      <login>Florian</login>
      <password>2W30or6lD</password>
    </v81:auth>
  </soapenv:Header>
  <soapenv:Body>
    <mod:getFilters>
      <modelId>81622413</modelId>
    </mod:getFilters>
  </soapenv:Body>
</soapenv:Envelope>`;

  callSOAPAPI(body).then((a)=>{
      console.log("my response: ",a);
    });

};


const deleteFilter = function(filterID){

    const body = `<?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:v81="http://www.keysurvey.com/API/v81"
                  xmlns:mod="http://model.v81.api.keysurvey.com">
  <soapenv:Header>
    <v81:auth>
      <login>${username}</login>
      <password>${password}</password>
    </v81:auth>
  </soapenv:Header>
  <soapenv:Body>
    <mod:deleteFilter>
      <filterId>${filterID}</filterId>
    </mod:deleteFilter>
  </soapenv:Body>
</soapenv:Envelope>`;


    callSOAPAPI(body).then((a)=>{
      console.log("my response: ",a);
    });

  };




function callSOAPAPI(body){
  return fetch("https://app.form.com/Member/api/v81/model/DataModelsService", {
  method: "POST",
  headers: {
    "Content-Type": "text/xml;charset=UTF-8",
    "SOAPAction": "",
    "Authorization":"Basic "+btoa(username+":"+password),
  },
  body: body
})
  .then(response => response.text()).then(responseJSON => {return responseJSON})
  .catch(error => {
    console.error("Error calling editModelObject:", error);
  });
}



//deleteFilter("81487818");
//getFilters();
//createFilter();
//editModelObject(1412565215,"exp_price",1);
//editModelObjectv1();
//getFilteredObjects("5201314145011");
gpt("5201314145011");
//getItemsList();