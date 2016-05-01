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
    clientsConnected = { count: 0 };

function clientExists(client, callback) {
  if (typeof clientsConnected[client.id] === undefined) {
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

function echoPackets(packet, cb) {
  if (packet.topic.indexOf('echo') === 0) {
    return cb();
  }

  var newPacket = {
    topic: 'echo/' + packet.topic,
    payload: packet.payload,
    retain: packet.retain,
    qos: packet.qos
  };

  moscaServer.publish(newPacket, cb);
}

handleClientConnected();
handleClientDisconnected();
handleSubscription();
handleUnsubscription();


moscaServer.on('ready', function () {
  console.log('Mosca server is up and running on port ' + settings.port);
});

moscaServer.published = function(packet, client, cb) {
  echoPackets(packet, cb);
};
