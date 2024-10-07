import rules from './config.js';

import express from 'express';
import bodyParser from 'body-parser';
import { createPostResponse, actionCorsMiddleware, ACTIONS_CORS_HEADERS } from "@solana/actions";
import cors from 'cors';


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
// app.use((req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Encoding, Accept-Encoding');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Encoding, Accept-Encoding, X-Accept-Action-Version, X-Accept-Blockchain-Ids');
//     res.setHeader('Access-Control-Expose-Headers', 'X-Action-Version, X-Blockchain-Ids');
//     res.setHeader('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp');
//     res.setHeader('X-Action-Version', '0.1');
//     res.setHeader('Content-Encoding', 'compress');
//     res.setHeader('Content-Type', 'application/json');
// });
app.use(actionCorsMiddleware());

// console.log(app)

app.get("/actions.json", (req, res) => {
    console.log('hello json')
    res.send(JSON.stringify(rules));
});
app.get('/api/actions/blink', (req, res) => {
    console.log('hello')
    try {
        const jsonData = {
            type: "action",
            icon: '/pfp.png',
            title: 'Hello World',
            description: "This is my first blink",
            label: "Blink",
            disabled: false,
            error: { message: "This blink is not implemented yet!" }
        };


        res.json(jsonData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
});

app.post('/api/actions/posting', async (req, res) => {
    const payload = await createPostResponse({
        fields: {
            message: `yay`,
        }
    });

    res.json(payload);
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
