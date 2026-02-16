import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export default function Weather() {
  const [state, setState] = useState('Punjab');
  const [district, setDistrict] = useState('Ludhiana');

  const { data, isLoading } = useQuery({
    queryKey: ['weather', state, district],
    queryFn: () =>
      api.get('/weather/current', { params: { state, district } }).then((r) => r.data),
  });

  const weather = data?.data?.data || data?.data;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Weather</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="input-field max-w-xs"
        />
        <input
          type="text"
          placeholder="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="input-field max-w-xs"
        />
      </div>

      {isLoading ? (
        <div className="card animate-pulse h-48" />
      ) : !weather ? (
        <div className="card text-center py-12 text-stone-500">
          No weather data. Configure OpenWeather API for live data.
        </div>
      ) : (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">
            {weather.location?.state}, {weather.location?.district}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-stone-500 text-sm">Temperature</p>
              <p className="text-2xl font-bold">{weather.current?.temperature}°C</p>
            </div>
            <div>
              <p className="text-stone-500 text-sm">Feels Like</p>
              <p className="text-2xl font-bold">{weather.current?.feelsLike}°C</p>
            </div>
            <div>
              <p className="text-stone-500 text-sm">Humidity</p>
              <p className="text-xl font-medium">{weather.current?.humidity}%</p>
            </div>
            <div>
              <p className="text-stone-500 text-sm">Condition</p>
              <p className="text-xl font-medium">{weather.current?.condition || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
