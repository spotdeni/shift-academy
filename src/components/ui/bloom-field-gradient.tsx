export function GradientBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className} style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#f7f5ee', backgroundImage: "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.45'/></svg>\"), radial-gradient(ellipse 92% 46% at 50% 101%, rgba(75,30,242,.98) 0%, rgba(77,49,246,.9) 35%, rgba(56,125,255,.66) 66%, rgba(169,220,255,.5) 82%, transparent 100%), radial-gradient(ellipse 105% 26% at 50% 74%, rgba(217,245,255,.84) 0%, rgba(197,231,255,.5) 50%, transparent 77%)", backgroundSize: '140px 140px, auto, auto', backgroundBlendMode: 'soft-light, normal, normal' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(247,245,238,.98) 0%, rgba(247,245,238,.92) 18%, rgba(247,245,238,.16) 43%, transparent 58%)' }} />
      <div style={{ position: 'absolute', left: '-8%', right: '-8%', top: '38%', height: '18%', borderRadius: '50%', background: 'rgba(255,255,255,.76)', filter: 'blur(18px)', opacity: .72 }} />
    </div>
  )
}
