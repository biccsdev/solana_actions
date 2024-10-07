var host = "http://134.122.30.186:3000"

var rules = {
    "rules": [
        { "pathPattern": "/*", "apiPath": host + "/api/actions/*" },
        { "pathPattern": "/api/actions/**", "apiPath": host + "/api/actions/**" },
    ]
};

export var rules, host;