export function GradientBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className} style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#f7fbff', backgroundImage: "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.42'/></svg>\"), radial-gradient(circle at 18% 78%, rgba(27,159,254,.78) 0%, rgba(27,159,254,.3) 24%, transparent 52%), radial-gradient(circle at 76% 20%, rgba(74,201,255,.56) 0%, rgba(74,201,255,.17) 25%, transparent 52%), radial-gradient(circle at 55% 48%, rgba(226,240,255,.9) 0%, transparent 58%)", backgroundSize: '120px 120px, auto, auto, auto', backgroundBlendMode: 'overlay, normal, normal, normal' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: .22, background: 'linear-gradient(120deg, transparent 15%, rgba(255,255,255,.9) 46%, transparent 72%)', mixBlendMode: 'screen' }} />
    </div>
  )
}
