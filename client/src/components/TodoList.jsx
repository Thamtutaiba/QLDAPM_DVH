import { useState } from 'react';

export default function TodoList({ items, onToggle, onDelete, onRename }) {
  if (!items?.length) return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📝</div>
      <div className="text-slate-500 text-lg">Chưa có công việc nào</div>
      <div className="text-slate-400 text-sm mt-2">Hãy thêm công việc đầu tiên của bạn!</div>
    </div>
  );

  return (
    <div className="space-y-3">
      {items.map((t) => (
        <TodoRow key={t._id} todo={t} onToggle={onToggle} onDelete={onDelete} onRename={onRename} />
      ))}
    </div>
  );
}

function TodoRow({ todo, onToggle, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.title);
  const isOverdue = (() => {
    if (todo.status) return false;
    if (!todo.dueAt) return false;
    const due = new Date(todo.dueAt);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return due < startOfToday; // chỉ quá hạn nếu trước hôm nay, cùng ngày không tính
  })();

  function save() {
    const v = value.trim();
    if (!v) return alert('Tiêu đề không được rỗng');
    onRename(todo._id, v);
    setEditing(false);
  }

  return (
    <div className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:shadow-md border ${
      isOverdue 
        ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 hover:border-red-300' 
        : todo.status 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300'
          : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
    }`}>
      <div className="flex-shrink-0">
        <input
          type="checkbox"
          checked={todo.status}
          onChange={(e) => onToggle(todo._id, e.target.checked)}
          className="size-5 accent-indigo-600 rounded cursor-pointer"
        />
      </div>

      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => e.key === 'Enter' && save()}
            autoFocus
          />
        ) : (
          <span className={`block text-lg font-medium ${
            todo.status 
              ? 'line-through text-slate-400' 
              : isOverdue 
                ? 'text-red-700' 
                : 'text-slate-800'
          }`}>
            {todo.title}
          </span>
        )}
      </div>

      <div className="flex-shrink-0 text-sm text-slate-500 hidden sm:block">
        {todo.dueAt ? (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">
              📅 {new Date(todo.dueAt).toLocaleDateString()}
            </span>
            {isOverdue && (
              <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-semibold animate-pulse">
                🚨 Quá hạn
              </span>
            )}
          </div>
        ) : (
          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-400">
            Không hạn
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          className="px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 shadow-sm"
          onClick={() => setEditing((s) => !s)}
        >
          {editing ? '❌ Huỷ' : '✏️ Sửa'}
        </button>
        <button
          className="px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 active:scale-95 transition-all duration-200 shadow-sm"
          onClick={() => onDelete(todo._id)}
        >
          🗑️ Xoá
        </button>
      </div>
    </div>
  );
}
