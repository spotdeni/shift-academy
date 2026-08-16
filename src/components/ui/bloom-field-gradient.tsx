export function GradientBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className} style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#f7fbff', backgroundImage: "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.5'/></svg>\"), radial-gradient(ellipse at 8% 86%, rgba(27,159,254,.92) 0%, rgba(27,159,254,.42) 22%, transparent 52%), radial-gradient(ellipse at 88% 8%, rgba(74,201,255,.82) 0%, rgba(74,201,255,.28) 24%, transparent 52%), radial-gradient(ellipse at 52% 42%, rgba(226,240,255,.95) 0%, transparent 62%)", backgroundSize: '120px 120px, auto, auto, auto', backgroundBlendMode: 'overlay, normal, normal, normal' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: .3, background: 'linear-gradient(120deg, transparent 15%, rgba(255,255,255,.95) 46%, transparent 72%)', mixBlendMode: 'screen' }} />
    </div>
  )
}
