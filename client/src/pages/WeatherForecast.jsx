import { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudSun, faTemperatureHigh, faDroplet, faWind,
  faEye, faCompass, faSun, faMoon, faCloudRain,
  faSnowflake, faBolt, faSmog, faCloudShowersHeavy,
  faLocationDot, faCalendarDays, faArrowUp, faArrowDown,
  faChartLine, faExclamationTriangle, faUmbrella,
  faLeaf, faGauge
} from '@fortawesome/free-solid-svg-icons';

// ── Mock weather generation ──────────────────────────────────────────────────
const CONDITIONS = [
  { id: 'sunny', label: 'Sunny', icon: faSun, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'partly_cloudy', label: 'Partly Cloudy', icon: faCloudSun, color: 'text-sky-500', bg: 'bg-sky-50' },
  { id: 'cloudy', label: 'Cloudy', icon: faSmog, color: 'text-slate-500', bg: 'bg-slate-100' },
  { id: 'rainy', label: 'Rainy', icon: faCloudRain, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'thunderstorm', label: 'Thunderstorm', icon: faBolt, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'heavy_rain', label: 'Heavy Rain', icon: faCloudShowersHeavy, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

const rand = (min, max) => Math.round((Math.random() * (max - min) + min) * 10) / 10;
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateHourly = () => {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => {
    const h = new Date(now);
    h.setHours(now.getHours() + i, 0, 0, 0);
    const isDay = h.getHours() >= 6 && h.getHours() < 19;
    const condIdx = i < 6 ? 0 : i < 12 ? 1 : i < 16 ? randInt(0, 2) : randInt(2, 4);
    return {
      time: h, temp: rand(isDay ? 28 : 22, isDay ? 36 : 27),
      feelsLike: rand(isDay ? 30 : 23, isDay ? 39 : 28),
      humidity: randInt(isDay ? 45 : 65, isDay ? 70 : 90),
      windSpeed: rand(5, 25), windDir: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][randInt(0, 7)],
      precipitation: condIdx >= 3 ? rand(1, 15) : 0,
      condition: CONDITIONS[Math.min(condIdx, CONDITIONS.length - 1)],
      uv: isDay ? randInt(3, 11) : 0,
      visibility: rand(5, 15),
      pressure: randInt(1005, 1018),
      dewPoint: rand(18, 24),
    };
  });
};

const generate14Day = () => {
  const today = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i);
    const condIdx = randInt(0, 5);
    return {
      date: d, high: rand(30, 38), low: rand(20, 26),
      condition: CONDITIONS[condIdx],
      precipitation: condIdx >= 3 ? rand(5, 45) : rand(0, 5),
      precipChance: condIdx >= 3 ? randInt(50, 95) : randInt(5, 30),
      humidity: randInt(50, 85), windSpeed: rand(8, 22),
      sunrise: '05:48', sunset: '18:52',
    };
  });
};

const LOCATIONS = ['DIT Pune', 'Baramati, Maharashtra', 'Nashik, Maharashtra', 'Ludhiana, Punjab', 'Varanasi, UP'];

const UVLabel = (uv) => uv <= 2 ? 'Low' : uv <= 5 ? 'Moderate' : uv <= 7 ? 'High' : uv <= 10 ? 'Very High' : 'Extreme';
const UVColor = (uv) => uv <= 2 ? 'text-green-600' : uv <= 5 ? 'text-yellow-600' : uv <= 7 ? 'text-orange-600' : 'text-red-600';

const WeatherForecast = () => {
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [view, setView] = useState('hourly'); // hourly | daily
  const hourly = useMemo(generateHourly, [location]);
  const daily = useMemo(generate14Day, [location]);
  const current = hourly[0];

  // farming alerts
  const alerts = useMemo(() => {
    const a = [];
    const heavyRainDays = daily.filter(d => d.precipitation > 20);
    if (heavyRainDays.length) a.push({ type: 'warning', icon: faUmbrella, text: `Heavy rain expected on ${heavyRainDays.length} day(s) in the next 14 days. Ensure drainage channels are clear.` });
    const hotDays = daily.filter(d => d.high > 36);
    if (hotDays.length) a.push({ type: 'caution', icon: faTemperatureHigh, text: `${hotDays.length} day(s) above 36°C forecast. Consider irrigation scheduling in early morning or evening.` });
    const humidDays = daily.filter(d => d.humidity > 80);
    if (humidDays.length) a.push({ type: 'info', icon: faLeaf, text: `High humidity (>80%) on ${humidDays.length} day(s). Watch for fungal infections on crops.` });
    if (!a.length) a.push({ type: 'info', icon: faSun, text: 'Weather looks favorable for farming activities this week.' });
    return a;
  }, [daily]);

  const fmtHour = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const fmtDay = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtDayShort = (d) => d.toLocaleDateString('en-IN', { weekday: 'short' });

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">

      {/* ── Hero Current Weather ── */}
      <section className="rounded-2xl overflow-hidden shadow-xl relative" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #115e59 40%, #134e4a 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z\' fill=\'%23ffffff\' fill-opacity=\'0.15\'/%3E%3C/svg%3E")' }} />
        <div className="relative p-6 md:p-8">
          {/* Location + Date */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-3">
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="bg-white/15 backdrop-blur-sm text-white border border-white/20 rounded-xl px-3 py-2 text-sm font-medium outline-none"
              >
                {LOCATIONS.map(l => <option key={l} value={l} className="text-slate-800">{l}</option>)}
              </select>
              <div className="flex items-center gap-1.5 text-teal-200 text-sm">
                <FontAwesomeIcon icon={faCalendarDays} className="text-xs" />
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Main Weather */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center gap-5 mb-4">
                <FontAwesomeIcon icon={current.condition.icon} className="text-6xl text-white drop-shadow-lg" />
                <div>
                  <p className="text-7xl font-bold text-white tracking-tight">{Math.round(current.temp)}°</p>
                  <p className="text-teal-200 text-sm mt-1">Feels like {Math.round(current.feelsLike)}°C</p>
                </div>
              </div>
              <p className="text-xl text-white font-medium">{current.condition.label}</p>
              <p className="text-sm text-teal-200 mt-1">Dew Point: {current.dewPoint}°C · Pressure: {current.pressure} hPa</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: faDroplet, label: 'Humidity', value: `${current.humidity}%`, color: 'text-blue-300' },
                { icon: faWind, label: 'Wind', value: `${current.windSpeed} km/h ${current.windDir}`, color: 'text-cyan-300' },
                { icon: faEye, label: 'Visibility', value: `${current.visibility} km`, color: 'text-teal-300' },
                { icon: faSun, label: 'UV Index', value: `${current.uv} (${UVLabel(current.uv)})`, color: 'text-amber-300' },
                { icon: faCloudRain, label: 'Rain', value: `${current.precipitation} mm`, color: 'text-indigo-300' },
                { icon: faGauge, label: 'Pressure', value: `${current.pressure} hPa`, color: 'text-emerald-300' },
              ].map(item => (
                <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="flex items-center gap-1.5 mb-1">
                    <FontAwesomeIcon icon={item.icon} className={`text-xs ${item.color}`} />
                    <span className="text-xs text-teal-200">{item.label}</span>
                  </div>
                  <p className="text-white font-semibold text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sunrise / Sunset */}
          <div className="mt-6 flex gap-6 text-sm text-teal-200">
            <span><FontAwesomeIcon icon={faSun} className="text-amber-400 mr-1.5" />Sunrise: 05:48 AM</span>
            <span><FontAwesomeIcon icon={faMoon} className="text-indigo-300 mr-1.5" />Sunset: 18:52 PM</span>
          </div>
        </div>
      </section>

      {/* ── Farming Alerts ── */}
      <section className="space-y-2">
        {alerts.map((a, i) => (
          <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${
            a.type === 'warning' ? 'bg-amber-50 border-amber-200' :
            a.type === 'caution' ? 'bg-red-50 border-red-200' :
            'bg-emerald-50 border-emerald-200'
          }`}>
            <FontAwesomeIcon icon={a.icon} className={`mt-0.5 ${
              a.type === 'warning' ? 'text-amber-600' : a.type === 'caution' ? 'text-red-600' : 'text-emerald-600'
            }`} />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {a.type === 'warning' ? '⚠️ Weather Alert' : a.type === 'caution' ? '🔴 Heat Advisory' : '🌱 Farming Tip'}
              </p>
              <p className="text-sm text-slate-600 mt-0.5">{a.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Tab Switch ── */}
      <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1 w-fit">
        {[
          { id: 'hourly', label: '24-Hour Forecast' },
          { id: 'daily', label: '14-Day Forecast' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === tab.id
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Hourly Forecast ── */}
      {view === 'hourly' && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">24-Hour Forecast</h2>
            <span className="text-xs text-slate-400">Updated just now</span>
          </div>
          <div className="overflow-x-auto">
            <div className="flex min-w-max">
              {hourly.map((h, i) => {
                const isNow = i === 0;
                return (
                  <div key={i} className={`flex flex-col items-center py-5 px-4 border-r border-slate-50 min-w-[80px] hover:bg-slate-50 transition ${isNow ? 'bg-emerald-50' : ''}`}>
                    <span className={`text-xs font-medium mb-2 ${isNow ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {isNow ? 'Now' : fmtHour(h.time)}
                    </span>
                    <FontAwesomeIcon icon={h.condition.icon} className={`text-xl mb-2 ${h.condition.color}`} />
                    <span className="text-sm font-bold text-slate-800">{Math.round(h.temp)}°</span>
                    <div className="flex items-center gap-1 mt-2">
                      <FontAwesomeIcon icon={faDroplet} className="text-[9px] text-blue-400" />
                      <span className="text-[11px] text-slate-500">{h.humidity}%</span>
                    </div>
                    {h.precipitation > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <FontAwesomeIcon icon={faCloudRain} className="text-[9px] text-blue-500" />
                        <span className="text-[11px] text-blue-600 font-medium">{h.precipitation}mm</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <FontAwesomeIcon icon={faWind} className="text-[9px] text-slate-400" />
                      <span className="text-[11px] text-slate-500">{Math.round(h.windSpeed)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 14-Day Forecast ── */}
      {view === 'daily' && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">14-Day Forecast</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {daily.map((d, i) => {
              const isToday = i === 0;
              const tempRange = d.high - d.low;
              const barWidth = Math.min((tempRange / 20) * 100, 100);
              return (
                <div key={i} className={`flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition ${isToday ? 'bg-emerald-50/50' : ''}`}>
                  <div className="w-20 shrink-0">
                    <p className={`text-sm font-semibold ${isToday ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {isToday ? 'Today' : fmtDayShort(d.date)}
                    </p>
                    <p className="text-xs text-slate-400">{d.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <FontAwesomeIcon icon={d.condition.icon} className={`text-lg w-6 ${d.condition.color}`} />
                  <div className="w-24 shrink-0 text-xs text-slate-600 hidden sm:block">{d.condition.label}</div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm text-blue-600 font-medium w-10 text-right">{Math.round(d.low)}°</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${barWidth}%`,
                          background: `linear-gradient(90deg, #60a5fa, #f59e0b, #ef4444)`,
                          marginLeft: `${((d.low - 18) / 24) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-red-500 font-medium w-10">{Math.round(d.high)}°</span>
                  </div>
                  <div className="hidden md:flex items-center gap-3 shrink-0 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><FontAwesomeIcon icon={faUmbrella} className="text-blue-400" />{d.precipChance}%</span>
                    <span className="flex items-center gap-1"><FontAwesomeIcon icon={faDroplet} className="text-blue-400" />{d.humidity}%</span>
                    <span className="flex items-center gap-1"><FontAwesomeIcon icon={faWind} className="text-slate-400" />{Math.round(d.windSpeed)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Weekly Precipitation Summary ── */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Weekly Precipitation Summary</h2>
        <div className="grid grid-cols-7 gap-2">
          {daily.slice(0, 7).map((d, i) => {
            const maxPrecip = Math.max(...daily.slice(0, 7).map(x => x.precipitation), 1);
            const barH = Math.max((d.precipitation / maxPrecip) * 100, 4);
            return (
              <div key={i} className="flex flex-col items-center">
                <div className="h-28 w-full flex items-end justify-center mb-2">
                  <div
                    className="w-8 rounded-t-lg transition-all"
                    style={{
                      height: `${barH}%`,
                      background: d.precipitation > 20 ? 'linear-gradient(180deg, #3b82f6, #1d4ed8)' :
                        d.precipitation > 10 ? 'linear-gradient(180deg, #60a5fa, #3b82f6)' :
                        'linear-gradient(180deg, #93c5fd, #60a5fa)'
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-blue-600">{d.precipitation > 0 ? `${Math.round(d.precipitation)}mm` : '—'}</span>
                <span className="text-[11px] text-slate-500 mt-1">{fmtDayShort(d.date)}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <span>Total: <strong className="text-slate-800">{Math.round(daily.slice(0, 7).reduce((s, d) => s + d.precipitation, 0))} mm</strong></span>
          <span>Avg: <strong className="text-slate-800">{Math.round(daily.slice(0, 7).reduce((s, d) => s + d.precipitation, 0) / 7)} mm/day</strong></span>
          <span>Rainy Days: <strong className="text-slate-800">{daily.slice(0, 7).filter(d => d.precipitation > 5).length}</strong></span>
        </div>
      </section>

      {/* ── Agricultural Weather Advisory ── */}
      <section className="grid md:grid-cols-3 gap-4">
        {[
          {
            icon: faLeaf, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200',
            title: 'Crop Suitability',
            text: current.humidity > 70 ? 'High humidity — favorable for rice transplanting. Monitor fungal disease risk.' : 'Moderate conditions — suitable for most agricultural operations.',
          },
          {
            icon: faDroplet, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
            title: 'Irrigation Advisory',
            text: current.temp > 34 ? 'High evapotranspiration expected. Schedule irrigation in early morning (5–7 AM) or evening.' : 'Normal evapotranspiration. Standard irrigation schedule is adequate.',
          },
          {
            icon: faExclamationTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
            title: 'Spray Advisory',
            text: current.windSpeed > 15 ? `Wind speed ${current.windSpeed} km/h — avoid pesticide spraying. Wait for calmer conditions.` : 'Wind conditions suitable for pesticide/fertilizer spraying.',
          }
        ].map((card, i) => (
          <div key={i} className={`rounded-xl p-5 border ${card.bg} ${card.border}`}>
            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={card.icon} className={card.color} />
              <h3 className="font-bold text-slate-800 text-sm">{card.title}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{card.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default WeatherForecast;
