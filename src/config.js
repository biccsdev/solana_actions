var host = "http://localhost"

var rules = {
    "rules": [
        { "pathPattern": "/*", "apiPath": host + "/api/actions/*" },
        { "pathPattern": "/api/actions/**", "apiPath": host + "/api/actions/**" },
    ]
};

export default rules;