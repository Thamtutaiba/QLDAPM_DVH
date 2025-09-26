import { useState } from 'react';

export default function TodoList({ items, onToggle, onDelete, onRename }) {
  if (!items?.length) return <div className="p-4 text-slate-500">Không có dữ liệu</div>;

  return (
    <ul className="divide-y divide-slate-200">
      {items.map((t) => (
        <TodoRow key={t._id} todo={t} onToggle={onToggle} onDelete={onDelete} onRename={onRename} />
      ))}
    </ul>
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
    <li className={`flex items-center gap-3 p-3 hover:bg-slate-50 transition ${isOverdue ? 'bg-rose-50' : ''}`}>
      <input
        type="checkbox"
        checked={todo.status}
        onChange={(e) => onToggle(todo._id, e.target.checked)}
        className="size-4 accent-indigo-600"
      />

      {editing ? (
        <input
          className="flex-1 px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          autoFocus
        />
      ) : (
        <span className={`flex-1 ${todo.status ? 'line-through text-slate-400' : (isOverdue ? 'text-rose-700' : 'text-slate-800')}`}>
          {todo.title}
        </span>
      )}

      <div className="text-sm text-slate-500 hidden sm:block w-40 text-right">
        {todo.dueAt ? (
          <div className="inline-flex items-center gap-2 justify-end w-full">
            <span>{new Date(todo.dueAt).toLocaleDateString()}</span>
            {isOverdue && (
              <span className="px-2 py-[2px] rounded-full bg-rose-600 text-white text-[10px] font-semibold uppercase">Overdue</span>
            )}
          </div>
        ) : '—'}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="px-2 py-1 text-sm rounded-md bg-slate-200 hover:bg-slate-300 transition"
          onClick={() => setEditing((s) => !s)}
        >
          {editing ? 'Huỷ' : 'Sửa'}
        </button>
        <button
          className="px-2 py-1 text-sm rounded-md bg-rose-500 text-white hover:bg-rose-600 active:scale-[.98] transition"
          onClick={() => onDelete(todo._id)}
        >
          Xoá
        </button>
      </div>
    </li>
  );
}
