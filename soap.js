

const username = "Florian";
const password = "2W30or6lD";
const modelId = 81622413;
const valueToMatch = "test"; // or dynamic value


const editModelObjectold = function(){

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
   <mod:editModelObject>
    <modelObject>
        <id>1412565215</id>
        <keyFieldName>internal_id</keyFieldName>
        <properties>
          <entry>
            <key>internal_id</key>
            <value>56276410_5900571000025</value>
          </entry>
          <entry>
            <key>latest status</key>
            <value>Updated by script</value>
          </entry>
          <entry>
            <key>latest status timestamp</key>
            <value>${new Date().toISOString()}</value>
          </entry>
        </properties>
      </modelObject>
    <modelId>${modelId}</modelId>
  </mod:editModelObject>
  </soapenv:Body>
</soapenv:Envelope>`;

  callSOAPAPI(body).then((a)=>{
      console.log("my response: ",a);
    });

} ;



const editModelObject = function(a,col,val){

  const body = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <editModelObject xmlns="http://model.v81.api.keysurvey.com">
      <model xmlns="">
        <id>${modelId}</id>
        <keyFieldName>internal_id</keyFieldName>
        <properties>
          <entry>
            <key>${col}</key>
            <value>${val}13</value>
          </entry>
        </properties>
      </model>
      <modelId xmlns="">81622413</modelId>
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
        <id>${a}</id>
        <name>test</name>
        <logicalCondition>F1</logicalCondition>
        <filter>
          <fieldName>upc</fieldName>
          <condition>LIKE</condition>
          <values>${a}</values>
        </filter>
      </filter>
    </mod:getFilteredObjects>
  </soapenv:Body>
</soapenv:Envelope>`;
  callSOAPAPI(body).then((a)=>{
      console.log("my response: ",a);
    });
}





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
editModelObject("1412565215","exp_price",1);
//getFilteredObjects("5201314145011");
//getItemsList();