import { rules } from './config.js';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { actionCorsMiddleware } from '@solana/actions';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 3000;

const publicDirectory = path.join(__dirname, 'public');
app.use(express.static(publicDirectory));

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

import { timeTales } from './actions/timeTales.js';
app.use("/", timeTales);

import { files } from './helpers/files.js';
app.use("/", files);

app.get("/actions.json", (req, res) => {
    res.send(JSON.stringify(rules));
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
