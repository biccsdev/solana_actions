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
                    href: `/api/actions/timeTales/level?level=1`,
                },
            },
        },
    });

    res.setHeader('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp');
    res.setHeader('X-Action-Version', '0.1');
    res.json(payload);
});

timeTales.post('/api/actions/timeTales/level', async (req, res) => {
    const { level, choice } = req.query;
    try {
        res.setHeader('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp');
        res.setHeader('X-Action-Version', '0.1');

        let href = `/api/actions/timeTales/level${level}`;

        if (choice) {
            href += `?choice=${encodeURIComponent(choice)}`;
        }

        const transaction = MemoTx(req.body.account)

        const payload = await createPostResponse({
            fields: {
                transaction,
                message: `Going to level ${level}`,
                links: {
                    next: {
                        type: 'post',
                        href: href,
                    },
                },
            },
        });

        res.json(payload);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error });
    }
});


timeTales.post('/api/actions/timeTales/level1', (req, res) => {
    try {
        const jsonData = {
            type: "action",
            icon: host + '/level1_screen.webp',
            title: 'Time Tales, The Future or The Past?',
            description: `You're in your garage, the Time Twister humming with potential. Where to first?`,
            label: "menu",
            links: {
                actions: [{
                    type: 'post',
                    label: "Go to the Future",
                    href: host + "/api/actions/timeTales/level?level=2&choice=future"
                }, {
                    type: 'post',
                    label: "Go to the Past",
                    href: host + "/api/actions/timeTales/level?level=2&choice=past"
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

timeTales.post('/api/actions/timeTales/level2', (req, res) => {
    const { choice } = req.query;
    let levelData = null;
    switch (choice) {
        case "future":
            levelData = {
                type: "action",
                icon: host + '/level2_future_screen.webp',
                title: 'When to go? The Future awaits!',
                description: `You clicked the “Future” button, suddenly you were transported to an eerie looking room, in front of you a portal where you can see some futuristic looking buildings in the background.`,
                label: "menu",
                links: {
                    actions: [{
                        label: "Go to 2090",
                        href: host + "/api/actions/timeTales/level?level=3&choice=2090"
                    }, {
                        label: "Go to 2069",
                        href: host + "/api/actions/timeTales/level?level=3&choice=2069"
                    }, {
                        label: "Go to 3555",
                        href: host + "/api/actions/timeTales/level?level=3&choice=3555"
                    }, {
                        label: "Go to 5533",
                        href: host + "/api/actions/timeTales/level?level=3&choice=5533"
                    }],
                },
                disabled: false,
                error: { message: "an error happened, contact @itsbiccs on X." }
            };
            break;
        case "past":
            levelData = {
                type: "action",
                icon: host + '/level2_past_screen.webp',
                title: 'When to go? The Past awaits!',
                description: `You clicked the “Past” button, suddenly you were transported to an eerie looking room, in front of you a portal where you can see some ancient buildings in the background.`,
                label: "menu",
                links: {
                    actions: [{
                        label: "Go to 1643",
                        href: host + "/api/actions/timeTales/level?level=3&choice=1643"
                    }, {
                        label: "Go to 1776",
                        href: host + "/api/actions/timeTales/level?level=3&choice=1776"
                    }, {
                        label: "Go to 1969",
                        href: host + "/api/actions/timeTales/level?level=3&choice=1969"
                    }, {
                        label: "Go to 2009",
                        href: host + "/api/actions/timeTales/level?level=3&choice=2009"
                    }],
                },
                disabled: false,
                error: { message: "an error happened, contact @itsbiccs on X." }
            };
            break;
    }

    try {
        const jsonData = levelData;

        res.setHeader('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp');
        res.setHeader('X-Action-Version', '0.1');
        res.json(jsonData);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error });
    }
});

timeTales.post('/api/actions/timeTales/level3', (req, res) => {
    const { choice } = req.query;
    console.log('choice level 3: ', choice)
    let levelData = null;
    switch (choice) {
        case "1963":
            levelData = {
                type: "action",
                icon: host + '/level3_1963_screen.webp',
                title: 'YEAR 1643 - Galileo’s Time',
                description: `Here, the Earth still orbits the Sun, despite what some might say. Assisting Galileo, you're not just a bystander but a co-conspirator in the scientific revolution, risking heresy for truth. Or perhaps, exploring Renaissance art, you leave behind a doodle that could puzzle historians for centuries.\n Galileo - Nearly get branded as a heretic but prove Earth's rotation.
\nArt - Your modern doodle ends up in a museum.`,
                label: "menu",
                links: {
                    actions: [{
                        label: "Galileo",
                        href: host + "/api/actions/timeTales/pay"
                    }, {
                        label: "Art",
                        href: host + "/api/actions/timeTales/pay"
                    }],
                },
                disabled: false,
                error: { message: "an error happened, contact @itsbiccs on X." }
            };
            break;
        case "1776":
            levelData = {
                type: "action",
                icon: host + '/level3_1776_screen.webp',
                title: 'YEAR 1776 - The American Revolution ',
                description: `You find yourself amidst the fervor of revolution. Helping the Patriots could mean you're drafting the very essence of a new nation with fireworks as your signature, or witnessing the signing of the Declaration might see you locked away with nothing but cheese, missing the historical moment but gaining a tale of ironic survival.\n
\nPatriots - You accidentally invent the first firework show.
\nDeclaration - Get locked in a cellar with cheese, missing the signing.`,
                label: "menu",
                links: {
                    actions: [{
                        label: "Patriots",
                        href: host + "/api/actions/timeTales/pay"
                    }, {
                        label: "Declaration",
                        href: host + "/api/actions/timeTales/pay"
                    }],
                },
                disabled: false,
                error: { message: "an error happened, contact @itsbiccs on X." }
            };
            break;
        case "2009":
            levelData = {
                type: "action",
                icon: host + '/level3_2009_screen.webp',
                title: 'YEAR 2009 - The Tech Boom',
                description: `The dawn of social media and smartphones. By investing in early social media, you might inadvertently create the next viral meme, shaping digital culture. Attending the iPhone launch, your question might just nudge technology in a direction no one expected.\n
\nSocial Media  - Your advice creates a viral meme, for better or worse
\nIphone Launch - You ask a question that Steve Jobs find ‘interesting’`,
                label: "menu",
                links: {
                    actions: [{
                        label: "Social Media",
                        href: host + "/api/actions/timeTales/pay"
                    }, {
                        label: "Iphone Launch",
                        href: host + "/api/actions/timeTales/pay"
                    }],
                },
                disabled: false,
                error: { message: "an error happened, contact @itsbiccs on X." }
            };
            break;
        case "1969":
            levelData = {
                type: "action",
                icon: host + '/level3_1969_screen.webp',
                title: 'YEAR 1969 - The Moon Landing',
                description: `You're at the cusp of one of humanity's greatest achievements. At Mission Control, your quick thinking could be what saves the mission, or sneaking onto Apollo 11, you become the unsung legend of lunar exploration, the shadow conspiracy theorists will argue about for decades.\n
\nMission Control - Your quick thinking saves a critical moment.
\nApollo 11 - You're the mysterious "third" astronaut shadow; conspiracy theories abound!`,
                label: "menu",
                links: {
                    actions: [{
                        label: "Mission Control",
                        href: host + "/api/actions/timeTales/pay"
                    }, {
                        label: "Apollo",
                        href: host + "/api/actions/timeTales/pay"
                    }],
                },
                disabled: false,
                error: { message: "an error happened, contact @itsbiccs on X." }
            };
            break;
        case "5533":
            levelData = {
                type: "action",
                icon: host + '/level3_5533_screen.webp',
                title: 'YEAR 5533 - The Cosmic Wanderlust',
                description: `Humanity has reached out to the stars, and you're now a part of this cosmic journey. Join a starship expedition and you might encounter life forms that challenge your understanding of existence, or delve into universal translation, where your words could bridge civilizations or spark interstellar incidents.\n
\nStarship - Encounter an alien race, diplomacy or space battle?
\nTranslator - Misinterpretations lead to a dance-off with aliens!`,
                label: "menu",
                links: {
                    actions: [{
                        label: "Starship",
                        href: host + "/api/actions/timeTales/pay"
                    }, {
                        label: "Translator",
                        href: host + "/api/actions/timeTales/pay"
                    }],
                },
                disabled: false,
                error: { message: "an error happened, contact @itsbiccs on X." }
            };
            break;
        case "3555":
            levelData = {
                type: "action",
                icon: host + '/level3_3555_screen.webp',
                title: 'YEAR 3555 - The Age of AI',
                description: `In this era, artificial intelligence has woven itself into the fabric of existence. You're thrust into a society where AI and humans debate the future of consciousness. By attending the AI Council, you might steer the ethics of AI development, or by exploring the Virtual Reality Wilds, you could discover what it means to be 'real' in a digital age.\n
\nAI Council - A debate goes awry, and you accidentally become AI mayor.
\nVR Wilds - You get lost in a game, real-life consequences!`,
                label: "menu",
                links: {
                    actions: [{
                        label: "AI Council",
                        href: host + "/api/actions/timeTales/pay"
                    }, {
                        label: "VR Wilds",
                        href: host + "/api/actions/timeTales/pay"
                    }],
                },
                disabled: false,
                error: { message: "an error happened, contact @itsbiccs on X." }
            };
            break;
        case "2069":
            levelData = {
                type: "action",
                icon: host + '/level3_2069_screen.webp',
                title: 'YEAR 2069 - The Eco Renaissance',
                description: `You choose to leap into a world where humanity has begun to heal Earth's scars. As you step into 2069, you're greeted by lush greenery stretching over what once were cities. Here, your decision to help rehabilitate the Amazon or explore New York's Sky Gardens isn't just about survival; it's about shaping humanity's relationship with nature. Will you plant the seeds of tomorrow or cultivate the skies?\n
\nAmazon - You help plant species that will one day repopulate the forest.
\nSky Gardens - You learn about future agriculture, and modern advancements.`,
                label: "menu",
                links: {
                    actions: [{
                        label: "Amazon",
                        href: host + "/api/actions/timeTales/pay"
                    }, {
                        label: "Sky Gardens",
                        href: host + "/api/actions/timeTales/pay"
                    }],
                },
                disabled: false,
                error: { message: "an error happened, contact @itsbiccs on X." }
            };
            break;
        case "2090":
            levelData = {
                type: "action",
                icon: host + '/level3_2090_screen.webp',
                title: 'YEAR 2090 - The Space Race Redux',
                description: `The stars are closer than ever. You arrive in a time where Mars and Earth's oceans hold new civilizations. Choosing between Mars and the underwater city, you're not just picking a destination but deciding where humanity's future might thrive. Will you be a pioneer on the red sands or an explorer of the deep blue, uncovering secrets lost to time\n
\nMars Colony - Survive a sandstorm, become a hero.
\nUnderwater City - Discover ancient artifacts, but trigger a minor flood.`,
                label: "menu",
                links: {
                    actions: [{
                        label: "Underwater city",
                        href: host + "/api/actions/timeTales/pay"
                    }, {
                        label: "Mars Colony",
                        href: host + "/api/actions/timeTales/pay"
                    }],
                },
                disabled: false,
                error: { message: "an error happened, contact @itsbiccs on X." }
            };
            break;
    }

    try {
        const jsonData = levelData;

        res.setHeader('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp');
        res.setHeader('X-Action-Version', '0.1');
        res.json(jsonData);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error });
    }
});

export { timeTales }; 