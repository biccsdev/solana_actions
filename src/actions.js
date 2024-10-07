import rules from './config.js';

import express from 'express';
import bodyParser from 'body-parser';
import { Keypair, Connection, PublicKey, ComputeBudgetProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { createPostResponse, actionCorsMiddleware, ACTIONS_CORS_HEADERS } from "@solana/actions";
import cors from 'cors';

const MemoTx = async (pubkey) => {
    const transaction = new Transaction();
    transaction.feePayer = pubkey;
    transaction.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000 }),
        new TransactionInstruction({ programId: new PublicKey(MEMO_PROGRAM_ID), data: Buffer.from("Memo!", "utf8"), keys: [] }));
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    const serializedTransaction = transaction.serialize({ requireAllSignatures: false, verifySignatures: false });
    return serializedTransaction.toString('base64');
};


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
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Encoding, Accept-Encoding');
//     //     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Encoding, Accept-Encoding, X-Accept-Action-Version, X-Accept-Blockchain-Ids');
//     //     res.setHeader('Access-Control-Expose-Headers', 'X-Action-Version, X-Blockchain-Ids');
//     //     res.setHeader('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp');
//     //     res.setHeader('X-Action-Version', '0.1');
//     res.setHeader('Content-Encoding', 'compress');
//     res.setHeader('Content-Type', 'application/json');
//     next();
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
            links: {
                actions: [{
                    label: "click",
                    href: "http://localhost/api/actions/send"
                }],
            },
            disabled: false,
            error: { message: "This blink is not implemented yet!" }
        };

        res.setHeader('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp');
        res.setHeader('X-Action-Version', '0.1');
        res.json(jsonData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
});

app.post('/api/actions/blink', async (req, res) => {
    const wallet = Keypair.generate();
    const pubkey = wallet.publicKey;
    const tx = await MemoTx(pubkey);
    // const postRequest = await req.json();
    // const userPubKey = postRequest.account;
    const payload = await createPostResponse({
        fields: {
            transaction: tx,
            message: `hello `,
        }

    });

    res.setHeader('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp');
    res.setHeader('X-Action-Version', '0.1');
    res.json(payload);
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
