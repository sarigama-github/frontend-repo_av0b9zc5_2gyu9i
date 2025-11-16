import { useEffect, useRef } from 'react'

export default function NeonBackground(){
  const ref = useRef(null)
  useEffect(()=>{
    const el = ref.current
    if(!el) return
    let id
    const animate = ()=>{
      const t = Date.now()/1000
      el.style.background = `radial-gradient(1200px 800px at ${50+Math.sin(t*0.2)*20}% ${50+Math.cos(t*0.15)*20}%, rgba(0,200,255,0.18), transparent 60%), radial-gradient(1000px 700px at ${50+Math.cos(t*0.17)*25}% ${50+Math.sin(t*0.22)*25}%, rgba(140,0,255,0.15), transparent 60%)`
      id = requestAnimationFrame(animate)
    }
    id = requestAnimationFrame(animate)
    return ()=> cancelAnimationFrame(id)
  },[])
  return (
    <div ref={ref} className="fixed inset-0 -z-10 bg-[#0b0f17]">
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,255,0.06),rgba(0,0,0,0))]" />
    </div>
  )
}
