import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_HALL } from './validate.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.resolve(root, process.env.DATA_FILE || 'data/items.json');

let queue = Promise.resolve();
const withLock = (fn) => {
  const run = queue.then(fn);
  queue = run.catch(() => {});
  return run;
};

const readAll = async () => JSON.parse(await readFile(FILE, 'utf-8'));
const writeAll = (items) => writeFile(FILE, JSON.stringify(items, null, 2), 'utf-8');

export const getAll = () => readAll();

export const getById = async (id) => (await readAll()).find((i) => i.id === id) ?? null;

export const create = (value) => withLock(async () => {
  const items = await readAll();
  const id = String(items.reduce((max, i) => Math.max(max, Number(i.id)), 0) + 1);
  const item = { id, ...value, hall: structuredClone(DEFAULT_HALL) };
  items.push(item);
  await writeAll(items);
  return item;
});

export const update = (id, value) => withLock(async () => {
  const items = await readAll();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...value, id }; // hall зберігається
  await writeAll(items);
  return items[idx];
});

export const remove = (id) => withLock(async () => {
  const items = await readAll();
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) return false;
  await writeAll(next);
  return true;
});
