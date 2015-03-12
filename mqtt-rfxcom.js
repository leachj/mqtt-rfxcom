var rfxcom = require('rfxcom');
var mqtt = require('mqtt')

mqttClient = mqtt.createClient(1883, 'localhost');

var rfxtrx = new rfxcom.RfxCom("/dev/tty.usbserial-A1XH8LAT", {debug: false}),
lightwaverf = new rfxcom.Lighting5(rfxtrx, rfxcom.lighting5.LIGHTWAVERF);

mqttClient.on('connect', function () {
     mqttClient.subscribe('rfxcom-control');

     mqttClient.on('message', function (topic, message) {
       console.log(message.toString());
       parts = message.toString().split(" ")
       if(parts[2] == "on"){
          lightwaverf.switchOn(parts[0]+"/"+parts[1]);
       } else {
          lightwaverf.switchOff(parts[0]+"/"+parts[1]);
       }
    });
  });

rfxtrx.initialise(function () {
  console.log("Device initialised");
 
  rfxtrx.on("lighting5", function (evt) {
    console.log(evt);
    mqttClient.publish('rfxcom-event', evt.id + " " + evt.unitcode + " " + evt.command);
  });

});

