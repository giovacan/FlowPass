'use client'
import { useState } from 'react'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,600;0,700;0,900;1,900&family=Archivo+Narrow:wght@400;600;700&family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600&display=swap');

  :root {
    --bg:      #0E0F12;
    --bg-2:    #1B1D22;
    --bg-3:    #2A2D34;
    --ink:     #E3DFD8;
    --ink-dim: #6E7079;
    --ink-mute:#3A3D45;
    --orange:  #FF5C1F;
    --orange-2:#E04510;
    --cream:   #F4F1EC;
    --line:    rgba(227,223,216,0.10);
    --line-2:  rgba(227,223,216,0.18);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--ink); font-family: 'Space Grotesk', system-ui, sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
  h1,h2,h3,h4,h5 { font-weight: inherit; }
  a { text-decoration: none; color: inherit; }

  .t-archivo { font-family: 'Archivo', sans-serif; font-weight: 900; letter-spacing: -0.02em; line-height: 0.9; }
  .t-narrow  { font-family: 'Archivo Narrow', sans-serif; }
  .t-mono    { font-family: 'Space Grotesk', monospace; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-dim); }

  .shell { width: 100%; max-width: 1360px; margin: 0 auto; padding: 0 32px; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 28px; background: var(--orange); color: #fff;
    font-family: 'Archivo Narrow', sans-serif; font-weight: 700; font-size: 15px;
    letter-spacing: 0.04em; text-transform: uppercase; cursor: pointer; border: none;
    transition: background .15s, transform .1s; white-space: nowrap;
  }
  .btn-primary:hover { background: var(--orange-2); transform: translateY(-1px); }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 13px 28px; background: transparent; color: var(--ink);
    font-family: 'Archivo Narrow', sans-serif; font-weight: 700; font-size: 15px;
    letter-spacing: 0.04em; text-transform: uppercase; cursor: pointer;
    border: 1px solid var(--line-2); transition: border-color .15s, color .15s; white-space: nowrap;
  }
  .btn-ghost:hover { border-color: var(--ink); color: var(--cream); }

  .section { position: relative; padding: 100px 0; border-top: 1px solid var(--line); }
  .eyebrow { font-family: 'Space Grotesk', sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--orange); display: flex; align-items: center; gap: 10px; }
  .eyebrow::before { content: ""; width: 24px; height: 1px; background: var(--orange); opacity: 0.7; flex-shrink: 0; }

  .live-dot { width: 7px; height: 7px; background: #22C55E; border-radius: 50%; animation: pulse-dot 2s ease infinite; flex-shrink: 0; }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }

  .ticker-wrap { overflow: hidden; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: var(--bg-2); }
  .ticker-track { display: inline-flex; align-items: center; gap: 48px; animation: ticker 36s linear infinite; padding: 16px 24px; white-space: nowrap; }
  @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  .pillar-tab { background: transparent; border: none; cursor: pointer; text-align: left; padding: 0; transition: opacity .15s; width: 100%; }
  .pillar-tab:not(.active) { opacity: 0.38; }
  .pillar-tab:not(.active):hover { opacity: 0.7; }
  .pillar-tab.active { opacity: 1; }

  .img-ph { position: relative; background: var(--bg-3); display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .img-ph::after { content: ""; position: absolute; inset: 0; background: repeating-linear-gradient(135deg, rgba(255,255,255,.02) 0 14px, rgba(255,255,255,.04) 14px 28px); pointer-events: none; }
  .img-ph-label { font-family: 'Space Grotesk',sans-serif; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-mute); padding: 6px 10px; border: 1px solid var(--ink-mute); position: relative; z-index: 1; text-align: center; }

  .price-toggle { display: flex; align-items: center; border: 1px solid var(--line-2); flex-shrink: 0; }
  .price-toggle button { padding: 10px 18px; font-family: 'Archivo Narrow',sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; background: transparent; border: none; cursor: pointer; color: var(--ink-dim); transition: all .15s; white-space: nowrap; }
  .price-toggle button.active { background: var(--bg-2); color: var(--ink); }

  /* ── RESPONSIVE ─────────────────────────────────────────── */

  /* Tablet: ocultar nav links */
  @media(max-width:860px) {
    .nav-links { display: none !important; }
    .section { padding: 72px 0; }
  }

  /* Móvil */
  @media(max-width:640px) {
    .shell { padding: 0 20px; }
    .section { padding: 56px 0; }
    .hide-sm { display: none !important; }

    /* Hero: columna única */
    .hero-grid { grid-template-columns: 1fr !important; }
    .hero-img  { aspect-ratio: 16/9 !important; min-height: unset !important; }

    /* Manifiesto: columna única */
    .manifesto-grid { grid-template-columns: 1fr !important; gap: 40px !important; }

    /* Plataforma: columna única, tabs horizontales */
    .plataforma-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
    .pillar-tabs { flex-direction: row !important; overflow-x: auto; gap: 0 !important; }
    .pillar-tab  { padding: 14px 20px !important; border-left: none !important; border-bottom: 2px solid transparent; flex-shrink: 0; }
    .pillar-tab.active { border-bottom-color: var(--orange) !important; border-left: none !important; }

    /* Testimonio: columna única */
    .testimonio-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
    .testimonio-img  { aspect-ratio: 16/9 !important; }

    /* Precios: columna única */
    .precios-header { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
    .precios-grid   { grid-template-columns: 1fr !important; }

    /* Footer: 2 columnas en móvil */
    .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
    .footer-brand { grid-column: 1 / -1 !important; }

    /* Galería quién usa: 2 col */
    .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; grid-auto-rows: 120px !important; }
    .gallery-wide { grid-column: span 2 !important; }

    /* Botones full width en hero */
    .hero-btns { flex-direction: column !important; }
    .hero-btns a { width: 100%; justify-content: center; }

    /* Live banner compacto */
    .live-banner-inner { flex-wrap: nowrap !important; overflow: hidden; }
  }

  /* Tablet intermedio */
  @media(min-width:641px) and (max-width:960px) {
    .hero-grid      { grid-template-columns: 1fr !important; }
    .hero-img       { aspect-ratio: 16/9 !important; min-height: unset !important; }
    .precios-grid   { grid-template-columns: 1fr !important; }
    .footer-grid    { grid-template-columns: 1fr 1fr !important; }
    .footer-brand   { grid-column: 1 / -1 !important; }
    .plataforma-grid{ grid-template-columns: 1fr !important; }
    .pillar-tabs    { flex-direction: row !important; overflow-x: auto; gap: 0 !important; }
    .pillar-tab     { padding: 14px 20px !important; border-left: none !important; border-bottom: 2px solid transparent; flex-shrink: 0; }
    .pillar-tab.active { border-bottom-color: var(--orange) !important; border-left: none !important; }
    .testimonio-grid{ grid-template-columns: 1fr !important; gap: 36px !important; }
    .testimonio-img { aspect-ratio: 16/9 !important; }
    .gallery-grid   { grid-template-columns: repeat(2, 1fr) !important; grid-auto-rows: 140px !important; }
    .gallery-wide   { grid-column: span 2 !important; }
  }
`

// ─── DATA ────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    num: '01', label: 'Cobranza', title: 'Cobranza recurrente.',
    body: 'Suscripciones automatizadas, débito recurrente, MercadoPago y transferencia. Recordatorios, reintentos y dunning automático para que no chases a nadie.',
    stats: [{ k: 'PASARELAS', v: '+14' }, { k: 'SETUP', v: '4 min' }, { k: 'COMISIÓN', v: '0%' }],
    img: 'SCREENSHOT · PANEL DE COBRANZA',
  },
  {
    num: '02', label: 'Asistencia', title: 'Asistencia en tatami.',
    body: 'Check-in con QR, NFC o lector facial. La lista de la clase aparece en tiempo real en el tablet del instructor — sin red, sin fricción.',
    stats: [{ k: 'INPUT', v: 'QR · NFC · Face' }, { k: 'OFFLINE', v: 'Sí' }],
    img: 'FOTO · CHECK-IN QR EN CLASE',
  },
  {
    num: '03', label: 'Agenda', title: 'Agenda con cupos.',
    body: 'Reservas con lista de espera, créditos por plan, bloqueos por instructor. Tu app blanca para socios — App Store y Play, con tu marca.',
    stats: [{ k: 'APP', v: 'White-label' }, { k: 'WAITLIST', v: 'Auto' }],
    img: 'SCREENSHOT · AGENDA CON CUPOS',
  },
]

const DISCIPLINES = [
  { num: 'I',   label: 'GIMNASIO',      sub: 'CrossFit · Funcional',     count: '420' },
  { num: 'II',  label: 'DOJO',          sub: 'BJJ · Muay Thai · Karate', count: '610' },
  { num: 'III', label: 'CONSERVATORIO', sub: 'Música · 1-a-1',           count: '180' },
  { num: 'IV',  label: 'CLUB',          sub: 'Tenis · Pádel · Natación', count: '210' },
]

const PRICES = {
  mensual: [
    { id: 'start',      nombre: 'START',      precio: '$29', socios: 'Hasta 30 socios',          features: ['Cobranza básica','Check-in QR','App de socios','Soporte email'],                                        popular: false, cta: 'Empezar' },
    { id: 'pro',        nombre: 'PRO',        precio: '$79', socios: 'Hasta 500 socios',         features: ['Todo de Start','Multi-sucursal (3)','Reportes avanzados','White-label app','Soporte 24h'],              popular: true,  cta: 'Probar 30 días' },
    { id: 'federation', nombre: 'FEDERATION', precio: null,  socios: '500+ socios o multi-sede', features: ['Todo de Pro','Multi-sucursal ∞','API + webhooks','SSO / SAML','CSM dedicado'],                          popular: false, cta: 'Hablar' },
  ],
  anual: [
    { id: 'start',      nombre: 'START',      precio: '$23', socios: 'Hasta 30 socios',          features: ['Cobranza básica','Check-in QR','App de socios','Soporte email'],                                        popular: false, cta: 'Empezar' },
    { id: 'pro',        nombre: 'PRO',        precio: '$63', socios: 'Hasta 500 socios',         features: ['Todo de Start','Multi-sucursal (3)','Reportes avanzados','White-label app','Soporte 24h'],              popular: true,  cta: 'Probar 30 días' },
    { id: 'federation', nombre: 'FEDERATION', precio: null,  socios: '500+ socios o multi-sede', features: ['Todo de Pro','Multi-sucursal ∞','API + webhooks','SSO / SAML','CSM dedicado'],                          popular: false, cta: 'Hablar' },
  ],
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function ImgPh({ label, style, className }: { label: string; style?: React.CSSProperties; className?: string }) {
  return (
    <div className={`img-ph${className ? ' ' + className : ''}`} style={style}>
      <span className="img-ph-label">{label}</span>
    </div>
  )
}

function Nav() {
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(14,15,18,0.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line)' }}>
      <div className="shell">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16 }}>F</span>
            </div>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 17, letterSpacing: '-0.02em' }}>flowpass</span>
          </div>

          <div className="nav-links" style={{ display: 'flex', gap: 28 }}>
            {['#producto','#disciplinas','#precios','#manifiesto','#historias'].map((href, i) => (
              <a key={href} href={href} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-dim)', transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-dim)')}>
                {['Producto','Disciplinas','Precios','Manifiesto','Historias'][i]}
              </a>
            ))}
          </div>

          <a href="/login" className="btn-primary" style={{ padding: '10px 20px', fontSize: 13, flexShrink: 0 }}>
            Empezar →
          </a>
        </div>
      </div>
    </nav>
  )
}

function LiveBanner() {
  return (
    <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', padding: '9px 0', overflow: 'hidden' }}>
      <div className="shell">
        <div className="live-banner-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div className="live-dot" />
              <span className="t-mono" style={{ color: '#22C55E' }}>EN VIVO</span>
            </div>
            <span className="t-mono"><span style={{ color: 'var(--ink)', fontWeight: 600 }}>1,247</span> socios activos</span>
            <span className="t-mono hide-sm"><span style={{ color: 'var(--ink)', fontWeight: 600 }}>$41.2K</span> facturado hoy</span>
            <span className="t-mono hide-sm" style={{ color: '#22C55E' }}>▲ +12.4% MoM</span>
          </div>
          <span className="t-mono hide-sm" style={{ color: 'var(--orange)', flexShrink: 0 }}>NUEVA · INTEGRACIÓN MERCADO PAGO V3</span>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section id="hero" style={{ position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)', backgroundSize: '80px 80px', opacity: 0.5 }} />
      <div aria-hidden style={{ position: 'absolute', top: '20%', left: '55%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(255,92,31,0.12), transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div className="shell" style={{ position: 'relative', zIndex: 1, paddingTop: 80, paddingBottom: 80 }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ marginBottom: 28 }}>
              <span className="t-mono" style={{ color: 'var(--orange)' }}>01 · MEMBRESÍAS QUE NO SE QUIEBRAN</span>
            </div>

            <h1>
              <span className="t-archivo" style={{ fontSize: 'clamp(56px, 9vw, 148px)', display: 'block', color: 'var(--cream)' }}>ENTRENA</span>
              <span className="t-archivo" style={{ fontSize: 'clamp(56px, 9vw, 148px)', display: 'block', color: 'var(--orange)', fontStyle: 'italic' }}>COBRA</span>
              <span className="t-archivo" style={{ fontSize: 'clamp(56px, 9vw, 148px)', display: 'block', color: 'var(--ink-dim)' }}>repetí.</span>
            </h1>

            <p style={{ color: 'var(--ink-dim)', fontSize: 17, lineHeight: 1.6, maxWidth: 480, margin: '28px 0 36px' }}>
              Plataforma de membresías para gimnasios, dojos, conservatorios y clubs.{' '}
              <span style={{ color: 'var(--ink)' }}>Cobranza, asistencia y agenda en una sola disciplina.</span>
            </p>

            <div className="hero-btns" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 44 }}>
              <a href="/login" className="btn-primary">Empezar prueba →</a>
              <a href="#producto" className="btn-ghost">Ver demo en vivo</a>
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', paddingTop: 24, borderTop: '1px solid var(--line)' }}>
              <div>
                <div className="t-mono" style={{ marginBottom: 4 }}>FUNDACIÓN</div>
                <div style={{ fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, fontSize: 15 }}>2024 · LATAM</div>
              </div>
              <div style={{ width: 1, background: 'var(--line-2)', flexShrink: 0 }} />
              <div>
                <div className="t-mono" style={{ marginBottom: 4 }}>FAMILIA</div>
                <div style={{ fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, fontSize: 15 }}>FlowStudio · PANsystem</div>
              </div>
            </div>
          </div>

          <ImgPh className="hero-img" label="FOTO HERO · ATLETA EN ACCIÓN · b/n + warm tint" style={{ aspectRatio: '4/5', minHeight: 480, width: '100%' }} />
        </div>
      </div>
    </section>
  )
}

function Ticker() {
  const items = ['COBRANZA AUTOMÁTICA','CHECK-IN QR','AGENDA CON CUPOS','WHITE-LABEL APP','MERCADOPAGO V3','SIN CONTRATOS','312 ACADEMIAS · 14 PAÍSES']
  const doubled = [...items, ...items]
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span key={i} style={{ fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: '0.04em', textTransform: 'uppercase', color: i % 3 === 1 ? 'var(--orange)' : 'var(--ink-dim)' }}>
            {t} <span style={{ color: 'var(--orange)', margin: '0 16px' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function QuienUsa() {
  const fotos = [
    { label: 'FOTO · JIU-JITSU VISTA CENITAL' },
    { label: 'FOTO · CHECK-IN QR' },
    { label: 'FOTO · PIANO · CONSERVATORIO' },
    { label: 'FOTO · FUNCIONAL / KETTLEBELL' },
    { label: 'FOTO · TATAMI · PANORÁMICA', wide: true },
  ]
  return (
    <section id="quien-usa" className="section">
      <div className="shell">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, marginBottom: 48, flexWrap: 'wrap' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>02 · Quién usa FlowPass</div>
            <h2 className="t-archivo" style={{ fontSize: 'clamp(48px, 7vw, 112px)', color: 'var(--cream)' }}>
              312<br /><span style={{ color: 'var(--ink-dim)', fontSize: '0.6em', fontStyle: 'italic' }}>socios</span>
            </h2>
          </div>
          <p style={{ color: 'var(--ink-dim)', fontSize: 16, lineHeight: 1.6, maxWidth: 320 }}>
            entrenando ahora mismo en <span style={{ color: 'var(--ink)' }}>1,420 academias · 14 países</span>
          </p>
        </div>

        <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '160px', gap: 6 }}>
          {fotos.map((f, i) => (
            <ImgPh key={i} className={f.wide ? 'gallery-wide' : ''} label={f.label} style={{ height: '100%', width: '100%', aspectRatio: 'auto' }} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Manifiesto() {
  return (
    <section id="manifiesto" className="section" style={{ background: 'var(--bg-2)' }}>
      <div className="shell">
        <div className="eyebrow" style={{ marginBottom: 40 }}>EL MANIFIESTO</div>
        <div className="manifesto-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <h2 className="t-archivo" style={{ fontSize: 'clamp(40px, 6vw, 96px)', lineHeight: 0.9, color: 'var(--cream)', marginBottom: 32 }}>
              La administración<br />
              <span style={{ color: 'var(--orange)', fontStyle: 'italic' }}>parte</span>{' '}del{' '}
              <span style={{ color: 'var(--orange)', fontStyle: 'italic' }}>entrenamiento.</span>
            </h2>
            <p style={{ color: 'var(--ink-dim)', fontSize: 16, lineHeight: 1.65 }}>
              Si entrenás con método, deberías cobrar con método. FlowPass es la primera plataforma pensada por academias que ya pasaron las planillas, los WhatsApp y los recibos a mano.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { n: '+18%', l: 'retención · Q1 vs Q-1', c: '#22C55E' },
              { n: '−24h', l: 'admin / mes · academia promedio', c: 'var(--orange)' },
              { n: '4 min', l: 'setup hasta primer cobro', c: 'var(--cream)' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 20, padding: '24px 0', borderBottom: '1px solid var(--line)' }}>
                <span className="t-archivo" style={{ fontSize: 'clamp(36px, 5vw, 56px)', color: s.c, flexShrink: 0 }}>{s.n}</span>
                <span className="t-mono">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Plataforma() {
  const [active, setActive] = useState(0)
  const p = PILLARS[active]
  return (
    <section id="producto" className="section">
      <div className="shell">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>03 · La plataforma</div>
            <h2 className="t-archivo" style={{ fontSize: 'clamp(40px, 6vw, 88px)', color: 'var(--cream)' }}>
              Tres pilares.<br />
              <span style={{ color: 'var(--ink-dim)', fontStyle: 'italic' }}>Una sola fuente de verdad.</span>
            </h2>
          </div>
          <div className="t-mono hide-sm">PILARES — INDEX<br />01 / 02 / 03</div>
        </div>

        <div className="plataforma-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 48, alignItems: 'start' }}>
          <div className="pillar-tabs" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {PILLARS.map((pl, i) => (
              <button key={pl.num} className={`pillar-tab${active === i ? ' active' : ''}`}
                onClick={() => setActive(i)}
                style={{ padding: '18px 24px', borderLeft: `2px solid ${active === i ? 'var(--orange)' : 'var(--line-2)'}`, transition: 'all .2s' }}>
                <div className="t-mono" style={{ marginBottom: 6 }}>{pl.num}</div>
                <div className="t-narrow" style={{ fontWeight: 700, fontSize: 20, textTransform: 'uppercase', color: 'var(--ink)' }}>{pl.label}</div>
              </button>
            ))}
          </div>

          <div>
            <ImgPh label={p.img} style={{ width: '100%', aspectRatio: '16/9', marginBottom: 28 }} />
            <h3 className="t-archivo" style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: 'var(--cream)', marginBottom: 14 }}>{p.title}</h3>
            <p style={{ color: 'var(--ink-dim)', fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>{p.body}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {p.stats.map(s => (
                <div key={s.k} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 20px', border: '1px solid var(--line-2)', background: 'var(--bg-2)' }}>
                  <span className="t-mono">{s.k}</span>
                  <span style={{ fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Disciplinas() {
  return (
    <section id="disciplinas" className="section" style={{ background: 'var(--bg-2)' }}>
      <div className="shell">
        <div className="eyebrow" style={{ marginBottom: 20 }}>04 · Disciplinas</div>
        <h2 className="t-archivo" style={{ fontSize: 'clamp(40px, 6vw, 88px)', color: 'var(--cream)', marginBottom: 48 }}>
          Hecho para entrenar.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 1, background: 'var(--line)', border: '1px solid var(--line)' }}>
          {DISCIPLINES.map(d => (
            <div key={d.num} style={{ background: 'var(--bg)' }}>
              <ImgPh label={`FOTO · ${d.label}`} style={{ width: '100%', aspectRatio: '4/3' }} />
              <div style={{ padding: '20px 24px 28px' }}>
                <div className="t-mono" style={{ marginBottom: 8 }}>{d.num} / IV</div>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 24, textTransform: 'uppercase', marginBottom: 4, color: 'var(--cream)' }}>{d.label}</div>
                <div className="t-mono" style={{ marginBottom: 14 }}>{d.sub}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span className="t-archivo" style={{ fontSize: 36, color: 'var(--orange)' }}>{d.count}</span>
                  <span className="t-mono">academias</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonio() {
  return (
    <section id="historias" className="section">
      <div className="shell">
        <div className="testimonio-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'center' }}>
          <ImgPh className="testimonio-img" label="RETRATO · MAURO ROCA · B/N" style={{ aspectRatio: '3/4', width: '100%' }} />
          <div>
            <div className="eyebrow" style={{ marginBottom: 32 }}>05 · Testimonio · Academia Roca BJJ</div>
            <blockquote style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(22px, 3vw, 48px)', lineHeight: 1.0, color: 'var(--cream)', marginBottom: 36 }}>
              Pasé de cobrar mensualidades por{' '}
              <span style={{ color: 'var(--orange)' }}>WhatsApp</span>{' '}
              a tener un dashboard que me dice cuántos cinturones azules pagaron antes del 5 del mes
            </blockquote>
            <div style={{ marginBottom: 36 }}>
              <div style={{ fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, fontSize: 18, textTransform: 'uppercase', marginBottom: 4 }}>Mauro Roca</div>
              <div className="t-mono">Faixa-preta · Fundador, Academia Roca · São Paulo</div>
            </div>
            <div style={{ display: 'flex', gap: 32, paddingTop: 28, borderTop: '1px solid var(--line)' }}>
              {[{ n: '+18%', l: 'RETENCIÓN' }, { n: '−24h', l: 'HORAS / MES' }].map(s => (
                <div key={s.l}>
                  <div className="t-archivo" style={{ fontSize: 36, color: 'var(--orange)' }}>{s.n}</div>
                  <div className="t-mono" style={{ marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Precios() {
  const [ciclo, setCiclo] = useState<'mensual' | 'anual'>('mensual')
  const planes = PRICES[ciclo]
  return (
    <section id="precios" className="section" style={{ background: 'var(--bg-2)' }}>
      <div className="shell">
        <div className="precios-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>06 · Precios</div>
            <h2 className="t-archivo" style={{ fontSize: 'clamp(40px, 6vw, 88px)', color: 'var(--cream)' }}>
              Sin contratos.<br />
              <span style={{ color: 'var(--ink-dim)', fontStyle: 'italic' }}>Sin sorpresas.</span>
            </h2>
          </div>
          <div className="price-toggle">
            <button className={ciclo === 'mensual' ? 'active' : ''} onClick={() => setCiclo('mensual')}>MENSUAL</button>
            <button className={ciclo === 'anual' ? 'active' : ''} onClick={() => setCiclo('anual')}>ANUAL · −2 MESES</button>
          </div>
        </div>

        <div className="precios-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--line)', border: '1px solid var(--line)' }}>
          {planes.map(p => (
            <div key={p.id} style={{ background: p.popular ? 'var(--bg-3)' : 'var(--bg)', padding: '32px 28px', display: 'flex', flexDirection: 'column', position: 'relative', ...(p.popular ? { boxShadow: 'inset 0 0 0 1px var(--orange)' } : {}) }}>
              {p.popular && (
                <div style={{ position: 'absolute', top: -1, right: -1, background: 'var(--orange)', color: '#fff', padding: '5px 12px', fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  ★ POPULAR
                </div>
              )}
              <div className="t-mono" style={{ marginBottom: 8 }}>{p.socios}</div>
              <div className="t-archivo" style={{ fontSize: 44, color: p.popular ? 'var(--orange)' : 'var(--cream)', lineHeight: 0.9, marginBottom: 8 }}>{p.nombre}</div>
              <div style={{ marginBottom: 28, marginTop: 16 }}>
                {p.precio ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span className="t-archivo" style={{ fontSize: 56, color: 'var(--cream)' }}>{p.precio}</span>
                    <span className="t-mono">USD / mes</span>
                  </div>
                ) : (
                  <div className="t-archivo" style={{ fontSize: 36, color: 'var(--ink-dim)' }}>A medida</div>
                )}
              </div>
              <ul style={{ listStyle: 'none', flex: 1, marginBottom: 24 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--line)', fontSize: 14, color: 'var(--ink-dim)' }}>
                    <span style={{ color: 'var(--orange)', flexShrink: 0 }}>→</span>{f}
                  </li>
                ))}
              </ul>
              <a href="/login" className={p.popular ? 'btn-primary' : 'btn-ghost'} style={{ justifyContent: 'space-between', width: '100%' }}>
                {p.cta} <span>→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section style={{ position: 'relative', padding: '100px 0', overflow: 'hidden', borderTop: '1px solid var(--line)' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(255,92,31,0.14), transparent 60%)', pointerEvents: 'none' }} />
      <div className="shell" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: 28 }}>07 · Tu turno</div>
        <h2 className="t-archivo" style={{ fontSize: 'clamp(52px, 9vw, 160px)', color: 'var(--cream)', lineHeight: 0.88, marginBottom: 40 }}>
          Construí<br />fuerza.<br />
          <span style={{ color: 'var(--ink-dim)', fontStyle: 'italic' }}>olvidá la planilla.</span>
        </h2>
        <ImgPh label="FOTO · CLOSE-UP · PUÑOS ENVUELTOS / CINTURÓN" style={{ width: '100%', maxWidth: 640, height: 260, margin: '0 auto 48px' }} />
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <a href="/login" className="btn-primary">Empezar prueba →</a>
          <a href="#precios" className="btn-ghost">Hablar con un humano</a>
        </div>
        <div className="t-mono" style={{ textAlign: 'center' }}>30 DÍAS · SIN TARJETA · MIGRACIÓN ASISTIDA</div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--line-2)', padding: '56px 0 36px' }}>
      <div className="shell">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16 }}>F</span>
              </div>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 17 }}>flowpass</span>
            </div>
            <p style={{ color: 'var(--ink-dim)', fontSize: 13, lineHeight: 1.6, maxWidth: 260 }}>
              Plataforma de membresías para academias que entrenan con método. Familia FlowStudio · PANsystem.
            </p>
          </div>
          {[
            { title: 'PRODUCTO',    links: ['Cobranza','Asistencia','Agenda','App de socios','Reportes'] },
            { title: 'DISCIPLINAS', links: ['Gimnasios','Artes marciales','Música','Clubs','Pilates'] },
            { title: 'EMPRESA',     links: ['Manifiesto','Casos','Precios','Blog','Contacto'] },
          ].map(col => (
            <div key={col.title}>
              <div className="t-mono" style={{ marginBottom: 14 }}>{col.title}</div>
              <ul style={{ listStyle: 'none' }}>
                {col.links.map(l => (
                  <li key={l} style={{ marginBottom: 9 }}>
                    <a href="#" style={{ color: 'var(--ink-dim)', fontSize: 14, transition: 'color .15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-dim)')}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ paddingTop: 20, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div className="t-mono">© 2026 FlowPass · Familia FlowStudio</div>
          <div className="t-mono" style={{ color: 'var(--orange)' }}>ENTRENA · COBRA · REPETÍ</div>
        </div>
      </div>
    </footer>
  )
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function FlowPassLanding() {
  return (
    <>
      <style>{css}</style>
      <LiveBanner />
      <Nav />
      <Hero />
      <Ticker />
      <QuienUsa />
      <Manifiesto />
      <Plataforma />
      <Disciplinas />
      <Testimonio />
      <Precios />
      <CTA />
      <Footer />
    </>
  )
}
