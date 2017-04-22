'use strict';
const v4 = require('aws-signature-v4');
const crypto = require('crypto');
const MqttClient = require('./node_modules/mqtt/lib/client');
const websocket = require('websocket-stream');

const AWS_ACCESS_KEY = '';
const AWS_SECRET_ACCESS_KEY = '';
const AWS_IOT_ENDPOINT_HOST = '';
const MQTT_TOPIC = '';


module.exports.endpoint = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true
    })
  };

  callback(null, response);

  let client;

  client = new MqttClient(() => {
    var url = v4.createPresignedURL(
      'GET',
      AWS_IOT_ENDPOINT_HOST.toLowerCase(),
      '/mqtt',
      'iotdevicegateway',
      crypto.createHash('sha256').update('', 'utf8').digest('hex'),
      {
        'key': AWS_ACCESS_KEY,
        'secret': AWS_SECRET_ACCESS_KEY,
        'protocol': 'wss',
        'expires': 15
      }
    );

    return websocket(url, [ 'mqttv3.1' ]);
  });

  client.publish(MQTT_TOPIC, JSON.stringify({ kyle: 'rules' }));
  client.end();  // don't reconnect
  client = undefined;
};
