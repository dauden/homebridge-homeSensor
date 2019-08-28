const sensor = require('node-dht-sensor').promises;
const SENOR_TYPE = 11;
const GPIO_PIN = 17
let Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-temperature-sensor', 'HomeSenor', HomeSenor);
};

class HomeSenor {
  constructor(log, config) {
    this.log = log;
    this.name = config.name;
    this.serviceName = config.service.replace(/\s/g, '');
    this.characteristics = config.characteristics.replace(/\s/g, '');
    this.valueProperty = config.valueProperty.replace(/\s/g, '');
    this.gpioPin = Number( config["gpioPin"] || GPIO_PIN );
    this.sensorType = Number( config["sensorType"] || SENOR_TYPE );
    this.currentValue = 0;
  }

  identify(callback) {
    this.log('Identify requested!');
    callback(null);
  }

  startReading() {
    let sefl = this;
    const callback = () => {
      setTimeout(() => this.getReading(callback), 5000);
    };

    this.getReading(callback);
  }

  getReading(callback) {
    let sefl = this;
    sensor.read(this.sensorType, this.gpioPin).then(
      resp => {
        callback();
        sefl.log("currentValue:", resp);
        this.currentValue = resp[this.valueProperty];
        this.mservice.setCharacteristic(this.characteristics, this.currentValue);
      },
      err => {
        sefl.error('Failed to read sensor data:', err);
        return;
      }
    );
  }

  getServices() {
    const informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, 'BackBean Dev Labs')
      .setCharacteristic(Characteristic.Model, 'HomeSenor Sensor')
      .setCharacteristic(Characteristic.SerialNumber, 'Raspberry Pi, NodeMCU, gpio');
    
    switch (this.serviceName) {
      case "AirQualitySensor": 
        this.mservice = new Service.AirQualitySensor(this.name); 
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
      case "HumiditySensor": 
        this.mservice = new Service.HumiditySensor(this.name); 
        break;
      case "LeakSensor": 
        this.mservice = new Service.LeakSensor(this.name); 
        break;
      case "LightSensor": 
        this.mservice = new Service.LightSensor(this.name); 
        break;
      case "MotionSensor": 
        this.mservice = new Service.MotionSensor(this.name); 
        break;
      case "OccupancySensor": 
        this.mservice = new Service.OccupancySensor(this.name); 
        break;
      case "SmokeSensor": 
        this.mservice = new Service.SmokeSensor(this.name); 
        break;
      case "TemperatureSensor": 
        this.mservice = new Service.TemperatureSensor(this.name); 
        break;
      default: 
        this.mservice = null;  
        this.log("HomeSenor: service not available yet!");
    }
    
    this.log(this.characteristics,this.currentValue);

    this.mservice
      .getCharacteristic(this.characteristics)
      .on('get', (callback) => {
        callback(null, this.currentValue);
      });

    this.mservice
      .getCharacteristic(Characteristic.Name)
      .on('get', callback => {
        callback(null, this.name);
      });

    this.startReading();

    return [informationService, this.mservice];
  }
}