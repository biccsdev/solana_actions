"use strict";
import "dotenv/config";
import fs from "fs";

var host = "http://localhost";
// var host = "https://biccs.dev"

if (host.includes("localhost")) {
    host = host + ":3000";
}

var rules = {
    rules: [
        { pathPattern: "/*", apiPath: host + "/api/actions/*" },
        { pathPattern: "/api/actions/**", apiPath: host + "/api/actions/**" },
    ],
};

// var rpc_file = "rpcs/rpcs.json"; // move to server root for prod
// var rpc_id = 0; // 0 = first rpc url from the file above
// var rpc;

// if (process.env.RPC) {
//     rpc = process.env.RPC;
// } else {
//     var rpcs = JSON.parse(fs.readFileSync(rpc_file).toString());
//     rpc = rpcs[rpc_id].url;
// }

// export var host, rpc, rules;
export var host, rules;
