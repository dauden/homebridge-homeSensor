const sensor = require('node-dht-sensor').promises;
let Service;
let Characteristic;
const SENOR_TYPE = 22;
const GPIO_PIN = 17;
const DEF_TIMEOUT = 5000;
const DEF_INTERVAL = 120000;  // in milisecond


module.exports = function (homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-homesenor", "HomeSenor", HomeSenor);
	console.log("HomeSenor: module.exports\r\n");
}
function HomeSenor(log, config) {
	this.log = log;
	
	this.name = config["name"];
	this.serviceName = config.service.replace(/\s/g, '');
	this.characteristics = config["characteristics"];
	this.timeout = config["timeout"] || DEF_TIMEOUT;
	this.updateInterval = Number( config["updateInterval"] || DEF_INTERVAL );
	// Internal variables
	this.lastValue = null;
	this.waitingResponse = false;
	this.listener = [];
}
HomeSenor.prototype.updateState = function (state) {
	if (this.waitingResponse) {
		this.log('waiting response!!!');
		return;
	}

	this.waitingResponse = true;
	this.lastValue = sensor.read(this.sensorType, this.gpioPin).then(
    function ({ temperature, humidity }) {
      console.log('temp: ' + temperature.toFixed(1) + '°C, ' +
          'humidity: ' + humidity.toFixed(1) + '%'
      );
      this.mservice.getCharacteristic('Temperature').updateValue(temperature.toFixed(1), null);
      this.mservice.getCharacteristic('Humidity').updateValue(humidity.toFixed(1), null);
      this.waitingResponse = false;
    },
    function (err) {
        this.waitingResponse = false;
        console.error('Failed to read sensor data:', err);
    }
  );
}

HomeSenor.prototype.getServices = function () {
	this.informationService = new Service.AccessoryInformation();
	this.informationService
	.setCharacteristic(Characteristic.Manufacturer, "@metbosch manufacturer")
	.setCharacteristic(Characteristic.Model, "Model not available")
	.setCharacteristic(Characteristic.SerialNumber, "Not defined");

	switch (this.serviceName) {
		case "AccessoryInformation": 
			this.mservice = new Service.AccessoryInformation(this.name); 
			break;
		case "AirQualitySensor": 
			this.mservice = new Service.AirQualitySensor(this.name); 
			break;
		case "BatteryService": 
			this.mservice = new Service.BatteryService(this.name); 
			break;
		case "BridgeConfiguration": 
			this.mservice = new Service.BridgeConfiguration(this.name); 
			break;
		case "BridgingState": 
			this.mservice = new Service.BridgingState(this.name); 
			break;
		case "CameraControl": 
			this.mservice = new Service.CameraControl(this.name); 
			break;
		case "CameraRTPStreamManagement": 
			this.mservice = new Service.CameraRTPStreamManagement(this.name); 
			break;
		case "CarbonDioxideSensor": 
			this.mservice = new Service.CarbonDioxideSensor(this.name); 
			break;
		case "CarbonMonoxideSensor": 
			this.mservice = new Service.CarbonMonoxideSensor(this.name); 
			break;
		case "ContactSensor": 
			this.mservice = new Service.ContactSensor(this.name); 
			break;
		case "Door":
			this.mservice = new Service.Door(this.name); 
			break;
		case "Doorbell": 
			this.mservice = new Service.Doorbell(this.name); 
			break;
		case "Fan": 
			this.mservice = new Service.Fan(this.name); 
			break;
		case "GarageDoorOpener": 
			this.mservice = new Service.GarageDoorOpener(this.name); 
			break;
		case "HumiditySensor": 
			this.mservice = new Service.HumiditySensor(this.name); 
			break;
		case "LeakSensor": 
			this.mservice = new Service.LeakSensor(this.name); 
			break;
		case "LightSensor": 
			this.mservice = new Service.LightSensor(this.name); 
			break;
		case "Lightbulb": 
			this.mservice = new Service.Lightbulb(this.name); 
			break;
		case "LockManagement": 
			this.mservice = new Service.LockManagement(this.name); 
			break;
		case "LockMechanism": 
			this.mservice = new Service.LockMechanism(this.name); 
			break;
		case "Microphone": 
			this.mservice = new Service.LockMechanism(this.name); 
			break;
		case "MotionSensor": 
			this.mservice = new Service.MotionSensor(this.name); 
			break;
		case "OccupancySensor": 
			this.mservice = new Service.OccupancySensor(this.name); 
			break;
		case "Outlet": 
			this.mservice = new Service.Outlet(this.name); 
			break;
		case "Pairing": 
			this.mservice = new Service.Pairing(this.name); 
			break;
		case "ProtocolInformation": 
			this.mservice = new Service.ProtocolInformation(this.name); 
			break;
		case "Relay": 
			this.mservice = new Service.Relay(this.name); 
			break;
		case "SecuritySystem": 
			this.mservice = new Service.SecuritySystem(this.name); 
			break;
		case "SmokeSensor": 
			this.mservice = new Service.SmokeSensor(this.name); 
			break;
		case "Speaker": 
			this.mservice = new Service.Speaker(this.name); 
			break;
		case "StatefulProgrammableSwitch": 
			this.mservice = new Service.StatefulProgrammableSwitch(this.name); 
			break;
		case "StatelessProgrammableSwitch": 
			this.mservice = new Service.StatelessProgrammableSwitch(this.name); 
			break;
		case "Switch": 
			this.mservice = new Service.Switch(this.name); 
			break;
		case "TemperatureSensor": 
			this.mservice = new Service.TemperatureSensor(this.name); 
			break;
		case "Thermostat": 
			this.mservice = new Service.Thermostat(this.name); 
			break;
		case "TimeInformation": 
			this.mservice = new Service.TimeInformation(this.name); 
			break;
		case "TunneledBTLEAccessoryService": 
			this.mservice = new Service.TunneledBTLEAccessoryService(this.name); 
			break;
		case "Window": 
			this.mservice = new Service.Window(this.name); 
			break;
		case "WindowCovering": 
			this.mservice = new Service.WindowCovering(this.name); 
			break;
		default: 
			this.mservice = null;  
			this.log("NodeMCU: service not available yet!");
	}
	
	if(this.characteristics != null) {
		if (typeof this.characteristics === "string")
			this.characteristics = [this.characteristics];
		
		for (var index in this.characteristics) {
			var charac = this.characteristics[index].replace(/\s/g, '');
			if(Characteristic.hasOwnProperty(charac)){
				this.listener[index] = charcHelper(charac);
				
				this.mservice.getCharacteristic(Characteristic[charac]).on('get', this.listener[index].getState.bind(this));
				this.mservice.getCharacteristic(Characteristic[charac]).on('set', this.listener[index].setState.bind(this));		
			}
			else {
				this.log("NodeMCU: " + this.characteristics[index] + " is invalid");
				delete this.characteristics[index];
			}
		}
	}
	else
		this.log("NodeMCU: please set characteristics field in config file");
	
	if (this.updateInterval > 0) {
		//this.timer = setInterval(this.updateState.bind(this), this.updateInterval);
	}
	
	function charcHelper(name){
		return {
			getState: function (callback) {
				this.updateState(); //This sets the promise in lastValue
				this.lastValue.then((value) => {
					callback(null, value[name]);
					return value;
				}, (error) => {
					callback(error, null);
					return error;
				});
			},
			
			setState: function (state, callback) {
				this.updateState(name + "=" + state); //This sets the promise in lastValue
				this.lastValue.then((value) => {
					callback(null, value[name]);
					return value;
				}, (error) => {
					callback(error, null);
					return error;
				});
			},
		};
	}
	return [this.informationService, this.mservice];
}