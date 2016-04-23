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
