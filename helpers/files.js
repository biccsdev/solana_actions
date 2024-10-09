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
files.get('/level2_future_screen.webp', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'level2_future_screen.webp'));
});
files.get('/level2_past_screen.webp', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'level2_past_screen.webp'));
});
files.get('/level3_1643_screen.webp', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'level3_1643_screen.webp'));
});
files.get('/level3_1776_screen.webp', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'level3_1776_screen.webp'));
});
files.get('/level3_1969_screen.webp', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'level3_1969_screen.webp'));
});
files.get('/level3_2009_screen.webp', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'level3_2009_screen.webp'));
});
files.get('/level3_2069_screen.webp', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'level3_2069_screen.webp'));
});
files.get('/level3_2090_screen.webp', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'level3_2090_screen.webp'));
});
files.get('/level3_3555_screen.webp', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'level3_3555_screen.webp'));
});
files.get('/level3_5533_screen.webp', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'level3_5533_screen.webp'));
});

export { files }; 