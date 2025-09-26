// client/src/App.jsx
import { useEffect, useMemo, useState } from 'react';
import { api } from './api';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';
import Filters from './components/Filters.jsx';
import Stats from './components/Stats.jsx';

export default function App() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status === 'done');
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    params.set('page', page);
    params.set('limit', limit);
    return params.toString();
  }, [status, from, to, page, limit]);

  async function load() {
    setLoading(true); setError('');
    try {
      const { data } = await api.get(`/todos?${query}`);
      setItems(data.items);
      setPages(data.pages || 1);
    } catch (e) {
      setError(e?.response?.data?.message || 'Load failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [query]);

  async function addTodo(title, dueAt) {
    try {
      await api.post('/todos', { title, dueAt: dueAt || undefined });
      setPage(1); // về trang đầu để thấy item mới
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Create failed');
    }
  }

  async function toggleTodo(id, checked) {
    try {
      await api.patch(`/todos/${id}`, { status: checked });
      await load();
    } catch {
      alert('Update failed');
    }
  }

  async function deleteTodo(id) {
    if (!confirm('Xoá task này?')) return;
    try {
      await api.delete(`/todos/${id}`);
      await load();
    } catch {
      alert('Delete failed');
    }
  }

  async function updateTitle(id, title) {
    try {
      await api.patch(`/todos/${id}`, { title });
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Update failed');
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">TaskNest</h1>

      <Stats className="mb-4" />

      <div className="grid gap-3">
        <TodoForm onCreate={addTodo} />
        <Filters
          status={status} onStatus={setStatus}
          from={from} onFrom={setFrom}
          to={to} onTo={setTo}
          onApply={() => setPage(1)}
        />
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-4">
        <TodoList
          items={items}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onRename={updateTitle}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          className="px-3 py-2 rounded bg-slate-200 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="text-sm text-slate-600">
          Page {page} / {pages}
        </span>
        <button
          className="px-3 py-2 rounded bg-slate-200 disabled:opacity-50"
          disabled={page >= pages}
          onClick={() => setPage((p) => Math.min(pages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
