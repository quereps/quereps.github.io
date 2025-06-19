

const username = "Florian";
const password = "2W30or6lD";
const modelId = 81622413;
const valueToMatch = "test"; // or dynamic value


const editModelObject = function(){

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
        <id>1411166031</id>
        <keyFieldName>internal_id</keyFieldName>
        <properties>
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
    <modelId>81622413</modelId>
  </mod:editModelObject>
  </soapenv:Body>
</soapenv:Envelope>`;

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
//editModelObject();
//getFilteredObjects("81487812");
getItemsList();