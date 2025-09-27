import { useState } from 'react';

export default function TodoForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [priority, setPriority] = useState('medium');

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) return alert('Vui lòng nhập tiêu đề');
    onCreate(title.trim(), dueAt, priority);
    setTitle(''); setDueAt(''); setPriority('medium');
  }

  return (
    <form onSubmit={submit} className="flex gap-2 flex-wrap">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Thêm công việc..."
        className="flex-1 min-w-64 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      />
      <input
        type="date"
        value={dueAt}
        onChange={(e) => setDueAt(e.target.value)}
        className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <option value="low">Thấp</option>
        <option value="medium">Trung bình</option>
        <option value="high">Cao</option>
      </select>
      <button
        className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-indigo-700 active:scale-[.98] transition"
      >
        Thêm
      </button>
    </form>
  );
}
