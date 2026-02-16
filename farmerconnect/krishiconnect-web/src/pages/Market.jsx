import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export default function Market() {
  const [state, setState] = useState('');
  const [commodity, setCommodity] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['market-prices', state, commodity],
    queryFn: () =>
      api.get('/market/prices', {
        params: { state: state || undefined, commodity: commodity || undefined, limit: 50 },
      }).then((r) => r.data),
  });

  const prices = data?.data?.data || data?.data || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Mandi Prices</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="State (e.g. Punjab)"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="input-field max-w-xs"
        />
        <input
          type="text"
          placeholder="Commodity (e.g. wheat)"
          value={commodity}
          onChange={(e) => setCommodity(e.target.value)}
          className="input-field max-w-xs"
        />
      </div>

      {isLoading ? (
        <div className="card animate-pulse h-64" />
      ) : prices.length === 0 ? (
        <div className="card text-center py-12 text-stone-500">
          No price data. Try different filters or add data via Agmarknet API.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-stone-100">
                <th className="text-left p-3">Market</th>
                <th className="text-left p-3">Commodity</th>
                <th className="text-right p-3">Min (₹/q)</th>
                <th className="text-right p-3">Max (₹/q)</th>
                <th className="text-right p-3">Modal (₹/q)</th>
                <th className="text-left p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p) => (
                <tr key={p._id} className="border-b border-stone-200">
                  <td className="p-3">{p.market}</td>
                  <td className="p-3">{p.commodity}</td>
                  <td className="p-3 text-right">{p.minPrice?.toLocaleString()}</td>
                  <td className="p-3 text-right">{p.maxPrice?.toLocaleString()}</td>
                  <td className="p-3 text-right font-medium">{p.modalPrice?.toLocaleString()}</td>
                  <td className="p-3 text-sm text-stone-500">
                    {p.priceDate ? new Date(p.priceDate).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
