const host = "http://localhost"

const rules = {
    "rules": [
        { "pathPattern": "/*", "apiPath": "/api/actions/*" },
        { "pathPattern": "/api/actions/**", "apiPath": "/api/actions/**" },
    ]
};

export default rules;