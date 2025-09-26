import { useState } from 'react';

export default function TodoForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [dueAt, setDueAt] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) return alert('Vui lòng nhập tiêu đề');
    onCreate(title.trim(), dueAt);
    setTitle(''); setDueAt('');
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Thêm công việc..."
        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      />
      <input
        type="date"
        value={dueAt}
        onChange={(e) => setDueAt(e.target.value)}
        className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      />
      <button
        className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-indigo-700 active:scale-[.98] transition"
      >
        Thêm
      </button>
    </form>
  );
}
