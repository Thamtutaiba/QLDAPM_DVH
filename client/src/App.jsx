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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            TaskNest
          </h1>
          <p className="text-slate-600">Quản lý công việc hiệu quả và thông minh</p>
        </div>

      <Stats className="mb-4" />

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-6">
          <div className="grid gap-4">
            <TodoForm onCreate={addTodo} />
            <Filters
              status={status} onStatus={setStatus}
              from={from} onFrom={setFrom}
              to={to} onTo={setTo}
              onApply={() => setPage(1)}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-6">
          <TodoList
            items={items}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onRename={updateTitle}
          />
        </div>

        <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/20">
          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Prev
          </button>
          <span className="text-sm font-medium text-slate-600 bg-white/50 px-4 py-2 rounded-lg">
            Trang {page} / {pages}
          </span>
          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
