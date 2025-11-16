import { useEffect, useState } from 'react'
import GlowingCard from './GlowingCard'

export default function MarketPairs({backend, onSelect}){
  const [pairs, setPairs] = useState([])
  useEffect(()=>{
    let t
    const load = async ()=>{
      try{
        const res = await fetch(`${backend}/api/pairs`)
        const data = await res.json()
        setPairs(data)
      }catch{}
      t = setTimeout(load, 5000)
    }
    load()
    return ()=> clearTimeout(t)
  },[backend])

  return (
    <div className="grid gap-3">
      {pairs.map(p=> (
        <GlowingCard key={p.symbol} className="cursor-pointer" >
          <div onClick={()=> onSelect?.(p.symbol)} className="flex items-center justify-between">
            <div>
              <div className="text-cyan-200 font-semibold">{p.label}</div>
              <div className="text-xs text-cyan-400/80">Session: {p.session} • Strength {p.session_strength}</div>
            </div>
            <div className="flex items-center gap-4">
              <Badge label={p.current_trend} color={p.current_trend==='Bullish'? 'emerald': p.current_trend==='Bearish'? 'rose':'slate'} />
              <Meter label="Volatility" value={p.volatility} />
              <Meter label="Liquidity" value={p.liquidity} />
            </div>
          </div>
        </GlowingCard>
      ))}
    </div>
  )
}

function Badge({label, color='slate'}){
  const map = {
    emerald: 'bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/30',
    rose: 'bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/30',
    slate: 'bg-slate-400/10 text-slate-300 ring-1 ring-slate-400/30',
  }
  return <span className={`text-xs px-2 py-1 rounded ${map[color]}`}>{label}</span>
}

function Meter({label, value}){
  return (
    <div className="w-28">
      <div className="text-[10px] text-cyan-300/70 mb-1">{label}</div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400" style={{width: `${Math.min(100, Math.max(0, value*100)).toFixed(0)}%`}} />
      </div>
    </div>
  )
}
