import { useEffect, useState } from 'react'
import NeonBackground from './components/NeonBackground'
import GlowingCard from './components/GlowingCard'
import MarketPairs from './components/MarketPairs'
import TimeframeRadials from './components/TimeframeRadials'
import SignalPanel from './components/SignalPanel'

const BACKEND = import.meta.env.VITE_BACKEND_URL || ''

function App() {
  const [symbol, setSymbol] = useState('EURUSD')
  const [interval, setInterval] = useState('1m')

  return (
    <div className="min-h-screen text-cyan-100">
      <NeonBackground />
      <div className="max-w-7xl mx-auto p-6">
        <header className="flex items-center justify-between mb-6">
          <div className="text-xl font-semibold tracking-wide">Manan Trader AI</div>
          <div className="text-xs text-cyan-300/80">Professional • Confident • Precise</div>
        </header>

        <div className="grid md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <div className="mb-2 text-cyan-300 text-sm">Market Pairs</div>
            <MarketPairs backend={BACKEND} onSelect={(s)=> setSymbol(s)} />
          </div>

          <div className="md:col-span-4">
            <div className="mb-2 text-cyan-300 text-sm">Timeframes</div>
            <GlowingCard className="flex items-center justify-center py-8">
              <TimeframeRadials value={interval} onChange={setInterval} backend={BACKEND} />
            </GlowingCard>
          </div>

          <div className="md:col-span-5">
            <div className="mb-2 text-cyan-300 text-sm">Signal Panel</div>
            <SignalPanel backend={BACKEND} symbol={symbol} interval={interval} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
