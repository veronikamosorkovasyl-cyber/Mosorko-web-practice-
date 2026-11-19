import { Router } from 'express';
import { validateContact } from '../validate.js';

const router = Router();

router.post('/', (req, res) => {
  const errors = validateContact(req.body ?? {});
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Помилка валідації', errors });
  }
  console.log('Нове звернення:', { ...req.body, at: new Date().toISOString() });
  res.status(201).json({ message: 'Звернення прийнято' });
});

export default router;
