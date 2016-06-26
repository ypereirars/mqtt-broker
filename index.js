var mosca       = require('mosca'),
    backend     = { },
    persistence = { },
    settings    = {
      port: 1884,
      // logger: {
      //     streams: [{
      //         level: 'debug',
      //         path: './log'
      //     }]
      // },
      backend: backend,
      persistence: persistence
    },
    moscaServer = new mosca.Server(settings),
    clientsConnected = { count: 0 },
    stackOfTopics = {};

function clientExists(client, callback) {
  if (typeof clientsConnected[client.id] === 'undefined') {
    return;
  };
  callback();
}

function handleClientConnected() {
  moscaServer.on('clientConnected', function(client) {
    clientExists(client, function() {
      clientsConnected[client.id] = {};
      clientsConnected.count++;
    });
  });
}

function handleClientDisconnected() {
  moscaServer.on('clientDisconnected', function(client) {
    delete clientsConnected[client.id];
    clientsConnected.count--;
  });
}

function handleSubscription() {
  moscaServer.on('subscribed', function(topic, client) {
    clientExists(client, function () {
      clientsConnected[client.id].topic = topic;
    });
  });
}

function handleUnsubscription() {
  moscaServer.on('unsubscribed', function(topic, client) {
    clientExists(client, function () {
      delete clientsConnected[client.id];
    });
  });
}

function aggregatePackets(packet, cb) {
  if (packet.topic.indexOf('echo') === 0) {
    return cb();
  }

  var topic = packet.topic,
      sendPacket = {
        payload: {},
        topic: '',
        retain: false,
        qos: 0
      };

  if (topic.indexOf("$SYS") < 0 && topic.indexOf("#") < 0) {
    var topicSplited  = packet.topic.split('/'),
        topicObj = {
          id: topicSplited[0],
          device: topicSplited[1],
          sensor: topicSplited[2]
        };

    if (typeof stackOfTopics[topicObj.sensor] === 'undefined') {
      stackOfTopics[topicObj.sensor] = packet.payload.toString();
    }
    else {
      sendPacket.topic = topicSplited.slice(0, 2).join('/') + "/#";
      sendPacket.payload = JSON.stringify(stackOfTopics);
      moscaServer.publish(sendPacket, cb);
      stackOfTopics = {}
      stackOfTopics[topicObj.sensor] = packet.payload.toString();
    }
  }
}

handleClientConnected();
handleClientDisconnected();
handleSubscription();
handleUnsubscription();


moscaServer.on('ready', function () {
  console.log('Mosca server is up and running on port ' + settings.port);
});

moscaServer.published = function(packet, client, cb) {
  aggregatePackets(packet, cb);
};
