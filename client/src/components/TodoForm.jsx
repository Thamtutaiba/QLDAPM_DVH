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
    <form onSubmit={submit} className="flex gap-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="✨ Thêm công việc mới..."
        className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200"
      />
      <input
        type="date"
        value={dueAt}
        onChange={(e) => setDueAt(e.target.value)}
        className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200"
      />
      <button
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
      >
        ➕ Thêm
      </button>
    </form>
  );
}
