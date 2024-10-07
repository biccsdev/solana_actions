import { host } from '../config.js';
// import { rpc, host } from '../config.js';
import Express from 'express';
import { MEMO_PROGRAM_ID } from "@solana/actions";
import { Connection, PublicKey, Keypair, Transaction, ComputeBudgetProgram, TransactionInstruction, clusterApiUrl } from '@solana/web3.js';

const test = Express.Router();
const connection = new Connection(clusterApiUrl('devnet'), "confirmed");

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

test.get('/api/actions/blink', (req, res) => {
    try {
        const jsonData = {
            type: "action",
            icon: 'https://pbs.twimg.com/media/GTDGt3wbAAAmYQ5?format=jpg&name=large',
            title: 'Hello World',
            description: "This is my first blink",
            label: "Blink",
            links: {
                actions: [{
                    label: "click",
                    href: host + "/api/actions/send"
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
        res.status(400).json({ message: error });
    }
});

test.post('/api/actions/send', async (req, res) => {
    const wallet = Keypair.generate();
    const pubkey = wallet.publicKey;
    const tx = await MemoTx(pubkey);
    const payload = { transaction: tx, message: 'hello' }
    console.log(payload);

    res.setHeader('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp');
    res.setHeader('X-Action-Version', '0.1');
    res.json(payload);
});

export { test }; 