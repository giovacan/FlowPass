'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

// ─── DESIGN TOKENS ───
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Cinzel:wght@600&family=JetBrains+Mono:wght@400;700&family=Manrope:wght@300;400;600&display=swap');

  :root {
    --bg: #0B0908; --bg-2: #15110D; --bg-3: #1F1812;
    --ink: #E8DCC4; --ink-dim: #8A7F6A; --ink-mute: #574E40;
    --jade: #2E7D7A; --jade-2: #3FA09A;
    --rojo: #B53825; --rojo-2: #8A2818;
    --ambar: #D4A547; --ambar-2: #B58737;
    --hueso: #E8DCC4;
    --line: rgba(232,220,196,0.14); --line-strong: rgba(232,220,196,0.28);
  }
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; background: var(--bg); color: var(--ink); font-family: 'Manrope', system-ui, sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
  h1,h2,h3,h4 { margin:0; font-weight: inherit; }
  .t-display { font-family: 'Big Shoulders Display', sans-serif; font-weight:900; line-height:0.86; letter-spacing:-0.005em; text-transform:uppercase; }
  .t-cinzel { font-family: 'Cinzel', serif; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; }
  .t-mono { font-family: 'JetBrains Mono', monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--ink-dim); }
  .t-mono-sm { font-family: 'JetBrains Mono', monospace; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--ink-dim); }
  .t-mono-lg { font-family: 'JetBrains Mono', monospace; font-size:13px; letter-spacing:0.16em; text-transform:uppercase; }
  .shell { width:100%; max-width:1380px; margin:0 auto; padding:0 28px; }
  .section { position:relative; padding:120px 0; border-top:1px solid var(--line); }
  .section-head { display:flex; align-items:flex-end; justify-content:space-between; gap:40px; margin-bottom:56px; flex-wrap:wrap; }
  .eyebrow { font-family: 'JetBrains Mono', monospace; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:var(--ambar); display:inline-flex; align-items:center; gap:10px; }
  .eyebrow::before { content:""; width:28px; height:1px; background:var(--ambar); opacity:0.7; }
  .btn { display:inline-flex; align-items:center; gap:14px; padding:18px 28px; font-family:'Big Shoulders Display',sans-serif; font-weight:800; font-size:18px; letter-spacing:0.06em; text-transform:uppercase; text-decoration:none; cursor:pointer; border:1px solid var(--ink); background:var(--ink); color:var(--bg); transition:all .18s ease; }
  .btn::after { content:"→"; transition:transform .2s ease; }
  .btn:hover { background:var(--rojo); border-color:var(--rojo); color:var(--hueso); }
  .btn:hover::after { transform:translateX(4px); }
  .btn-ghost { background:transparent; color:var(--ink); border-color:var(--line-strong); }
  .btn-ghost:hover { background:var(--ink); color:var(--bg); border-color:var(--ink); }
  .btn-rojo { background:var(--rojo); border-color:var(--rojo); color:var(--hueso); }
  .btn-rojo:hover { background:var(--rojo-2); border-color:var(--rojo-2); }
  .reveal { opacity:0; transform:translateY(24px); transition:opacity .8s ease, transform .8s ease; }
  .reveal.in { opacity:1; transform:none; }
  .ticker-track { display:inline-flex; align-items:center; gap:48px; animation:ticker 40s linear infinite; padding:18px 24px; font-family:'Big Shoulders Display',sans-serif; font-weight:800; letter-spacing:0.04em; text-transform:uppercase; font-size:22px; white-space:nowrap; }
  @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .nav-links a { color:var(--ink); text-decoration:none; font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; opacity:0.7; transition:opacity .15s; }
  .nav-links a:hover { opacity:1; color:var(--ambar); }
  .card { background:var(--bg-2); border:1px solid var(--line); padding:28px; transition:border-color .2s; }
  .card:hover { border-color:var(--ambar); }
  input:focus, select:focus { outline:2px solid var(--ambar); outline-offset:2px; }
  @media(max-width:860px){ .nav-links{display:none!important} }
  @media(max-width:640px){ .hide-sm{display:none!important} }
`

// ─── DATA ───

const DISCIPLINAS = [
  { id:'muay-thai', nahuatl:'Tlapaltequi', nombre:'Muay Thai', numeral:'I', sub:'Las ocho extremidades', blurb:'Arte marcial tailandés. Codos, rodillas, puños y espinillas. Acondicionamiento brutal y técnica forjada al fuego.', accent:'rojo', nivel:'Todos los niveles', duracion:'60 min' },
  { id:'bjj', nahuatl:'Tlatlatoa', nombre:'Jiu-Jitsu Brasileño', numeral:'II', sub:'El arte suave', blurb:'Lucha en el suelo, palancas y estrangulaciones. La técnica vence a la fuerza. Sistema de cinturones IBJJF.', accent:'jade', nivel:'Iniciante a competición', duracion:'90 min' },
  { id:'boxeo', nahuatl:'Macuahuitl', nombre:'Boxeo', numeral:'III', sub:'El arte de los puños', blurb:'Footwork, defensa, combinaciones. La base de todo peleador moderno. Costal, manoplas y sparring controlado.', accent:'ambar', nivel:'Todos los niveles', duracion:'60 min' },
  { id:'mma', nahuatl:'Yāōtl', nombre:'MMA', numeral:'IV', sub:'Combate completo', blurb:'Striking, clinch y suelo. Integración de todas las disciplinas en un solo sistema de combate.', accent:'rojo', nivel:'Intermedio en adelante', duracion:'90 min' },
  { id:'defensa', nahuatl:'Necehui', nombre:'Defensa Personal', numeral:'V', sub:'Para la calle', blurb:'Escenarios reales, control de adrenalina, neutralización. Pensado para civiles, no para el ring.', accent:'jade', nivel:'Sin experiencia previa', duracion:'60 min' },
  { id:'kids', nahuatl:'Tēlpōchtli', nombre:'Pequeños Guerreros', numeral:'VI', sub:'Edades 6 a 13', blurb:'Disciplina, respeto y juego. BJJ y striking adaptados con énfasis en valores y forma física.', accent:'ambar', nivel:'Niños 6-13', duracion:'60 min' },
]

const HORARIO = [
  { h:'06:00', l:'boxeo',     m:'mma',      x:'boxeo',     j:'mma',      v:'boxeo',    s:null },
  { h:'07:30', l:'muay-thai', m:'bjj',      x:'muay-thai', j:'bjj',      v:'muay-thai',s:'mma' },
  { h:'10:00', l:null,        m:'defensa',  x:null,        j:'defensa',  v:null,       s:'kids' },
  { h:'16:30', l:'kids',      m:'kids',     x:'kids',      j:'kids',     v:'kids',     s:'kids' },
  { h:'18:00', l:'bjj',       m:'boxeo',    x:'bjj',       j:'boxeo',    v:'bjj',      s:'bjj' },
  { h:'19:30', l:'muay-thai', m:'mma',      x:'muay-thai', j:'mma',      v:'muay-thai',s:'mma' },
  { h:'21:00', l:'mma',       m:'defensa',  x:'mma',       j:'defensa',  v:'mma',      s:null },
]

const DIAS_FULL = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']

const CINTURONES = [
  { id:'blanco', nombre:'Blanco', nahuatl:'Iztāc', color:'#F5EFD9', tiempo:'0 — 2 años', grados:['Sin grados','4 rayas máximo'], skills:['Posiciones básicas: guardia, monta, mounted, side-control','Escapes fundamentales','Sumisiones primarias: rear-naked, armbar, triangle'], filosofia:'El inicio del camino. Aquí se forja la humildad: vas a perder, mucho. Es el cinturón más largo y más importante.' },
  { id:'azul', nombre:'Azul', nahuatl:'Texōtli', color:'#1F5E9E', tiempo:'2 — 4 años', grados:['Sin grados','4 rayas máximo'], skills:['Sistema de pases de guardia','Cadenas de sumisión y transiciones','Inicio en guardia abierta y deportiva'], filosofia:'El primer color real. Reconoces que sabes algo, pero apenas empiezas. Edad mínima 16 años (IBJJF).' },
  { id:'morado', nombre:'Morado', nahuatl:'Camohpalli', color:'#5E2E8C', tiempo:'4 — 7 años', grados:['Sin grados','4 rayas máximo'], skills:['Juego personal definido','Capacidad de enseñar a inferiores','Sistemas avanzados de guardia (lapel, de la riva, etc.)'], filosofia:'Técnico avanzado. Aquí muchos abandonan: la curva se aplana. Quien persiste, llega.' },
  { id:'marron', nombre:'Marrón', nahuatl:'Tlīltic', color:'#5C3A1F', tiempo:'6 — 9 años', grados:['Sin grados','4 rayas máximo'], skills:['Refinamiento técnico total','Estrategia competitiva madura','Preparación para liderar'], filosofia:'Un paso del negro. Te preparas para ser referente. Mínimo 18 años (IBJJF).' },
  { id:'negro', nombre:'Negro', nahuatl:'Yāōtl', color:'#0B0908', tiempo:'8 — 12 años', grados:['1° al 6° grado: rojo y negro','7° y 8°: rojo y blanco','9° en adelante: rojo'], skills:['Maestría técnica y filosófica','Capacidad de promover alumnos','Custodio del arte'], filosofia:'No es el final. Es donde realmente comienza el aprendizaje. Eres responsable del linaje.' },
]

const MAESTROS = [
  { nombre:'Cuauhtémoc "El Águila" Hernández', rol:'Director Técnico · BJJ 4° Grado Negro', cred:'IBJJF · 18 años en gi y no-gi · Formado en Atos JJ', bio:'Fundador de Guerreros Aztecas. Linaje directo a Helio Gracie vía Atos.' },
  { nombre:'Itzel Vázquez', rol:'Head Coach · Muay Thai', cred:'WBC Muay Thai · 32-4-1 · Excampeona nacional', bio:'Peleó en Bangkok. Especialista en clinch y trabajo de codos.' },
  { nombre:'Diego "Tláloc" Ramírez', rol:'Coach · Boxeo & MMA', cred:'AMB Pro · 14-2 KO · Ex-prospecto Top Rank', bio:'Footwork de boxeo cubano, pegada de Sinaloa.' },
  { nombre:'Xōchitl Mendoza', rol:'Coach · Pequeños Guerreros', cred:'Cinturón Morado BJJ · Pedagogía infantil', bio:'Convierte niños tímidos en guerreros con respeto.' },
]

const TESTIMONIOS = [
  { quote:'Llegué buscando ponerme en forma y encontré una hermandad. El nivel técnico es serio, pero lo que te queda es la disciplina.', autor:'Andrés P.', desde:'Cinturón Azul · 2 años' },
  { quote:'Mi hijo era el más callado de su salón. Ahora es respetuoso, pero nadie le hace bullying. El programa de niños es oro.', autor:'Marisol T.', desde:'Madre de alumno · Pequeños Guerreros' },
  { quote:'Pasé de no poder dar tres rounds al saco a ganar mi primera pelea amateur en 14 meses. La estructura aquí funciona.', autor:'Rodrigo C.', desde:'MMA Amateur · 1.5 años' },
  { quote:'Después de un asalto necesité aprender defensa real. Aquí no te venden fantasías; te enseñan a sobrevivir.', autor:'Lucía M.', desde:'Defensa Personal · 8 meses' },
]

const PRECIOS = [
  { id:'iniciante', nombre:'Iniciante', nahuatl:'Tētlamacaz', precio:1200, incluye:['2 disciplinas a elegir','Acceso 8 clases / mes','Evaluación inicial','Uniforme de cortesía'], excluye:['Sparring full-contact','Programa competición'], cta:'Empezar aquí', destacado:false },
  { id:'guerrero', nombre:'Guerrero', nahuatl:'Tiyahcāuh', precio:1800, incluye:['Acceso ilimitado a TODAS las disciplinas','Sparring abierto sábados','Acompañamiento de cinturón','Acceso al área de fuerza','1 evaluación trimestral'], excluye:[], cta:'Más popular', destacado:true },
  { id:'aguila', nombre:'Águila', nahuatl:'Cuāuhtli', precio:2800, incluye:['Todo del plan Guerrero','Programa de competición','2 sesiones privadas / mes','Análisis de video personalizado','Apoyo logístico en torneos','Patrocinio de equipo de viaje'], excluye:[], cta:'Inscríbete a la elite', destacado:false },
]

const FAQS = [
  { q:'¿Necesito experiencia previa para empezar?', a:'No. La mayoría de nuestros alumnos llegan sin haber peleado en su vida. La clase de fundamentales corre en paralelo a la avanzada todos los días.' },
  { q:'¿Qué tan rápido voy a empezar a sparrear?', a:'En BJJ, generalmente desde la primera semana con compañeros del mismo nivel. En striking, después de 4-6 semanas de técnica. Nunca sparring full-contact sin la base lista.' },
  { q:'¿Cuánto cuesta la inscripción?', a:'No cobramos inscripción. Solo la primera mensualidad. Tampoco hay contratos de permanencia: si no es para ti, te vas.' },
  { q:'¿Qué necesito traer la primera clase?', a:'Ropa cómoda y agua. Te prestamos guantes y vendas para probar. El uniforme oficial llega con tu primera mensualidad.' },
  { q:'¿Aceptan mujeres?', a:'Sí, todas las clases son mixtas y respetuosas. Tenemos una clase semanal exclusiva para mujeres los miércoles 18:00. Aproximadamente 35% de nuestros alumnos son mujeres.' },
  { q:'¿Cómo funciona el sistema de cinturones de BJJ?', a:'Seguimos los lineamientos de la IBJJF: blanco → azul → morado → marrón → negro. Cada cinturón tiene 4 rayas. La progresión depende de asistencia, técnica y carácter, no solo de tiempo.' },
  { q:'¿Puedo hacer una clase de prueba?', a:'Sí. La primera clase es gratuita en cualquier disciplina. Reserva por WhatsApp con 24h de anticipación.' },
]

// ─── HELPERS ───

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useReveal()
  return <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

function StarSep({ size = 8, color = 'var(--ambar)' }: { size?: number; color?: string }) {
  return <span style={{ color, fontSize: size, lineHeight: 1 }}>✦</span>
}

function BeltGraphic({ color, stripes = 4 }: { color: string; stripes?: number }) {
  return (
    <div style={{ width: 220, height: 28, background: color, position: 'relative', flexShrink: 0, border: color === '#F5EFD9' ? '1px solid var(--ink-mute)' : 'none' }}>
      <div style={{ position:'absolute', right:0, top:0, bottom:0, width:60, background:'#0B0908' }} />
      {Array.from({ length: stripes }).map((_, i) => (
        <div key={i} style={{ position:'absolute', right: 8 + i * 9, top:4, bottom:4, width:3, background:'#E8DCC4', opacity:0.85 }} />
      ))}
    </div>
  )
}

function Placeholder({ label, style }: { label: string; style?: React.CSSProperties }) {
  return (
    <div style={{ position:'relative', background:'var(--bg-2)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid var(--line)', minHeight:200, ...style }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(135deg, rgba(232,220,196,0.04) 0 12px, rgba(232,220,196,0.08) 12px 24px)', pointerEvents:'none' }} />
      <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--ink-mute)', padding:'6px 10px', background:'var(--bg)', border:'1px solid var(--line)', position:'relative', zIndex:1 }}>{label}</span>
    </div>
  )
}

// ─── SECTIONS ───

function Nav() {
  return (
    <nav style={{ position:'sticky', top:0, zIndex:50, background:'rgba(11,9,8,0.78)', backdropFilter:'blur(14px)', borderBottom:'1px solid var(--line)' }}>
      <div className="shell">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', gap:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <Image src="/logo-guerreros-aztecas.png" alt="Guerreros Aztecas" width={38} height={38} style={{ borderRadius:'50%' }} />
            <div>
              <div className="t-display" style={{ fontSize:16 }}>Guerreros Aztecas</div>
              <div className="t-mono-sm" style={{ marginTop:3 }}>Fight Club · Coapan</div>
            </div>
          </div>
          <div className="nav-links" style={{ display:'flex', gap:28 }}>
            {['#disciplinas','#horarios','#cinturones','#maestros','#precios','#contacto'].map((href, i) => (
              <a key={href} href={href}>{['Disciplinas','Horarios','Cinturones','Maestros','Precios','Contacto'][i]}</a>
            ))}
          </div>
          <a href="#inscripcion" className="btn btn-rojo" style={{ padding:'12px 20px', fontSize:14 }}>Primera clase gratis</a>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section id="hero" style={{ position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      {/* Background */}
      <div aria-hidden style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 40%, rgba(212,165,71,0.10), transparent 55%)' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)', backgroundSize:'120px 120px', opacity:0.4, maskImage:'radial-gradient(ellipse at center, black 30%, transparent 80%)', WebkitMaskImage:'radial-gradient(ellipse at center, black 30%, transparent 80%)' }} />
      </div>
      <div className="shell" style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'160px 28px 80px', position:'relative', zIndex:1 }}>
        <Reveal>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:36 }}>
            <div className="t-mono-lg" style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap', justifyContent:'center' }}>
              <span style={{ color:'var(--jade)' }}>EST. 2014</span>
              <StarSep size={10} />
              <span>COAPAN · PUEBLA</span>
              <StarSep size={10} />
              <span style={{ color:'var(--rojo)' }}>FIGHT CLUB</span>
            </div>
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', inset:'-30px', borderRadius:'50%', background:'radial-gradient(circle, rgba(181,56,37,0.20), transparent 70%)', filter:'blur(20px)' }} />
              <Image src="/logo-guerreros-aztecas.png" alt="Guerreros Aztecas Fight Club" width={220} height={220} style={{ borderRadius:'50%', position:'relative', zIndex:1, boxShadow:'0 0 0 1px var(--line-strong)' }} />
            </div>
            <div style={{ textAlign:'center', position:'relative' }}>
              <h1 className="t-display" style={{ fontSize:'clamp(80px, 14vw, 220px)', letterSpacing:'-0.01em' }}>
                <span style={{ display:'block' }}>GUERREROS</span>
                <span style={{ display:'block', color:'var(--rojo)', fontStyle:'italic' }}>AZTECAS</span>
              </h1>
              <div className="t-cinzel" style={{ fontSize:14, color:'var(--ambar)', marginTop:24, display:'flex', justifyContent:'center', alignItems:'center', gap:18, flexWrap:'wrap' }}>
                <span>Disciplina</span><StarSep size={8} /><span>Respeto</span><StarSep size={8} /><span>Entrega</span>
              </div>
            </div>
            <p style={{ maxWidth:580, textAlign:'center', color:'var(--ink-dim)', fontSize:18, lineHeight:1.6, margin:0 }}>
              Escuela de combate fundada por <span style={{ color:'var(--ink)' }}>peleadores reales</span>. BJJ, Muay Thai, Boxeo y MMA bajo un mismo techo. Once años forjando guerreros con técnica, no con palabras.
            </p>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center', marginTop:12 }}>
              <a href="#inscripcion" className="btn btn-rojo">Primera clase gratis</a>
              <a href="#horarios" className="btn btn-ghost">Ver horarios</a>
            </div>
            <div style={{ display:'flex', gap:0, marginTop:64, border:'1px solid var(--line)', background:'var(--bg-2)', flexWrap:'wrap' }}>
              {[{n:'11',l:'años activos'},{n:'6',l:'disciplinas'},{n:'430+',l:'alumnos'},{n:'8',l:'cinturones negros'}].map((s,i) => (
                <div key={i} style={{ padding:'20px 36px', borderRight:i<3?'1px solid var(--line)':'none', textAlign:'center' }}>
                  <div className="t-display" style={{ fontSize:44, color:'var(--ambar)' }}>{s.n}</div>
                  <div className="t-mono-sm" style={{ marginTop:6 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Ticker() {
  const items = [
    'PRIMERA CLASE GRATIS', 'BJJ · MUAY THAI · BOXEO · MMA', 'SIN CONTRATOS',
    'COAPAN · PUEBLA', 'DISCIPLINA · RESPETO · ENTREGA', '11 AÑOS FORJANDO GUERREROS',
  ]
  const doubled = [...items, ...items]
  return (
    <div style={{ display:'flex', whiteSpace:'nowrap', overflow:'hidden', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)', background:'var(--bg-2)' }}>
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span key={i} style={{ color: i % 3 === 1 ? 'var(--ambar)' : i % 3 === 2 ? 'var(--rojo)' : 'var(--ink)' }}>
            {t} <span style={{ color:'var(--ambar)', margin:'0 12px' }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Filosofia() {
  const valores = [
    { key:'Disciplina', n:'I', color:'var(--ambar)', copy:'Llegar al tatami cuando no tienes ganas. Repetir el movimiento la diezmilésima vez. La disciplina es el único camino hacia la habilidad.', nahuatl:'Nemiliztli' },
    { key:'Respeto', n:'II', color:'var(--jade-2)', copy:'Por tu maestro, por tu compañero, por tu adversario. Aquí entrenas con personas que confían en ti. La técnica sin respeto es violencia. Con respeto, es arte.', nahuatl:'Tlazohtla' },
    { key:'Entrega', n:'III', color:'var(--rojo)', copy:'Dejar el ego en la entrada. Aceptar la derrota como maestra. Volver mañana. La entrega no es sufrir; es elegir todos los días seguir caminando.', nahuatl:'Mocemmaca' },
  ]
  return (
    <section id="filosofia" className="section">
      <div className="shell">
        <div className="section-head">
          <div>
            <Reveal><div className="eyebrow">Código de la casa · Tōllān</div></Reveal>
            <Reveal delay={120}>
              <h2 className="t-display" style={{ fontSize:'clamp(48px,6vw,96px)', marginTop:18 }}>
                Tres palabras.<br /><span style={{ color:'var(--ambar)', fontStyle:'italic' }}>Tres compromisos.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={240}><p style={{ color:'var(--ink-dim)', maxWidth:360 }}>Las palabras que rodean nuestro escudo no son adorno: definen quién pertenece a esta escuela y quién no.</p></Reveal>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:0, border:'1px solid var(--line)' }}>
          {valores.map((v, i) => (
            <Reveal key={v.key} delay={i*120}>
              <div style={{ padding:'48px 36px 56px', borderRight:i<2?'1px solid var(--line)':'none', position:'relative', minHeight:460, display:'flex', flexDirection:'column', justifyContent:'space-between', background:'var(--bg-2)' }}>
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32 }}>
                    <span className="t-cinzel" style={{ fontSize:11, color:v.color, letterSpacing:'0.24em' }}>{v.n}</span>
                    <span className="t-mono-sm">{v.nahuatl}</span>
                  </div>
                  <div style={{ color:v.color, marginBottom:28, fontSize:64, fontFamily:"'Big Shoulders Display', sans-serif", fontWeight:900 }}>✦</div>
                  <h3 className="t-display" style={{ fontSize:64, marginBottom:20 }}>{v.key}</h3>
                  <p style={{ color:'var(--ink-dim)', fontSize:15, lineHeight:1.65, margin:0 }}>{v.copy}</p>
                </div>
                <div style={{ marginTop:36, paddingTop:24, borderTop:'1px solid var(--line)' }}>
                  <div className="t-mono-sm" style={{ display:'flex', justifyContent:'space-between', color:'var(--ink-mute)' }}>
                    <span>{String(i+1).padStart(2,'0')} / 03</span><span>—</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Disciplinas() {
  const [hovered, setHovered] = useState<string|null>(null)
  const accentVar = (a: string) => `var(--${a})`
  return (
    <section id="disciplinas" className="section" style={{ background:'var(--bg-2)' }}>
      <div className="shell">
        <div className="section-head">
          <div>
            <Reveal><div className="eyebrow">Las seis órdenes</div></Reveal>
            <Reveal delay={100}><h2 className="t-display" style={{ fontSize:'clamp(48px,6vw,96px)', marginTop:18 }}>Seis caminos<br /><span style={{ color:'var(--rojo)', fontStyle:'italic' }}>al mismo guerrero.</span></h2></Reveal>
          </div>
          <Reveal delay={200}><p style={{ color:'var(--ink-dim)', maxWidth:360 }}>Cada disciplina entrena algo distinto. Juntas forman un peleador completo. Empezar por una no te cierra las otras.</p></Reveal>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:1, background:'var(--line)', border:'1px solid var(--line)' }}>
          {DISCIPLINAS.map((d, i) => {
            const isHover = hovered === d.id
            return (
              <Reveal key={d.id} delay={i*60}>
                <article onMouseEnter={() => setHovered(d.id)} onMouseLeave={() => setHovered(null)}
                  style={{ background:isHover?'var(--bg-3)':'var(--bg)', padding:32, minHeight:360, display:'flex', flexDirection:'column', justifyContent:'space-between', cursor:'pointer', transition:'background .22s ease', position:'relative', overflow:'hidden' }}>
                  <div className="t-display" style={{ position:'absolute', right:-10, bottom:-40, fontSize:220, color:isHover?accentVar(d.accent):'var(--bg-3)', opacity:isHover?0.16:0.4, transition:'all .3s ease', pointerEvents:'none', lineHeight:0.8 }}>{d.numeral}</div>
                  <div style={{ position:'relative', zIndex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
                      <span className="t-mono-sm" style={{ color:accentVar(d.accent) }}>{d.numeral} / VI</span>
                      <span className="t-mono-sm" style={{ fontStyle:'italic' }}>{d.nahuatl}</span>
                    </div>
                    <h3 className="t-display" style={{ fontSize:42, marginBottom:6 }}>{d.nombre}</h3>
                    <div className="t-cinzel" style={{ fontSize:11, color:accentVar(d.accent), marginBottom:18 }}>{d.sub}</div>
                    <p style={{ color:'var(--ink-dim)', fontSize:14, lineHeight:1.6, margin:0, maxWidth:320 }}>{d.blurb}</p>
                  </div>
                  <div style={{ position:'relative', zIndex:1, paddingTop:28, marginTop:28, borderTop:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div className="t-mono-sm"><span style={{ color:'var(--ink-mute)' }}>NIVEL </span><span style={{ color:'var(--ink)' }}>{d.nivel}</span></div>
                    <div className="t-mono-sm" style={{ color:accentVar(d.accent) }}>{d.duracion}</div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Horarios() {
  const [filterDisc, setFilterDisc] = useState('todas')
  const disc = (id: string) => DISCIPLINAS.find(d => d.id === id)
  return (
    <section id="horarios" className="section">
      <div className="shell">
        <div className="section-head">
          <div>
            <Reveal><div className="eyebrow">Cuando entrenamos</div></Reveal>
            <Reveal delay={100}><h2 className="t-display" style={{ fontSize:'clamp(48px,6vw,96px)', marginTop:18 }}>Horarios<br /><span style={{ color:'var(--jade-2)', fontStyle:'italic' }}>de la semana.</span></h2></Reveal>
          </div>
          <Reveal delay={200}><p style={{ color:'var(--ink-dim)', maxWidth:360 }}>Filtra por disciplina. Los horarios pico (07:30 y 19:30) llenan: llega 10 min antes.</p></Reveal>
        </div>
        <Reveal>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:40, alignItems:'center' }}>
            <span className="t-mono-sm" style={{ color:'var(--ink-mute)', marginRight:12 }}>FILTRAR:</span>
            {(['todas', ...DISCIPLINAS.map(d => d.id)] as string[]).map(id => {
              const d = DISCIPLINAS.find(x => x.id === id)
              return (
                <button key={id} onClick={() => setFilterDisc(id)} className="t-mono-sm"
                  style={{ appearance:'none', padding:'8px 14px', background:filterDisc===id?'var(--ink)':'transparent', color:filterDisc===id?'var(--bg)':'var(--ink-dim)', border:'1px solid '+(filterDisc===id?'var(--ink)':'var(--line-strong)'), cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.18em', fontFamily:'inherit', fontSize:10, transition:'all .15s' }}>
                  {d?.nombre ?? 'Todas'}
                </button>
              )
            })}
          </div>
        </Reveal>
        <Reveal>
          <div style={{ border:'1px solid var(--line)', overflowX:'auto' }}>
            <table style={{ width:'100%', minWidth:800, borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'var(--bg-2)' }}>
                  <th className="t-mono-sm" style={{ padding:18, textAlign:'left', borderBottom:'1px solid var(--line)', borderRight:'1px solid var(--line)', width:110 }}>HORA</th>
                  {DIAS_FULL.map((d,i) => (
                    <th key={d} className="t-mono-sm" style={{ padding:18, textAlign:'left', borderBottom:'1px solid var(--line)', borderRight:i<5?'1px solid var(--line)':'none' }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HORARIO.map((row, rowIdx) => (
                  <tr key={row.h} style={{ borderTop:rowIdx>0?'1px solid var(--line)':'none' }}>
                    <td style={{ padding:18, borderRight:'1px solid var(--line)', background:'var(--bg-2)' }}>
                      <div className="t-display" style={{ fontSize:28, color:'var(--ambar)' }}>{row.h}</div>
                    </td>
                    {(['l','m','x','j','v','s'] as (keyof typeof row)[]).map((day, dayIdx) => {
                      const cls = row[day] as string | null
                      const d = cls ? disc(cls) : null
                      const dim = filterDisc !== 'todas' && cls && cls !== filterDisc
                      return (
                        <td key={String(day)} style={{ padding:0, borderRight:dayIdx<5?'1px solid var(--line)':'none', verticalAlign:'top', height:70, opacity:dim?0.18:1, transition:'opacity .2s' }}>
                          {d ? (
                            <div style={{ padding:14, height:'100%', borderLeft:`3px solid var(--${d.accent})`, cursor:'pointer', transition:'background .15s' }}
                              onMouseEnter={e => (e.currentTarget.style.background='var(--bg-3)')}
                              onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                              <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{d.nombre}</div>
                              <div className="t-mono-sm">{d.duracion}</div>
                            </div>
                          ) : (
                            <div style={{ height:'100%', width:'100%', backgroundImage:'repeating-linear-gradient(135deg, transparent 0 6px, var(--line) 6px 7px)', opacity:0.4 }} />
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <div className="t-mono-sm" style={{ color:'var(--ink-mute)', marginTop:16, textAlign:'right' }}>DOMINGOS · DESCANSO Y RECUPERACIÓN</div>
      </div>
    </section>
  )
}

function Cinturones() {
  const [open, setOpen] = useState<string|null>('blanco')
  return (
    <section id="cinturones" className="section" style={{ background:'var(--bg-2)' }}>
      <div className="shell">
        <div className="section-head">
          <div>
            <Reveal><div className="eyebrow">El camino de la faja · BJJ</div></Reveal>
            <Reveal delay={100}><h2 className="t-display" style={{ fontSize:'clamp(48px,6vw,96px)', marginTop:18 }}>Cinco cinturones,<br /><span style={{ color:'var(--ambar)', fontStyle:'italic' }}>una vida.</span></h2></Reveal>
          </div>
          <Reveal delay={200}><p style={{ color:'var(--ink-dim)', maxWidth:360 }}>Sistema IBJJF. La progresión depende de asistencia, técnica y carácter — nunca solo del calendario.</p></Reveal>
        </div>
        <div style={{ border:'1px solid var(--line)' }}>
          {CINTURONES.map((c, i) => {
            const isOpen = open === c.id
            return (
              <div key={c.id} style={{ borderTop:i>0?'1px solid var(--line)':'none' }}>
                <button onClick={() => setOpen(isOpen ? null : c.id)} style={{ appearance:'none', background:'transparent', border:'none', width:'100%', padding:0, cursor:'pointer', display:'block', textAlign:'left' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:28, padding:'28px 36px', flexWrap:'wrap' }}>
                    <span className="t-display" style={{ fontSize:64, color:'var(--ink-mute)', width:80, textAlign:'right', fontVariantNumeric:'tabular-nums' }}>{String(i+1).padStart(2,'0')}</span>
                    <BeltGraphic color={c.color} stripes={4} />
                    <div style={{ flex:1, minWidth:200 }}>
                      <div className="t-mono-sm" style={{ marginBottom:4 }}>{c.nahuatl}</div>
                      <h3 className="t-display" style={{ fontSize:40 }}>Cinturón {c.nombre}</h3>
                    </div>
                    <div className="t-mono-sm" style={{ color:'var(--ambar)', textAlign:'right' }}>{c.tiempo}</div>
                    <span style={{ color:'var(--ink)', fontSize:22, transform:isOpen?'rotate(45deg)':'rotate(0)', transition:'transform .2s', display:'inline-block' }}>+</span>
                  </div>
                </button>
                {isOpen && (
                  <div style={{ padding:'0 36px 36px 156px', display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:60, flexWrap:'wrap' }}>
                    <div>
                      <div className="t-mono-sm" style={{ color:'var(--ambar)', marginBottom:12 }}>FILOSOFÍA</div>
                      <p style={{ fontSize:17, lineHeight:1.6, color:'var(--ink)', marginTop:0, marginBottom:28 }}>{c.filosofia}</p>
                      <div className="t-mono-sm" style={{ color:'var(--ambar)', marginBottom:12 }}>HABILIDADES CLAVE</div>
                      <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                        {c.skills.map((s, si) => (
                          <li key={si} style={{ padding:'10px 0', borderBottom:si<c.skills.length-1?'1px solid var(--line)':'none', display:'flex', gap:14, color:'var(--ink-dim)', fontSize:14 }}>
                            <span style={{ color:'var(--ambar)' }}>·</span><span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="t-mono-sm" style={{ color:'var(--ambar)', marginBottom:12 }}>SISTEMA DE GRADOS</div>
                      <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                        {c.grados.map((g, gi) => (
                          <li key={gi} className="t-mono-sm" style={{ padding:'10px 0', color:'var(--ink-dim)', borderBottom:'1px solid var(--line)' }}>{g}</li>
                        ))}
                      </ul>
                      <div style={{ marginTop:32, padding:20, background:'var(--bg-3)', border:'1px solid var(--line)' }}>
                        <div className="t-mono-sm" style={{ color:'var(--ambar)', marginBottom:6 }}>TIEMPO TÍPICO</div>
                        <div className="t-display" style={{ fontSize:32 }}>{c.tiempo}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Maestros() {
  return (
    <section id="maestros" className="section">
      <div className="shell">
        <div className="section-head">
          <div>
            <Reveal><div className="eyebrow">Tlamachtiani · Los que enseñan</div></Reveal>
            <Reveal delay={100}><h2 className="t-display" style={{ fontSize:'clamp(48px,6vw,96px)', marginTop:18 }}>Quienes te<br /><span style={{ color:'var(--rojo)', fontStyle:'italic' }}>van a forjar.</span></h2></Reveal>
          </div>
          <Reveal delay={200}><p style={{ color:'var(--ink-dim)', maxWidth:360 }}>Cuatro instructores principales. Todos pelearon o pelean. Ninguno aprendió por YouTube. Linaje verificable.</p></Reveal>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:1, background:'var(--line)', border:'1px solid var(--line)' }}>
          {MAESTROS.map((m, i) => (
            <Reveal key={m.nombre} delay={i*80}>
              <article style={{ background:'var(--bg)', display:'flex', flexDirection:'column' }}>
                <Placeholder label={`RETRATO · ${m.nombre.split(' ')[0].toUpperCase()}`} style={{ aspectRatio:'3/4', borderLeft:0, borderRight:0, borderTop:0 }} />
                <div style={{ padding:24 }}>
                  <div className="t-mono-sm" style={{ color:'var(--ambar)', marginBottom:12 }}>{String(i+1).padStart(2,'0')} / 04</div>
                  <h3 style={{ fontFamily:"'Big Shoulders Display', sans-serif", fontWeight:800, fontSize:22, lineHeight:1.1, textTransform:'uppercase', marginBottom:8 }}>{m.nombre}</h3>
                  <div className="t-cinzel" style={{ fontSize:10, color:'var(--rojo)', marginBottom:16 }}>{m.rol}</div>
                  <div className="t-mono-sm" style={{ marginBottom:14 }}>{m.cred}</div>
                  <p style={{ color:'var(--ink-dim)', fontSize:14, lineHeight:1.55, margin:0 }}>{m.bio}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Galeria() {
  const items = [
    { label:'SPARRING · BJJ', tall:true },
    { label:'TATAMI · CLASE NOCTURNA', wide:true },
    { label:'COSTAL · MUAY THAI' },
    { label:'GRADUACIÓN · CINTURÓN AZUL' },
    { label:'COMPETENCIA · NACIONAL 2024', wide:true },
    { label:'PEQUEÑOS GUERREROS' },
  ]
  return (
    <section id="galeria" className="section" style={{ background:'var(--bg-2)' }}>
      <div className="shell">
        <div className="section-head">
          <div>
            <Reveal><div className="eyebrow">El gimnasio</div></Reveal>
            <Reveal delay={100}><h2 className="t-display" style={{ fontSize:'clamp(48px,6vw,96px)', marginTop:18 }}>Mira<br /><span style={{ color:'var(--ambar)', fontStyle:'italic' }}>cómo entrenamos.</span></h2></Reveal>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gridAutoRows:'180px', gap:8 }}>
          {items.map((it, i) => (
            <Reveal key={i} delay={i*50}>
              <Placeholder label={it.label} style={{ width:'100%', height:'100%', gridColumn:it.wide?'span 2':'span 1', gridRow:it.tall?'span 2':'span 1', aspectRatio:'auto', border:0 }} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonios() {
  const [idx, setIdx] = useState(0)
  const t = TESTIMONIOS[idx]
  return (
    <section id="testimonios" className="section">
      <div className="shell">
        <div className="section-head">
          <div>
            <Reveal><div className="eyebrow">Voces del tatami</div></Reveal>
            <Reveal delay={100}><h2 className="t-display" style={{ fontSize:'clamp(48px,6vw,96px)', marginTop:18 }}>Lo que dicen<br /><span style={{ color:'var(--jade-2)', fontStyle:'italic' }}>quienes ya entrenan.</span></h2></Reveal>
          </div>
        </div>
        <Reveal>
          <div style={{ border:'1px solid var(--line)', background:'var(--bg-2)', padding:'64px 56px', position:'relative' }}>
            <div style={{ position:'absolute', top:24, left:36, color:'var(--rojo)', fontSize:100, fontFamily:"'Big Shoulders Display', sans-serif", fontWeight:900, lineHeight:1, opacity:0.4 }}>"</div>
            <blockquote style={{ margin:0, fontSize:'clamp(22px,2.4vw,32px)', lineHeight:1.4, color:'var(--ink)', maxWidth:980, fontStyle:'italic', fontWeight:300 }}>{t.quote}</blockquote>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:48, flexWrap:'wrap', gap:24 }}>
              <div>
                <div style={{ fontFamily:"'Big Shoulders Display', sans-serif", fontWeight:800, fontSize:22, textTransform:'uppercase' }}>{t.autor}</div>
                <div className="t-mono-sm" style={{ color:'var(--ambar)', marginTop:6 }}>{t.desde}</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:18 }}>
                <button onClick={() => setIdx((idx-1+TESTIMONIOS.length)%TESTIMONIOS.length)} style={{ appearance:'none', background:'transparent', border:'1px solid var(--line-strong)', color:'var(--ink)', width:40, height:40, cursor:'pointer', fontSize:16 }}>←</button>
                <div className="t-mono-sm" style={{ fontVariantNumeric:'tabular-nums' }}>{String(idx+1).padStart(2,'0')} / {String(TESTIMONIOS.length).padStart(2,'0')}</div>
                <button onClick={() => setIdx((idx+1)%TESTIMONIOS.length)} style={{ appearance:'none', background:'transparent', border:'1px solid var(--line-strong)', color:'var(--ink)', width:40, height:40, cursor:'pointer', fontSize:16 }}>→</button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Precios() {
  return (
    <section id="precios" className="section" style={{ background:'var(--bg-2)' }}>
      <div className="shell">
        <div className="section-head">
          <div>
            <Reveal><div className="eyebrow">Membresías · Sin contratos</div></Reveal>
            <Reveal delay={100}><h2 className="t-display" style={{ fontSize:'clamp(48px,6vw,96px)', marginTop:18 }}>Tres rangos.<br /><span style={{ color:'var(--rojo)', fontStyle:'italic' }}>Tres precios.</span></h2></Reveal>
          </div>
          <Reveal delay={200}><p style={{ color:'var(--ink-dim)', maxWidth:360 }}>Cero costo de inscripción. Cancelas cuando quieras. Si en 14 días no estás convencido, te devolvemos el mes.</p></Reveal>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:1, background:'var(--line)', border:'1px solid var(--line)' }}>
          {PRECIOS.map((p, i) => (
            <Reveal key={p.id} delay={i*100}>
              <article style={{ background:p.destacado?'var(--bg-3)':'var(--bg)', padding:36, position:'relative', minHeight:600, display:'flex', flexDirection:'column', ...(p.destacado?{boxShadow:'inset 0 0 0 1px var(--ambar)'}:{}) }}>
                {p.destacado && <div style={{ position:'absolute', top:-1, right:-1, background:'var(--ambar)', color:'var(--bg)', padding:'6px 14px', fontFamily:"'JetBrains Mono', monospace", fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', fontWeight:700 }}>RECOMENDADO</div>}
                <div className="t-mono-sm" style={{ marginBottom:6 }}>{p.nahuatl}</div>
                <h3 className="t-display" style={{ fontSize:56, color:p.destacado?'var(--ambar)':'var(--ink)', lineHeight:0.9 }}>{p.nombre}</h3>
                <div style={{ marginTop:28, marginBottom:32, display:'flex', alignItems:'baseline', gap:6 }}>
                  <span className="t-mono" style={{ color:'var(--ink-dim)' }}>$</span>
                  <span className="t-display" style={{ fontSize:72 }}>{p.precio.toLocaleString()}</span>
                  <span className="t-mono" style={{ color:'var(--ink-dim)' }}>MXN / mes</span>
                </div>
                <div className="t-mono-sm" style={{ color:'var(--ambar)', marginBottom:12 }}>INCLUYE</div>
                <ul style={{ listStyle:'none', padding:0, margin:0, marginBottom:20, flex:1 }}>
                  {p.incluye.map((it, ii) => (
                    <li key={ii} style={{ padding:'12px 0', borderBottom:'1px solid var(--line)', display:'flex', gap:12, fontSize:14, color:'var(--ink)' }}>
                      <span style={{ color:'var(--jade-2)', flexShrink:0 }}>✓</span><span>{it}</span>
                    </li>
                  ))}
                  {p.excluye.map((it, ii) => (
                    <li key={'x'+ii} style={{ padding:'12px 0', borderBottom:'1px solid var(--line)', display:'flex', gap:12, fontSize:14, color:'var(--ink-mute)', textDecoration:'line-through', textDecorationColor:'var(--rojo)' }}>
                      <span style={{ color:'var(--rojo)', flexShrink:0 }}>✕</span><span>{it}</span>
                    </li>
                  ))}
                </ul>
                <a href="#inscripcion" className={p.destacado?'btn btn-rojo':'btn btn-ghost'} style={{ width:'100%', justifyContent:'space-between' }}>{p.cta}</a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Inscripcion() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({ nombre:'', telefono:'', email:'', edad:'', experiencia:'', disciplina:'', membresia:'guerrero' })
  const set = (k: string, v: string) => setData(p => ({ ...p, [k]: v }))
  const steps = [{ label:'Tus datos', n:'I' },{ label:'Sobre ti', n:'II' },{ label:'Tu camino', n:'III' },{ label:'Membresía', n:'IV' },{ label:'Listo', n:'V' }]
  const inputStyle: React.CSSProperties = { width:'100%', appearance:'none' as const, background:'var(--bg)', border:'1px solid var(--line-strong)', color:'var(--ink)', padding:'14px 16px', fontSize:15, fontFamily:'inherit', outline:'none' }

  return (
    <section id="inscripcion" className="section">
      <div className="shell">
        <div className="section-head">
          <div>
            <Reveal><div className="eyebrow">Primera clase gratis</div></Reveal>
            <Reveal delay={100}><h2 className="t-display" style={{ fontSize:'clamp(48px,6vw,96px)', marginTop:18 }}>Inscríbete<br /><span style={{ color:'var(--rojo)', fontStyle:'italic' }}>al tatami.</span></h2></Reveal>
          </div>
          <Reveal delay={200}><p style={{ color:'var(--ink-dim)', maxWidth:360 }}>5 pasos cortos. Te contactamos por WhatsApp para confirmar tu primera clase de prueba gratuita.</p></Reveal>
        </div>
        <div style={{ border:'1px solid var(--line)', background:'var(--bg-2)' }}>
          <div style={{ display:'grid', gridTemplateColumns:`repeat(${steps.length}, 1fr)`, borderBottom:'1px solid var(--line)', overflowX:'auto' }}>
            {steps.map((s, i) => {
              const active = i === step, done = i < step
              return (
                <button key={s.label} onClick={() => i < step && setStep(i)} disabled={i > step}
                  style={{ appearance:'none', background:active?'var(--bg-3)':'transparent', border:'none', borderRight:i<steps.length-1?'1px solid var(--line)':'none', borderBottom:active?'3px solid var(--rojo)':'3px solid transparent', padding:'20px 24px', color:active?'var(--ink)':done?'var(--ambar)':'var(--ink-mute)', cursor:i<=step?'pointer':'default', textAlign:'left', transition:'all .2s', minWidth:120 }}>
                  <div className="t-mono-sm" style={{ marginBottom:4 }}>PASO {s.n}</div>
                  <div style={{ fontFamily:"'Big Shoulders Display', sans-serif", fontWeight:800, fontSize:18, textTransform:'uppercase' }}>{s.label}</div>
                </button>
              )
            })}
          </div>
          <div style={{ padding:'48px 56px', minHeight:380 }}>
            {step === 0 && (
              <div>
                <h3 className="t-display" style={{ fontSize:36, marginBottom:8 }}>Empecemos por lo básico</h3>
                <p style={{ color:'var(--ink-dim)', maxWidth:600, marginTop:0, marginBottom:36 }}>Solo lo que necesitamos para contactarte y reservar tu primera clase.</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:20 }}>
                  {[{l:'Nombre completo',k:'nombre',p:'Cuauhtémoc Hernández'},{l:'Teléfono / WhatsApp',k:'telefono',p:'+52 222 123 4567'},{l:'Email',k:'email',p:'tu@correo.com'}].map(f => (
                    <label key={f.k}><div className="t-mono-sm" style={{ color:'var(--ink-dim)', marginBottom:8 }}>{f.l}</div>
                      <input style={inputStyle} value={data[f.k as keyof typeof data]} onChange={e => set(f.k, e.target.value)} placeholder={f.p} /></label>
                  ))}
                </div>
              </div>
            )}
            {step === 1 && (
              <div>
                <h3 className="t-display" style={{ fontSize:36, marginBottom:8 }}>Cuéntanos un poco</h3>
                <p style={{ color:'var(--ink-dim)', marginTop:0, marginBottom:36 }}>Esto nos ayuda a recomendarte el grupo correcto.</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:20 }}>
                  <label><div className="t-mono-sm" style={{ color:'var(--ink-dim)', marginBottom:8 }}>Edad</div><input style={inputStyle} value={data.edad} onChange={e => set('edad', e.target.value)} placeholder="28" /></label>
                  <label><div className="t-mono-sm" style={{ color:'var(--ink-dim)', marginBottom:8 }}>Experiencia previa</div>
                    <select style={inputStyle} value={data.experiencia} onChange={e => set('experiencia', e.target.value)}>
                      <option value="">— Selecciona —</option>
                      {['Ninguna','Algo de boxeo / striking','Algo de grappling / BJJ','Peleador activo','Otra disciplina'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </label>
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h3 className="t-display" style={{ fontSize:36, marginBottom:8 }}>¿Qué quieres entrenar?</h3>
                <p style={{ color:'var(--ink-dim)', marginTop:0, marginBottom:36 }}>Puedes cambiar después. La mayoría empieza con una y rota.</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12 }}>
                  {DISCIPLINAS.map(d => (
                    <button key={d.id} onClick={() => set('disciplina', d.id)}
                      style={{ appearance:'none', background:data.disciplina===d.id?`var(--${d.accent})`:'var(--bg)', border:'1px solid '+(data.disciplina===d.id?`var(--${d.accent})`:'var(--line-strong)'), color:data.disciplina===d.id?'var(--bg)':'var(--ink)', padding:'20px 18px', cursor:'pointer', textAlign:'left', transition:'all .15s' }}>
                      <div className="t-mono-sm" style={{ opacity:0.7, marginBottom:6 }}>{d.numeral}</div>
                      <div style={{ fontFamily:"'Big Shoulders Display', sans-serif", fontWeight:800, fontSize:22, textTransform:'uppercase' }}>{d.nombre}</div>
                      <div className="t-mono-sm" style={{ opacity:0.7, marginTop:6 }}>{d.duracion}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h3 className="t-display" style={{ fontSize:36, marginBottom:8 }}>Elige tu rango</h3>
                <p style={{ color:'var(--ink-dim)', marginTop:0, marginBottom:36 }}>Puedes cambiar de plan en cualquier momento, sin penalización.</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12 }}>
                  {PRECIOS.map(p => (
                    <button key={p.id} onClick={() => set('membresia', p.id)}
                      style={{ appearance:'none', background:data.membresia===p.id?'var(--bg-3)':'var(--bg)', border:'1px solid '+(data.membresia===p.id?'var(--ambar)':'var(--line-strong)'), boxShadow:data.membresia===p.id?'inset 0 0 0 1px var(--ambar)':'none', color:'var(--ink)', padding:20, cursor:'pointer', textAlign:'left' }}>
                      <div className="t-mono-sm" style={{ color:'var(--ambar)', marginBottom:6 }}>{p.nahuatl}</div>
                      <div className="t-display" style={{ fontSize:32 }}>{p.nombre}</div>
                      <div className="t-mono" style={{ marginTop:8 }}>${p.precio.toLocaleString()} MXN/mes</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 4 && (
              <div>
                <h3 className="t-display" style={{ fontSize:36, marginBottom:8 }}>Listo, guerrero.</h3>
                <p style={{ color:'var(--ink-dim)', marginTop:0, marginBottom:36 }}>Te contactamos por WhatsApp en menos de 24 horas para agendar tu primera clase de prueba gratis.</p>
                <div style={{ background:'var(--bg)', border:'1px solid var(--line-strong)', padding:28, marginTop:20 }}>
                  <div className="t-mono-sm" style={{ color:'var(--ambar)', marginBottom:18 }}>RESUMEN</div>
                  {[{k:'Nombre',v:data.nombre||'—'},{k:'Contacto',v:data.telefono||data.email||'—'},{k:'Disciplina',v:DISCIPLINAS.find(d=>d.id===data.disciplina)?.nombre||'A confirmar'},{k:'Membresía',v:PRECIOS.find(p=>p.id===data.membresia)?.nombre||'—'}].map(r => (
                    <div key={r.k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--line)', fontSize:14 }}>
                      <span className="t-mono-sm">{r.k}</span><span style={{ color:'var(--ink)' }}>{r.v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:32, display:'flex', gap:14, flexWrap:'wrap' }}>
                  <a href={`https://wa.me/522224422110?text=Hola%2C+quiero+inscribirme.+Nombre:+${encodeURIComponent(data.nombre)}`} target="_blank" rel="noopener noreferrer" className="btn btn-rojo">Confirmar por WhatsApp</a>
                  <button className="btn btn-ghost" style={{ border:'1px solid var(--line-strong)' }} onClick={() => setStep(0)}>Empezar de nuevo</button>
                </div>
              </div>
            )}
          </div>
          {step < 4 && (
            <div style={{ borderTop:'1px solid var(--line)', padding:'20px 56px', display:'flex', justifyContent:'space-between' }}>
              <button onClick={() => setStep(Math.max(0, step-1))} disabled={step===0}
                style={{ appearance:'none', background:'transparent', border:'1px solid var(--line-strong)', padding:'14px 24px', color:'var(--ink)', cursor:step===0?'default':'pointer', opacity:step===0?0.3:1, fontFamily:"'Big Shoulders Display', sans-serif", fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em', fontSize:14 }}>← Atrás</button>
              <button onClick={() => setStep(Math.min(4, step+1))} className="btn btn-rojo">{step===3?'Revisar':'Continuar'}</button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Ubicacion() {
  return (
    <section id="contacto" className="section" style={{ background:'var(--bg-2)' }}>
      <div className="shell">
        <div className="section-head">
          <div>
            <Reveal><div className="eyebrow">Dónde nos encontramos</div></Reveal>
            <Reveal delay={100}><h2 className="t-display" style={{ fontSize:'clamp(48px,6vw,96px)', marginTop:18 }}>Visítanos en<br /><span style={{ color:'var(--jade-2)', fontStyle:'italic' }}>Coapan, Puebla.</span></h2></Reveal>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:1, background:'var(--line)', border:'1px solid var(--line)' }}>
          <Placeholder label="MAPA · COAPAN PUEBLA" style={{ minHeight:400, height:'100%', border:0 }} />
          <div style={{ background:'var(--bg)', padding:'40px 36px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            <div>
              <div className="t-mono-sm" style={{ color:'var(--ambar)', marginBottom:16 }}>DIRECCIÓN</div>
              <div style={{ fontFamily:"'Big Shoulders Display', sans-serif", fontWeight:800, fontSize:32, lineHeight:1.1, textTransform:'uppercase', marginBottom:32 }}>
                Calle Reforma 24<br />Barrio de San Miguel<br />Coapan, Puebla 72980
              </div>
              <div className="t-mono-sm" style={{ color:'var(--ambar)', marginBottom:16 }}>HORARIO DE RECEPCIÓN</div>
              <div style={{ marginBottom:32 }}>
                {[{k:'Lunes a Viernes',v:'06:00 — 22:00'},{k:'Sábado',v:'07:00 — 14:00'},{k:'Domingo',v:'Cerrado'}].map(r => (
                  <div key={r.k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--line)', fontSize:14 }}>
                    <span className="t-mono-sm">{r.k}</span><span style={{ color:'var(--ink)' }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="t-mono-sm" style={{ color:'var(--ambar)', marginBottom:16 }}>CONTACTO</div>
              <div>
                {[{k:'WhatsApp',v:'+52 222 4422 110'},{k:'Email',v:'contacto@guerrerosaztecas.mx'}].map(r => (
                  <div key={r.k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--line)', fontSize:14 }}>
                    <span className="t-mono-sm">{r.k}</span><span style={{ color:'var(--ink)' }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop:32, display:'flex', gap:12, flexWrap:'wrap' }}>
              <a href="https://maps.google.com/?q=Coapan+Puebla" target="_blank" rel="noopener noreferrer" className="btn btn-rojo">Cómo llegar</a>
              <a href="https://wa.me/522224422110" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">WhatsApp directo</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const [open, setOpen] = useState<number|null>(0)
  return (
    <section id="faq" className="section">
      <div className="shell" style={{ maxWidth:980 }}>
        <div className="section-head">
          <div>
            <Reveal><div className="eyebrow">Preguntas frecuentes</div></Reveal>
            <Reveal delay={100}><h2 className="t-display" style={{ fontSize:'clamp(48px,6vw,96px)', marginTop:18 }}>Lo que todos<br /><span style={{ color:'var(--ambar)', fontStyle:'italic' }}>preguntan primero.</span></h2></Reveal>
          </div>
        </div>
        <div style={{ borderTop:'1px solid var(--line)' }}>
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={i} style={{ borderBottom:'1px solid var(--line)' }}>
                <button onClick={() => setOpen(isOpen ? null : i)}
                  style={{ appearance:'none', background:'transparent', border:'none', width:'100%', padding:'24px 0', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', color:'var(--ink)', textAlign:'left', gap:24 }}>
                  <span style={{ display:'flex', gap:24, alignItems:'baseline' }}>
                    <span className="t-mono-sm" style={{ color:'var(--ambar)', flexShrink:0 }}>{String(i+1).padStart(2,'0')}</span>
                    <span style={{ fontFamily:"'Big Shoulders Display', sans-serif", fontWeight:700, fontSize:22, textTransform:'uppercase', lineHeight:1.2 }}>{f.q}</span>
                  </span>
                  <span style={{ fontSize:22, transform:isOpen?'rotate(45deg)':'rotate(0)', transition:'transform .2s', display:'inline-block', flexShrink:0 }}>+</span>
                </button>
                {isOpen && <div style={{ padding:'0 0 28px 64px', color:'var(--ink-dim)', fontSize:16, lineHeight:1.6, maxWidth:720 }}>{f.a}</div>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background:'var(--bg-2)', borderTop:'1px solid var(--line-strong)', paddingTop:80, paddingBottom:40 }}>
      <div className="shell">
        <div className="t-display" style={{ fontSize:'clamp(80px,14vw,220px)', lineHeight:0.9, marginBottom:60 }}>
          <span style={{ display:'block' }}>FORJA</span>
          <span style={{ display:'block', color:'var(--rojo)', fontStyle:'italic' }}>AL</span>
          <span style={{ display:'block', color:'var(--ambar)' }}>GUERRERO</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:40, paddingTop:40, borderTop:'1px solid var(--line)' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
              <Image src="/logo-guerreros-aztecas.png" alt="" width={56} height={56} style={{ borderRadius:'50%' }} />
              <div>
                <div className="t-display" style={{ fontSize:22 }}>Guerreros Aztecas</div>
                <div className="t-mono-sm" style={{ marginTop:4 }}>Fight Club · Est. MMXIV</div>
              </div>
            </div>
            <p style={{ color:'var(--ink-dim)', fontSize:14, lineHeight:1.55, maxWidth:320 }}>Calle Reforma 24, Barrio de San Miguel, Coapan, Puebla 72980. WhatsApp +52 222 4422 110.</p>
          </div>
          {[
            { title:'Disciplinas', links:['BJJ','Muay Thai','Boxeo','MMA','Defensa Personal','Pequeños Guerreros'] },
            { title:'Escuela', links:['Filosofía','Maestros','Cinturones','Galería','FAQ'] },
            { title:'Conecta', links:['Instagram','TikTok','YouTube','WhatsApp','Email'] },
          ].map(col => (
            <div key={col.title}>
              <div className="t-mono-sm" style={{ color:'var(--ambar)', marginBottom:18 }}>{col.title}</div>
              <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                {col.links.map(l => (
                  <li key={l} style={{ marginBottom:10 }}>
                    <a href="#" style={{ color:'var(--ink-dim)', textDecoration:'none', fontSize:14 }}
                      onMouseEnter={e => (e.currentTarget.style.color='var(--ink)')}
                      onMouseLeave={e => (e.currentTarget.style.color='var(--ink-dim)')}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop:60, paddingTop:24, borderTop:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div className="t-mono-sm">© MMXXVI Guerreros Aztecas Fight Club · Todos los derechos reservados</div>
          <div className="t-cinzel" style={{ fontSize:11, color:'var(--ambar)', display:'flex', gap:14, alignItems:'center' }}>
            <span>Disciplina</span><StarSep size={6} /><span>Respeto</span><StarSep size={6} /><span>Entrega</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── MAIN ───

export default function GuerrerosAztecas() {
  return (
    <>
      <style>{css}</style>
      <Nav />
      <Hero />
      <Ticker />
      <Filosofia />
      <Disciplinas />
      <Horarios />
      <Cinturones />
      <Maestros />
      <Galeria />
      <Testimonios />
      <Precios />
      <Inscripcion />
      <Ubicacion />
      <FAQSection />
      <Footer />
    </>
  )
}
