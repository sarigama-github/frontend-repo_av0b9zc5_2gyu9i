export default function GlowingCard({children, className=''}){
  return (
    <div className={`relative rounded-xl p-4 bg-[#0e1422]/60 border border-cyan-500/20 shadow-[0_0_0_1px_rgba(56,189,248,.15)] before:absolute before:inset-0 before:-z-10 before:rounded-xl before:blur-2xl before:bg-gradient-to-r before:from-cyan-500/20 before:to-fuchsia-500/20 ${className}`}>
      {children}
    </div>
  )
}
