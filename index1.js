var sensor = require('node-dht-sensor').promises;
 
sensor.read(11, 17).then(
    function ({ temperature, humidity }) {
      console.log('temp: ' + temperature.toFixed(1) + '°C, ' +
          'humidity: ' + humidity.toFixed(1) + '%'
      );
    },
    function (err) {
        console.error('Failed to read sensor data:', err);
    }
);