var mosca       = require('mosca'),
    backend     = { },
    persistence = { },
    settings    = {
      port: 1884,
      logger: {
          streams: [{
              level: 'debug',
              path: './log'
          }]
      },
      backend: backend,
      persistence: persistence
    },
    moscaServer = new mosca.Server(settings);

moscaServer.on('ready', function () {
  console.log('Mosca server is up and running on port ' + settings.port);
});


moscaServer.published = function(packet, client, cb) {
  if (packet.topic.indexOf('echo') === 0) {
    return cb();
  }

  var newPacket = {
    topic: 'echo/' + packet.topic,
    payload: packet.payload,
    retain: packet.retain,
    qos: packet.qos
  };

  console.log('newPacket', newPacket);

  moscaServer.publish(newPacket, cb);
}
