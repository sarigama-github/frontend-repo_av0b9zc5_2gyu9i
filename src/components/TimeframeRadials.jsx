import { useEffect, useState } from 'react'

const options = [
  {label:'1-Minute', value:'1m'},
  {label:'2-Minutes', value:'2m'},
  {label:'5-Minutes', value:'5m'},
]

export default function TimeframeRadials({value, onChange, backend}){
  const [remaining, setRemaining] = useState(60)

  useEffect(()=>{
    let timer
    const tick = async ()=>{
      try{
        const res = await fetch(`${backend}/api/time/next_close?interval=${value}`)
        const data = await res.json()
        setRemaining(data.seconds_remaining)
      }catch{}
      timer = setTimeout(tick, 1000)
    }
    tick()
    return ()=> clearTimeout(timer)
  },[value, backend])

  return (
    <div className="flex items-center gap-4">
      {options.map(o=>{
        const active = o.value===value
        return (
          <button key={o.value} onClick={()=>onChange(o.value)} className={`relative w-24 h-24 rounded-full grid place-items-center transition-all duration-300 ${active? 'scale-105':''}`}>
            <span className={`absolute inset-0 rounded-full ${active? 'bg-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,.35)]': 'bg-white/5'}`}></span>
            <span className={`absolute -inset-1 rounded-full ${active? 'bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30 blur-xl':''}`}></span>
            <span className="relative text-xs text-cyan-100 text-center px-2">{o.label}</span>
          </button>
        )
      })}
      <div className="ml-4 text-cyan-300 text-sm">Next close in: <span className="font-mono">{remaining}s</span></div>
    </div>
  )
}
