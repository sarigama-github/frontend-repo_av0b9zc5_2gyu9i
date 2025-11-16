import { useEffect, useState } from 'react'
import GlowingCard from './GlowingCard'

export default function SignalPanel({backend, symbol, interval}){
  const [main, setMain] = useState(null)
  const [future, setFuture] = useState([])
  const [loading, setLoading] = useState(false)
  const [audio] = useState(()=> new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'))

  const load = async ()=>{
    setLoading(true)
    try{
      const [mRes, fRes] = await Promise.all([
        fetch(`${backend}/api/smc-signal?symbol=${encodeURIComponent(symbol)}&interval=${interval}`),
        fetch(`${backend}/api/future-signals?symbol=${encodeURIComponent(symbol)}&interval=${interval}`),
      ])
      const m = await mRes.json(); const f = await fRes.json()
      const changed = !main || m.signal !== main.signal
      setMain(m); setFuture(f)
      if(changed){
        try{ audio.currentTime = 0; audio.play() }catch{}
      }
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{ load(); const t = setInterval(load, 15000); return ()=> clearInterval(t) }, [symbol, interval])

  return (
    <div className="grid gap-3">
      <GlowingCard>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-cyan-300 text-xs">Pair</div>
            <div className="text-cyan-100 font-semibold">{symbol}</div>
          </div>
          <div>
            <div className="text-cyan-300 text-xs">Timeframe</div>
            <div className="text-cyan-100 font-semibold">{interval}</div>
          </div>
          <div className="text-right">
            <div className="text-cyan-300 text-xs">Main Signal</div>
            <div className={`text-2xl font-bold ${main?.signal==='CALL'?'text-emerald-300':'text-rose-300'}`}>{main?.signal || '...'}</div>
            <div className="text-cyan-300/80 text-xs">Confidence {main? main.confidence: '--'}%</div>
          </div>
        </div>
        <div className="mt-2 text-cyan-200/80 text-xs">Reason: {main?.reason || 'Loading...'}</div>
      </GlowingCard>

      <GlowingCard>
        <div className="text-cyan-200 font-semibold mb-2">Future Signals</div>
        <div className="grid gap-2 max-h-72 overflow-auto pr-1">
          {future.map((f, i)=> (
            <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-2 border border-cyan-500/10">
              <div className="text-cyan-100 text-sm">{symbol}</div>
              <div className="text-xs text-cyan-300">{interval}</div>
              <div className={`text-xs font-semibold ${f.side==='CALL'? 'text-emerald-300':'text-rose-300'}`}>{f.side}</div>
              <div className="text-xs text-cyan-300/80">ETA {f.eta_minutes}m</div>
              <div className="text-xs text-cyan-300/80">{(f.confidence*100).toFixed(0)}%</div>
              <div className="text-[10px] text-cyan-400/80">{f.reason}</div>
            </div>
          ))}
        </div>
      </GlowingCard>
    </div>
  )
}
