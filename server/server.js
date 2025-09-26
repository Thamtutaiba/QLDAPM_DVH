import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import todosRouter from './routes/todos.js';


dotenv.config();
console.log('ENV loaded? MONGO_URI length =', (process.env.MONGO_URI || '').length);
console.log('ENV file cwd =', process.cwd());

// Ensure required env vars exist before proceeding
if (!process.env.MONGO_URI) {
console.error('Missing MONGO_URI. Create a .env file in the server directory with MONGO_URI set.');
process.exit(1);
}

const app = express();
app.use(express.json());
app.use(morgan('dev'));


const allowedOrigin = process.env.CLIENT_URL || '*';
app.use(cors({ origin: allowedOrigin }));


app.get('/', (_req, res) => res.send('TaskNest API 🔥'));
app.use('/api/todos', todosRouter);


// Global error handler
app.use((err, _req, res, _next) => {
console.error(err);
res.status(500).json({ message: 'Internal Server Error' });
});


const PORT = process.env.PORT || 5000;


mongoose
.connect(process.env.MONGO_URI)
.then(() => {
app.listen(PORT, () => console.log(`API running on :${PORT}`));
})
.catch((e) => {
console.error('Mongo connect error', e);
process.exit(1);
});