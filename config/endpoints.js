var endpoints = {};

endpoints.version = "1.0";
endpoints.issuer = "http://www.safelayer.com";

endpoints.user_endpoint = "https://sasimi.safelayer.lan:9980/oauth/grant";
endpoints.token_endpoint = "https://sasimi.safelayer.lan:9980/oauth/token";

endpoints.introspection_endpoint = "https://sasimi.safelayer.lan:9980/uma/rptstat";
endpoints.authorization_request_endpoint = "https://sasimi.safelayer.lan:9980/uma/preq";
endpoints.rpt_endpoint = "https://sasimi.safelayer.lan:9980/uma/rpt";
endpoints.permission_registration_endpoint = "https://sasimi.safelayer.lan:9980/uma/preg";
endpoints.resource_set_registration_endpoint = "https://sasimi.safelayer.lan:9980/uma/rsreg";

endpoints.pat_grant_types_supported = ["authorization_code"];
endpoints.aat_grant_types_supported = ["authorization_code"];

endpoints.aat_profiles_supported = ["bearer"];
endpoints.rpt_profiles_supported = ["bearer"];
endpoints.pat_profiles_supported = ["bearer"];


module.exports = endpoints;