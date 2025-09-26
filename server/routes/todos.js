// server/routes/todos.js
import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

// Create
router.post('/', async (req, res, next) => {
  try {
    const { title, dueAt } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'title is required' });
    }
    const todo = await Todo.create({ title: title.trim(), dueAt });
    return res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
});

// List with filter + pagination (by createdAt)
router.get('/', async (req, res, next) => {
  try {
    const { status, from, to, dueBefore, dueAfter, page = 1, limit = 5 } = req.query;
    const q = {};
    if (status === 'true' || status === 'false') q.status = status === 'true';

    if (from || to) {
      q.createdAt = {};
      if (from) q.createdAt.$gte = new Date(from);
      if (to) q.createdAt.$lte = new Date(to);
    }

    if (dueBefore || dueAfter) {
      q.dueAt = q.dueAt || {};
      if (dueAfter)  q.dueAt.$gte = new Date(dueAfter);
      if (dueBefore) q.dueAt.$lte = new Date(dueBefore);
    }


    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Todo.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Todo.countDocuments(q),
    ]);

    return res.json({
      items,
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
    });
  } catch (err) {
    next(err);
  }
});

// Update (partial)
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, status, dueAt } = req.body;
    const update = {};

    if (title !== undefined) {
      if (!title || !title.trim()) {
        return res.status(400).json({ message: 'title is required' });
      }
      update.title = title.trim();
    }
    if (status !== undefined) update.status = !!status;
    if (dueAt !== undefined) update.dueAt = dueAt;

    const todo = await Todo.findByIdAndUpdate(id, update, { new: true });
    if (!todo) return res.status(404).json({ message: 'not found' });
    return res.json(todo);
  } catch (err) {
    next(err);
  }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Todo.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: 'not found' });
    return res.json({ message: 'deleted' });
  } catch (err) {
    next(err);
  }
});

// Stats (basic + overdue)
router.get('/stats/basic', async (_req, res, next) => {
  try {
    const now = new Date();

    const [total, completed, dueSoon, overdue] = await Promise.all([
      // Tất cả
      Todo.countDocuments({}),
      // Đã hoàn thành
      Todo.countDocuments({ status: true }),
      // Sắp đến hạn trong 7 ngày tới (không phân biệt đã xong hay chưa)
      Todo.countDocuments({
        dueAt: { $gte: now, $lte: new Date(Date.now() + 7 * 24 * 3600 * 1000) },
      }),
      // QUÁ HẠN = chưa hoàn thành và dueAt < hiện tại
      Todo.countDocuments({
        status: false,
        dueAt: { $lt: now },
      }),
    ]);

    const pending = total - completed; // Chưa hoàn thành (kể cả chưa tới hạn)
    return res.json({ total, completed, pending, dueSoon, overdue });
  } catch (err) {
    next(err);
  }
});


export default router;
