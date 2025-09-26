import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Stats({ className = '' }) {
  const [data, setData] = useState({ total: 0, completed: 0, pending: 0, dueSoon: 0 });
  const [error, setError] = useState('');

  async function load() {
    try {
      const res = await api.get('/todos/stats/basic');
      setData(res.data);
    } catch {
      setError('Không tải được thống kê');
    }
  }
  useEffect(() => { load(); }, []);

// ...
const items = [
  { key: 'total', label: 'TOTAL' },
  { key: 'completed', label: 'COMPLETED' },
  { key: 'pending', label: 'PENDING' },
  { key: 'dueSoon', label: 'DUESOON' },
  { key: 'overdue', label: 'OVERDUE' }, // <-- thêm dòng này
];



  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
      {items.map(({ key, label }) => (
        <div key={key}
          className="rounded-2xl bg-white/80 backdrop-blur p-4 shadow-sm ring-1 ring-slate-200">
          <div className="text-xs font-semibold tracking-wide text-slate-500">{label}</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">{data[key] ?? 0}</div>
        </div>
      ))}
      {error && <div className="col-span-full text-sm text-rose-600">{error}</div>}
    </div>
  );
}
