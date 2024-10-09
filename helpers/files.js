import { host } from '../config.js';
import Express from 'express';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirectory = path.join(__dirname, 'public');

const files = Express.Router();


files.get('/start_screen.webp', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'start_screen.webp'));
});
files.get('/level1_screen.webp', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'level1_screen.webp'));
});

export { files }; 