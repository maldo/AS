var config = {}

config.db = {};
config.redis = {};
config.app = {};

config.redis.uri = process.env.DUOSTACK_DB_REDIS;
config.redis.host = 'hostname';
config.redis.port = 6379;

config.app.port = process.env.WEB_PORT || 9980;

module.exports = config;