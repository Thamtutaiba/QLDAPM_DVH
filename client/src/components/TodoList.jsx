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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((t) => (
        <TodoCard key={t._id} todo={t} onToggle={onToggle} onDelete={onDelete} onRename={onRename} />
      ))}
    </div>
  );
}

function TodoCard({ todo, onToggle, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.title);
  const isOverdue = (() => {
    if (todo.status) return false;
    if (!todo.dueAt) return false;
    const due = new Date(todo.dueAt);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return due < startOfToday;
  })();

  const priorityColors = {
    low: {
      bg: 'bg-gradient-to-br from-slate-50 to-slate-100',
      border: 'border-slate-200 hover:border-slate-300',
      text: 'text-slate-700',
      badge: 'bg-green-500 text-white'
    },
    medium: {
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      border: 'border-blue-200 hover:border-blue-300',
      text: 'text-blue-800',
      badge: 'bg-blue-500 text-white'
    },
    high: {
      bg: 'bg-gradient-to-br from-red-50 to-rose-50',
      border: 'border-red-200 hover:border-red-300',
      text: 'text-red-800',
      badge: 'bg-red-500 text-white'
    }
  };

  const priorityLabels = {
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao'
  };

  const colors = priorityColors[todo.priority] || priorityColors.medium;
  
  // Debug: log priority để kiểm tra
  console.log('Todo priority:', todo.priority, 'Colors:', colors);

  function save() {
    const v = value.trim();
    if (!v) return alert('Tiêu đề không được rỗng');
    onRename(todo._id, v);
    setEditing(false);
  }

  return (
    <div className={`group relative p-4 rounded-xl transition-all duration-300 hover:shadow-lg border-2 ${colors.bg} ${colors.border} ${
      todo.status ? 'opacity-75' : ''
    }`}>
      {/* Priority Badge */}
      <div className="absolute top-2 right-2">
        <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm ${colors.badge}`}>
          {priorityLabels[todo.priority] || 'Trung bình'}
        </span>
      </div>

      {/* Checkbox */}
      <div className="flex items-start gap-3 mb-3">
        <input
          type="checkbox"
          checked={todo.status}
          onChange={(e) => onToggle(todo._id, e.target.checked)}
          className="size-5 accent-indigo-600 rounded cursor-pointer mt-1"
        />
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white text-sm"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={save}
              onKeyDown={(e) => e.key === 'Enter' && save()}
              autoFocus
            />
          ) : (
            <h3 className={`font-medium text-sm leading-tight ${colors.text} ${
              todo.status ? 'line-through opacity-60' : ''
            }`}>
              {todo.title}
            </h3>
          )}
        </div>
      </div>

      {/* Due Date */}
      <div className="mb-3">
        {todo.dueAt ? (
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-white/70 rounded-full text-xs font-medium text-slate-600">
              📅 {new Date(todo.dueAt).toLocaleDateString()}
            </span>
            {isOverdue && (
              <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-semibold animate-pulse">
                🚨 Quá hạn
              </span>
            )}
          </div>
        ) : (
          <span className="px-2 py-1 bg-white/70 rounded-full text-xs text-slate-400">
            Không hạn
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          className="flex-1 px-2 py-1 text-xs rounded-lg bg-white/80 text-slate-600 hover:bg-white transition-all duration-200 shadow-sm"
          onClick={() => setEditing((s) => !s)}
        >
          {editing ? '❌ Huỷ' : '✏️ Sửa'}
        </button>
        <button
          className="flex-1 px-2 py-1 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all duration-200 shadow-sm"
          onClick={() => onDelete(todo._id)}
        >
          🗑️ Xoá
        </button>
      </div>
    </div>
  );
}
