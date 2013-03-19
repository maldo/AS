var config = require('./config');

var endpoints = {};

var base = config.app.server;

endpoints.version = "1.0";
endpoints.issuer = "http://www.safelayer.com";

endpoints.user_endpoint = base + "/oauth/grant";
endpoints.token_endpoint =  base + "/oauth/token";

endpoints.introspection_endpoint =  base + "/uma/rptstat";
endpoints.authorization_request_endpoint =  base + "/uma/preq";
endpoints.rpt_endpoint =  base + "/uma/rpt";
endpoints.permission_registration_endpoint =  base + "/uma/preg";
endpoints.resource_set_registration_endpoint =  base + "/uma/rsreg";

endpoints.pat_grant_types_supported = ["authorization_code"];
endpoints.aat_grant_types_supported = ["authorization_code"];

endpoints.aat_profiles_supported = ["bearer"];
endpoints.rpt_profiles_supported = ["bearer"];
endpoints.pat_profiles_supported = ["bearer"];


module.exports = endpoints;