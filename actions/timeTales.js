import { host } from '../config.js';
// import { rpc, host } from '../config.js';
import Express from 'express';
import { createPostResponse, MEMO_PROGRAM_ID } from "@solana/actions";
import { SystemProgram, Connection, PublicKey, Keypair, Transaction, ComputeBudgetProgram, TransactionInstruction, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

const timeTales = Express.Router();
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

timeTales.get('/api/actions/timeTales', (req, res) => {
    try {
        const jsonData = {
            type: "action",
            icon: host + '/start_screen.webp',
            title: 'Time Tales, Embark on a Journey',
            description: `Time Tales is an engaging adventure game where your choices shape the storyline. Explore multiple endings and aim for the highest score as you navigate through time and unravel mysteries. \n
            You are Marcus, a curious inventor who stumbles upon a dusty, old machine in your attic. Labeled "Time Twister," it's not just any antique; it's a time machine! With a mix of trepidation and excitement, you decide to take it for a spin...`,
            label: "menu",
            links: {
                actions: [{
                    label: "Play for 0.01 $SOL",
                    href: host + "/api/actions/timeTales/pay"
                }],
            },
            disabled: false,
            error: { message: "an error happened, contact @itsbiccs on X." }
        };

        res.setHeader('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp');
        res.setHeader('X-Action-Version', '0.1');
        res.json(jsonData);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error });
    }
});

timeTales.post('/api/actions/timeTales/pay', async (req, res) => {
    const toPubkey = 'Dip4jcr7QSYsC5H3PB2peFeZpAE6PX9dLz3GMrZqL7C5'
    const amount = '0.01';
    const { account } = req.body;

    if (!account) {
        throw new Error('Invalid "account" provided');
    }

    const fromPubkey = new PublicKey(account);
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
        0,
    );

    if (amount * LAMPORTS_PER_SOL < minimumBalance) {
        throw new Error(`Account may not be rent exempt: ${toPubkey.toBase58()}`);
    }

    // create an instruction to transfer native SOL from one wallet to another
    const transferSolInstruction = SystemProgram.transfer({
        fromPubkey: fromPubkey,
        toPubkey: toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
    });

    const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

    // create a legacy transaction
    const transaction = new Transaction({
        feePayer: fromPubkey,
        blockhash,
        lastValidBlockHeight,
    }).add(transferSolInstruction);

    const payload = await createPostResponse({
        fields: {
            transaction,
            message: `Send ${amount} SOL to ${toPubkey}`,
            links: {
                next: {
                    type: 'post',
                    href: `/api/actions/timeTales/level1`,
                },
            },
        },
    });

    // const wallet = Keypair.generate();
    // const pubkey = wallet.publicKey;
    // const tx = await MemoTx(pubkey);
    // const payload = { transaction: tx, message: 'hello' }
    // console.log(payload);

    res.setHeader('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp');
    res.setHeader('X-Action-Version', '0.1');
    res.json(payload);
});

timeTales.get('/api/actions/timeTales/level1', (req, res) => {
    try {
        const jsonData = {
            type: "action",
            icon: host + '/level1_screen.webp',
            title: 'Time Tales, The Future or The Past?',
            description: `You're in your garage, the Time Twister humming with potential. Where to first?`,
            label: "menu",
            links: {
                actions: [{
                    label: "Go to the Future",
                    href: host + "/api/actions/timeTales/pay"
                }, {
                    label: "Go to the Past",
                    href: host + "/api/actions/timeTales/pay"
                }],
            },
            disabled: false,
            error: { message: "an error happened, contact @itsbiccs on X." }
        };

        res.setHeader('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp');
        res.setHeader('X-Action-Version', '0.1');
        res.json(jsonData);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error });
    }
});

export { timeTales }; 