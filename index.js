const sensor = require('node-dht-sensor');
const SENOR_TYPE = 22;
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
    this.gpioPin = Number( config["gpio_pin"] || GPIO_PIN );
    this.sensorType = Number( config["sensor_type"] || SENOR_TYPE );
    this.currentTemperature = 22;
  }

  identify(callback) {
    this.log('Identify requested!');
    callback(null);
  }

  startReading() {
    const callback = () => {
      setTimeout(() => this.getReading(callback), 5000);
    };

    this.getReading(callback);
  }

  getReading(callback) {
    sensor.read(this.sensorType, this.gpioPin, (err, temperature) => {
      callback();
      if (err) {
        console.error(err); // eslint-disable-line no-console
        return;
      }

      this.currentTemperature = temperature;
      this.temperatureService.setCharacteristic(Characteristic.CurrentTemperature, this.currentTemperature);
    });
  }

  getServices() {
    const informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Encore Dev Labs')
      .setCharacteristic(Characteristic.Model, 'Pi Temperature Sensor')
      .setCharacteristic(Characteristic.SerialNumber, 'Raspberry Pi');

    this.temperatureService = new Service.TemperatureSensor(this.name);
    this.temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', (callback) => {
        callback(null, this.currentTemperature);
      });
    this.temperatureService
      .getCharacteristic(Characteristic.Name)
      .on('get', callback => {
        callback(null, this.name);
      });

    this.startReading();

    return [informationService, this.temperatureService];
  }
}