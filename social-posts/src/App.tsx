import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GrecoCanvas } from './components/GrecoCanvas'
import { VoxelCanvas } from './components/VoxelCanvas'
import { NavyCanvas } from './components/NavyCanvas'

interface SocialPostProps {
  background: React.ReactNode
  headline: React.ReactNode
  headlineSize?: string
  subtext?: string
  buttonLabel?: string
  footerText?: string
}

function SocialPost({ background, headline, headlineSize = 'text-[64px]', subtext, buttonLabel, footerText }: SocialPostProps) {
  const hasExtras = !!(subtext || buttonLabel)
  return (
    <div className="w-[600px] h-[800px] shrink-0 border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col">
      {background}

      <div className="vhs-scanlines" />
      <div className="vhs-noise" />
      <div className="vhs-glitch-bar" />

      <div className={`relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8 ${hasExtras ? '-mt-[160px]' : '-mt-[60px]'}`}>
        <h1 className={`font-serif ${headlineSize} leading-[0.95] tracking-[-2.46px] max-w-[520px] text-white animate-fade-rise rgb-text-glitch`}>
          {headline}
        </h1>

        {subtext && (
          <p className="font-sans text-[17px] text-white/90 mt-8 leading-relaxed max-w-[480px] animate-fade-rise-delay rgb-text-glitch">
            {subtext}
          </p>
        )}

        {buttonLabel && (
          <button className="liquid-glass rounded-full px-14 py-4 text-white text-[15px] font-sans mt-12 hover:scale-[1.03] transition-transform animate-fade-rise-delay-2 tracking-wide cursor-pointer">
            {buttonLabel}
          </button>
        )}
      </div>

      {footerText && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="text-xl tracking-widest text-white/80 font-sans rgb-text-glitch uppercase">
            {footerText}
          </div>
        </div>
      )}
    </div>
  )
}

function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center gap-8 p-8">
      <SocialPost
        background={<GrecoCanvas seed={1} />}
        headline={<>Own a Slice of<br />an Agent's Revenue</>}
        buttonLabel="Begin Journey"
      />
      <SocialPost
        background={<VoxelCanvas seed={42} />}
        headline={<>Capital Formation<br />For Agents</>}
        buttonLabel="Begin Journey"
      />
    </div>
  )
}

function Page1() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center gap-8 p-8">
      <SocialPost
        background={<NavyCanvas seed={3} />}
        headline={<>Staking is Live<br />for $REGENT</>}
        footerText="regents.sh"
      />
      <SocialPost
        background={<VoxelCanvas seed={88} />}
        headline={<>Agent Stablecoin Services are the App Store in 2008</>}
        headlineSize="text-[50px]"
        footerText="regents.sh"
      />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/1" element={<Page1 />} />
      </Routes>
    </BrowserRouter>
  )
}
