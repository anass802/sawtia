import { useState, useEffect, useCallback, useRef } from 'react'
import { whatsappAPI } from '../api/whatsappApi'
import { QRCodeSVG } from 'qrcode.react'


// ─── Mini Icon ─────────────────────────────────────────────────────
const Ico = ({ n, s = 18, c = 'currentColor' }) => {
  const d = {
    check: <polyline points="20 6 9 11 4 16" strokeWidth="2.5" />,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    refresh: <><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></>,
    wifi: <><path d="M5 12.55a11 11 0 0114.08 0" /><path d="M1.42 9a16 16 0 0121.16 0" /><path d="M8.53 16.11a6 6 0 016.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></>,
    phone: <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.43 7.14a16 16 0 006.29 6.29l1.5-1.5a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.16z" /></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    msg: <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></>,
    power: <><path d="M18.36 6.64a9 9 0 11-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></>,
    qr: <><rect x="3" y="3" width="5" height="5" rx="1" /><rect x="3" y="16" width="5" height="5" rx="1" /><rect x="16" y="3" width="5" height="5" rx="1" /><line x1="16" y1="16" x2="16" y2="21" /><line x1="21" y1="16" x2="21" y2="16" /><line x1="21" y1="21" x2="21" y2="21" /><line x1="16" y1="21" x2="21" y2="21" /><rect x="5" y="5" width="1" height="1" fill={c} /><rect x="5" y="18" width="1" height="1" fill={c} /><rect x="18" y="5" width="1" height="1" fill={c} /></>,
    users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  }
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {d[n] || null}
    </svg>
  )
}
const STEPS = [
  {
    state: 'idle',
    n: 1,
    title: "Connexion initiale",
    desc: "Cliquez sur connecter pour démarrer la session WhatsApp"
  },
  {
    state: 'connecting',
    n: 2,
    title: "Création de session",
    desc: "Connexion au serveur WhatsApp en cours..."
  },
  {
    state: 'qr',
    n: 3,
    title: "Scanner le QR code",
    desc: "Ouvrez WhatsApp et scannez le code affiché"
  },
  {
    state: 'connected',
    n: 4,
    title: "Connecté",
    desc: "Votre compte WhatsApp est synchronisé avec succès"
  }
]



// ─── Main Component ─────────────────────────────────────────────────
export default function WhatsAppSync() {
  const user = JSON.parse(localStorage.getItem('user'))
  const userId = user?.id

  const [status, setStatus] = useState('idle')
  const [qr, setQr] = useState(null)
  const [phone, setPhone] = useState(null)
  const pollRef = useRef(null)
  const [countdown, setCountdown] = useState(60)
  const currentStep = STEPS.find(s => s.state === status)

  const stopPolling = useCallback(() => {
    clearInterval(pollRef.current)
    pollRef.current = null
  }, [])

  useEffect(() => () => stopPolling(), [stopPolling])


  const pollStatus = useCallback(async (uid) => {
    try {
      const res = await whatsappAPI.status(uid)
      const { state, qr: newQr, phone } = res
      console.log("STATUS RESPONSE:", res)
      if (state === 'qr_ready' && newQr) {
        setQr(newQr)
        setStatus('qr')
      } else if (state === 'connected') {
        stopPolling()
        setPhone(phone.replace('@s.whatsapp.net', ''))
        setStatus('connected')
      }
    } catch (e) {
      console.error('Status poll failed', e)
    }
  }, [stopPolling])
  useEffect(() => {
  if (!userId) return

  const checkExistingSession = async () => {
    try {
      const res = await whatsappAPI.status(userId)

      console.log('INITIAL STATUS:', res)

      if (res.state === 'connected') {
        setStatus('connected')
        setPhone(
          res.phone?.replace('@s.whatsapp.net', '')
        )
      }

      else if (res.state === 'qr_ready' && res.qr) {
        setStatus('qr')
        setQr(res.qr)

        pollRef.current = setInterval(() => {
          pollStatus(userId)
        }, 2000)
      }

    } catch (err) {
      console.error(err)
    }
  }

  checkExistingSession()

  return () => stopPolling()
}, [userId, pollStatus, stopPolling])
  const handleConnect = async () => {
    setStatus('connecting')
    try {
      const res = await whatsappAPI.connect()
      if (!res.success) { setStatus('idle'); return }
      pollRef.current = setInterval(() => pollStatus(userId), 2000)
      pollStatus(userId)
    } catch (e) {
      setStatus('idle')
    }
  }

  const handleDisconnect = async () => {
    stopPolling()
    await whatsappAPI.disconnect()   
    setStatus('idle')
    setQr(null)
    setPhone(null)
  }

 






  const P = '#25D366' // WhatsApp green
  const PL = '#e9fdf0'
  const PD = '#128C7E'

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, background: P, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ico n="msg" s={22} c="#fff" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>Synchronisation WhatsApp</h2>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>Liez votre numéro en scannant un QR code</p>
          </div>
        </div>

        {/* Status badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
          borderRadius: 20, fontSize: 13, fontWeight: 600,
          background: status === 'connected' ? '#dcfce7' : status === 'qr' ? '#fef9c3' : '#f3f4f6',
          color: status === 'connected' ? '#15803d' : status === 'qr' ? '#854d0e' : '#6b7280',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: status === 'connected' ? P : status === 'qr' ? '#eab308' : '#d1d5db',
            boxShadow: status === 'connected' ? `0 0 0 3px ${P}40` : 'none',
            animation: status === 'qr' ? 'pulse 1.5s infinite' : 'none',
          }} />
          {status === 'connected' ? 'Connecté' : status === 'qr' ? 'En attente de scan...' : status === 'connecting' ? 'Connexion...' : 'Déconnecté'}
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.4 } }`}</style>

      {/* Connected state */}
      {status === 'connected' ? (
        <div>
          {/* Phone info */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 52, height: 52, background: PL, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ico n="phone" s={24} c={P} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Numéro lié</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: P, letterSpacing: '-0.5px' }}>{phone}</div>
                  {/* <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Connecté depuis {stats.uptime}</div> */}
                </div>
              </div>
              <button onClick={handleDisconnect} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                background: '#fff', border: '1.5px solid #fecaca', borderRadius: 9,
                color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
                <Ico n="power" s={15} c="#ef4444" /> Déconnecter
              </button>
            </div>
          </div>

          {/* Stats */}
          {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { icon: 'msg', label: 'Messages traités', val: stats.messages, color: P },
              { icon: 'users', label: 'Contacts actifs', val: stats.contacts, color: '#3b82f6' },
              { icon: 'clock', label: 'Uptime session', val: stats.uptime, color: '#a855f7' },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>{s.label}</span>
                  <div style={{ background: s.color + '18', borderRadius: 7, padding: 6 }}><Ico n={s.icon} s={14} c={s.color} /></div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#111827' }}>{s.val}</div>
              </div>
            ))}
          </div> */}

          {/* Recent messages */}
          <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Derniers messages</div>
            {[
              { from: 'Ahmed M.', msg: 'Je voudrais avoir des informations sur vos prix', time: 'il y a 2 min', replied: true },
              { from: '+212 6 12 34 56 78', msg: 'Bonjour, est-ce que vous livrez à Casablanca ?', time: 'il y a 8 min', replied: true },
              { from: 'Sara L.', msg: 'Merci pour votre aide !', time: 'il y a 23 min', replied: false },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ width: 36, height: 36, background: PL, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: PD, flexShrink: 0 }}>
                  {m.from[0]}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{m.from}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.msg}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{m.time}</div>
                  {m.replied && (
                    <span style={{ fontSize: 10, color: P, background: PL, padding: '2px 8px', borderRadius: 10, fontWeight: 600, marginTop: 2, display: 'inline-block' }}>
                      ✓ Répondu
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Disconnected / Scanning */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* QR Panel */}
          <div style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 14, padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {qr ? (
              <>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                  Code valide pendant <strong style={{ color: countdown < 15 ? '#ef4444' : '#111827' }}>{countdown}s</strong>
                </div>
                {/* QR Code */}
                <div style={{ padding: 12, border: `3px solid ${countdown < 15 ? '#fca5a5' : P}`, borderRadius: 12, transition: 'border-color 0.3s', marginBottom: 16 }}>
                  <QRCodeSVG value={qr} size={200} />
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginBottom: 16 }}>
                  Pointez l'appareil photo de votre téléphone vers ce code
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { setQr(null); pollStatus(userId) }} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                    border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff',
                    fontSize: 12, cursor: 'pointer', color: '#374151',
                  }}>
                    <Ico n="refresh" s={13} c="#374151" /> Actualiser
                  </button>
                  {/* DEV: simulate success */}
                  
                </div>
              </>
            ) : (
              <>
                <div style={{ width: 80, height: 80, background: PL, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Ico n="qr" s={40} c={P} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8, textAlign: 'center' }}>
                  Lier WhatsApp
                </div>
                <div style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', marginBottom: 24, lineHeight: 1.6 }}>
                  Scannez le QR code avec votre téléphone pour connecter votre numéro WhatsApp à Sawtia Agent.
                </div>
                <button onClick={handleConnect} style={{
                  background: P, color: '#fff', border: 'none', borderRadius: 10,
                  padding: '13px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <Ico n="qr" s={16} c="#fff" /> Afficher le QR Code
                </button>
              </>
            )}
          </div>

          {/* Instructions */}
          <div>
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 14, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 18 }}>Comment ça marche ?</div>
              {currentStep && (
                <div>
                  <div>{currentStep.n}. {currentStep.title}</div>
                  <div>{currentStep.desc}</div>
                </div>
              )}
            </div>

            {/* Info boxes */}
            {[
              { icon: 'wifi', color: '#3b82f6', bg: '#eff6ff', title: 'Connexion persistante', desc: 'Votre session reste active même si le téléphone se verrouille.' },
              { icon: 'alert', color: '#f59e0b', bg: '#fffbeb', title: 'Un seul appareil lié', desc: 'WhatsApp autorise un seul appareil lié à la fois via QR code.' },
            ].map((b, i) => (
              <div key={i} style={{ background: b.bg, border: `1px solid ${b.color}30`, borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 12, marginBottom: 12 }}>
                <Ico n={b.icon} s={16} c={b.color} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{b.title}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
