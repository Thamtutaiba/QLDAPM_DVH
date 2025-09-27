export default function Filters({ status, onStatus, from, onFrom, to, onTo, onApply }) {
  const inputCls = "px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200";

  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_1fr_auto] gap-4 items-end">
      <div className="grid">
        <label className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
          🔍 Trạng thái
        </label>
        <select className={inputCls} value={status} onChange={(e) => onStatus(e.target.value)}>
          <option value="all">📋 Tất cả</option>
          <option value="todo">⏳ Chưa làm</option>
          <option value="done">✅ Hoàn thành</option>
        </select>
      </div>

      <div className="grid">
        <label className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
          📅 Từ ngày
        </label>
        <input type="date" className={inputCls} value={from} onChange={(e) => onFrom(e.target.value)} />
      </div>

      <div className="grid">
        <label className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
          📅 Đến ngày
        </label>
        <input type="date" className={inputCls} value={to} onChange={(e) => onTo(e.target.value)} />
      </div>

      <button
        className="h-12 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
        onClick={onApply}
      >
        🎯 Áp dụng
      </button>
    </div>
  );
}
