var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'soa'
    },
    port: 3001,
    db: 'mongodb://localhost/soa-development',
    secret: 'salt'
  },

  test: {
    root: rootPath,
    app: {
      name: 'soa'
    },
    port: 3000,
    db: 'mongodb://localhost/soa-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'soa'
    },
    port: 3000,
    db: 'mongodb://localhost/soa-production'
  }
};

module.exports = config[env];
