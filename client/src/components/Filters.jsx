export default function Filters({ status, onStatus, from, onFrom, to, onTo, onApply }) {
  const inputCls = "px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50";

  return (
    <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_1fr_auto] gap-2 items-end">
      <div className="grid">
        <label className="text-xs text-slate-500 mb-1">Trạng thái</label>
        <select className={inputCls} value={status} onChange={(e) => onStatus(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="todo">Chưa làm</option>
          <option value="done">Hoàn thành</option>
        </select>
      </div>

      <div className="grid">
        <label className="text-xs text-slate-500 mb-1">Từ ngày</label>
        <input type="date" className={inputCls} value={from} onChange={(e) => onFrom(e.target.value)} />
      </div>

      <div className="grid">
        <label className="text-xs text-slate-500 mb-1">Đến ngày</label>
        <input type="date" className={inputCls} value={to} onChange={(e) => onTo(e.target.value)} />
      </div>

      <button
        className="h-10 px-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        onClick={onApply}
      >
        Áp dụng
      </button>
    </div>
  );
}
