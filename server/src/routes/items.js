import { Router } from 'express';
import * as store from '../store.js';
import { validateItem } from '../validate.js';
import { HttpError, requireAdmin } from '../middleware.js';

const router = Router();

function parse(body) {
  const { errors, value } = validateItem(body ?? {});
  if (Object.keys(errors).length) throw new HttpError(400, 'Помилка валідації', errors);
  return value;
}

// GET /api/items?cinema=a&genre=Драма&date=2026-11-20&q=назва
router.get('/', async (req, res) => {
  const { cinema, genre, date, q } = req.query;
  const items = (await store.getAll()).filter((i) =>
    (!cinema || i.cinema === cinema) &&
    (!genre || i.genre === genre) &&
    (!date || i.date === date) &&
    (!q || i.filmTitle.toLowerCase().includes(String(q).toLowerCase()))
  );
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await store.getById(req.params.id);
  if (!item) throw new HttpError(404, 'Сеанс не знайдено');
  res.json(item);
});

router.post('/', requireAdmin, async (req, res) => {
  const item = await store.create(parse(req.body));
  res.status(201).location(`/api/items/${item.id}`).json(item);
});

router.put('/:id', requireAdmin, async (req, res) => {
  const item = await store.update(req.params.id, parse(req.body));
  if (!item) throw new HttpError(404, 'Сеанс не знайдено');
  res.json(item);
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const removed = await store.remove(req.params.id);
  if (!removed) throw new HttpError(404, 'Сеанс не знайдено');
  res.status(204).end();
});

export default router;
