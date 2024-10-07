import { rules, host } from './config.js';

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import { actionCorsMiddleware } from '@solana/actions';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.options('*', cors(
    {
        "methods": ["GET,PUT,POST,OPTIONS"],
        "allowedHeaders": ['Content-Type, Authorization, Content-Encoding, Accept-Encoding'],
        "allowedHeaders": ['Content-Type, Authorization, Content-Encoding, Accept-Encoding, X-Accept-Action-Version, X-Accept-Blockchain-Ids'],
        "exposeHeaders": ['X-Action-Version, X-Blockchain-Ids'],
        "preflightContinue": true,
        "optionsSuccessStatus": 204
    }
));
app.use(actionCorsMiddleware());

import { test } from './actions/test.js';
app.use("/", test);

// app.get("/actions.json", async (req, res) => {
//     try {
//         const filePath = join(__dirname, 'actions.json');
//         const data = await fs.readFile(filePath, 'utf8');
//         const jsonData = JSON.parse(data);
//         res.json(jsonData);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });
app.get("/actions.json", (req, res) => {
    res.send(JSON.stringify(rules));
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
