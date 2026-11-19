import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import itemsRouter from './routes/items.js';
import contactRouter from './routes/contact.js';
import { logger, notFound, errorHandler } from './middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;
const origins = process.env.CLIENT_ORIGIN?.split(',');

app.use(cors({ origin: origins ?? '*' }));
app.use(express.json());
app.use(logger);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/items', itemsRouter);
app.use('/api/contact', contactRouter);

app.use(notFound);      // невідомі маршрути → 404
app.use(errorHandler);  // централізована обробка → 400/500

app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));
