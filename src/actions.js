import rules from './config.js';

import express from 'express';
import bodyParser from 'body-parser';
import { createPostResponse, actionCorsMiddleware, ACTIONS_CORS_HEADERS } from "@solana/actions";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(actionCorsMiddleware());

app.get("/actions.json", (req, res) => {
    res.send(JSON.stringify(rules));
});
app.get('/api/actions/blink', (req, res) => {
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

        console.log('hello')

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
