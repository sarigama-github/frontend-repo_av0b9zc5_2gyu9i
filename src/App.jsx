import { useEffect, useMemo, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || ''

function Number({label, value}){
  return (
    <div className="flex flex-col items-start bg-white/60 rounded p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}

function App() {
  const [symbol, setSymbol] = useState('BTCUSDT')
  const [interval, setInterval] = useState('5m')
  const [emaPeriod, setEmaPeriod] = useState(20)
  const [rsiPeriod, setRsiPeriod] = useState(14)
  const [volMult, setVolMult] = useState(1.5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signal, setSignal] = useState(null)
  const [history, setHistory] = useState([])

  const fetchSignal = async () => {
    setLoading(true); setError('')
    try{
      const url = `${BACKEND}/api/signal?symbol=${encodeURIComponent(symbol)}&interval=${interval}&ema_period=${emaPeriod}&rsi_period=${rsiPeriod}&volume_multiplier=${volMult}`
      const res = await fetch(url)
      if(!res.ok) throw new Error('Failed to fetch signal')
      const data = await res.json()
      setSignal(data)
    }catch(e){
      setError(e.message)
    }finally{
      setLoading(false)
    }
  }

  const saveSignal = async () => {
    if(!signal) return
    try{
      const res = await fetch(`${BACKEND}/api/signal/save`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          symbol: signal.symbol,
          interval: signal.interval,
          side: signal.side,
          confidence: signal.confidence,
          reason: signal.reason,
          strategy_name: 'EMA+RSI+VOL',
          indicators: signal.indicators,
        })
      })
      if(!res.ok) throw new Error('Failed to save')
      await loadHistory()
    }catch(e){
      alert(e.message)
    }
  }

  const loadHistory = async () => {
    try{
      const res = await fetch(`${BACKEND}/api/signal/history?symbol=${encodeURIComponent(symbol)}`)
      if(!res.ok) throw new Error('Failed to load history')
      const data = await res.json()
      setHistory(data)
    }catch(e){
      console.error(e)
    }
  }

  useEffect(()=>{ loadHistory() },[])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Binary Trading Signal Dashboard</h1>
        <div className="grid md:grid-cols-5 gap-3 mb-4">
          <input className="border rounded p-2" value={symbol} onChange={e=>setSymbol(e.target.value.toUpperCase())} placeholder="Symbol e.g. BTCUSDT" />
          <select className="border rounded p-2" value={interval} onChange={e=>setInterval(e.target.value)}>
            {['1m','3m','5m','15m','30m','1h','4h'].map(i=> <option key={i}>{i}</option>)}
          </select>
          <input type="number" className="border rounded p-2" value={emaPeriod} onChange={e=>setEmaPeriod(+e.target.value)} />
          <input type="number" className="border rounded p-2" value={rsiPeriod} onChange={e=>setRsiPeriod(+e.target.value)} />
          <input type="number" step="0.1" className="border rounded p-2" value={volMult} onChange={e=>setVolMult(+e.target.value)} />
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={fetchSignal} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>{loading? 'Calculating...' : 'Get Signal'}</button>
          <button onClick={saveSignal} className="bg-emerald-600 text-white px-4 py-2 rounded" disabled={!signal}>Save to History</button>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

        {signal && (
          <div className="bg-white rounded shadow p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`text-sm font-semibold px-3 py-1 rounded-full ${signal.side==='BUY'?'bg-emerald-100 text-emerald-700': signal.side==='SELL'? 'bg-rose-100 text-rose-700':'bg-slate-100 text-slate-700'}`}>{signal.side}</div>
              <div className="text-sm text-slate-600">Confidence: {(signal.confidence*100).toFixed(0)}%</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Number label="Price" value={signal.indicators.close.toFixed(2)} />
              <Number label="EMA" value={signal.indicators.ema.toFixed(2)} />
              <Number label="RSI" value={signal.indicators.rsi.toFixed(1)} />
              <Number label="Volume" value={signal.indicators.volume.toFixed(2)} />
              <Number label="Avg Vol" value={signal.indicators.avg_volume.toFixed(2)} />
            </div>
            <div className="text-sm text-slate-600 mt-3">{signal.reason}</div>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-2">Saved Signals</h2>
        <div className="grid gap-2">
          {history.map((h,i)=> (
            <div key={i} className="bg-white rounded border p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${h.side==='BUY'?'bg-emerald-100 text-emerald-700': h.side==='SELL'? 'bg-rose-100 text-rose-700':'bg-slate-100 text-slate-700'}`}>{h.side}</span>
                <span className="text-sm text-slate-700">{h.symbol} • {h.interval}</span>
              </div>
              <div className="text-xs text-slate-500">{new Date(h.at || h._created_at || Date.now()).toLocaleString()}</div>
            </div>
          ))}
          {history.length===0 && <div className="text-slate-500 text-sm">No saved signals yet.</div>}
        </div>
      </div>
    </div>
  )
}

export default App
