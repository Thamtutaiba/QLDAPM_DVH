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

const items = [
  { 
    key: 'total', 
    label: 'TOTAL', 
    icon: '📊',
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  { 
    key: 'completed', 
    label: 'COMPLETED', 
    icon: '✅',
    gradient: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  },
  { 
    key: 'pending', 
    label: 'PENDING', 
    icon: '⏳',
    gradient: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600'
  },
  { 
    key: 'dueSoon', 
    label: 'DUESOON', 
    icon: '⏰',
    gradient: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600'
  },
  { 
    key: 'overdue', 
    label: 'OVERDUE', 
    icon: '🚨',
    gradient: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600'
  },
];



  return (
    <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 ${className}`}>
      {items.map(({ key, label, icon, gradient, bgColor, textColor }) => (
        <div key={key}
          className={`rounded-2xl ${bgColor} p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`text-xs font-semibold tracking-wide ${textColor}`}>{label}</div>
            <div className="text-lg">{icon}</div>
          </div>
          <div className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {data[key] ?? 0}
          </div>
        </div>
      ))}
      {error && <div className="col-span-full text-sm text-rose-600 bg-red-50 p-3 rounded-lg">{error}</div>}
    </div>
  );
}
