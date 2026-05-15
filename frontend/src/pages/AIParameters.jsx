import { useState, useEffect } from 'react'
import { aiParamsAPI } from '../api/client'

const Ico = ({ n, s = 18, c = 'currentColor' }) => {
  const d = {
    bot: <><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></>,
    sliders: <><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    brain: <><path d="M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 014.5 7v0A2.5 2.5 0 012 9.5v0A2.5 2.5 0 014.5 12v0A2.5 2.5 0 017 14.5v0A2.5 2.5 0 019.5 17v0"/><path d="M14.5 2A2.5 2.5 0 0117 4.5v0A2.5 2.5 0 0119.5 7v0A2.5 2.5 0 0122 9.5v0A2.5 2.5 0 0119.5 12v0A2.5 2.5 0 0117 14.5v0A2.5 2.5 0 0114.5 17v0"/></>,
    msg: <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    save: <><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
    check: <><polyline points="20 6 9 11 4 16"/></>,
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    volume: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    hash: <><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></>,
  }
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {d[n] || null}
    </svg>
  )
}

const Slider = ({ label, value, onChange, min = 0, max = 1, step = 0.01, format, hint, color = '#337FFA' }) => {
  const pct = ((value - min) / (max - min)) * 100
  const display = format ? format(value) : value
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</label>
        <span style={{
          fontSize: 15, fontWeight: 800, color: color,
          background: color + '18', padding: '2px 10px', borderRadius: 6,
        }}>{display}</span>
      </div>
      <div style={{ position: 'relative', marginBottom: 4 }}>
        <div style={{
          position: 'absolute', top: '50%', left: 0,
          width: `${pct}%`, height: 4, background: color,
          borderRadius: 4, transform: 'translateY(-50%)', pointerEvents: 'none',
          transition: 'width 0.1s',
        }}/>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: color, cursor: 'pointer' }}/>
      </div>
      {hint && <div style={{ fontSize: 11, color: '#9ca3af' }}>{hint}</div>}
    </div>
  )
}

const Toggle = ({ label, value, onChange, desc }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f3f4f6' }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</div>
      {desc && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{desc}</div>}
    </div>
    <button onClick={() => onChange(!value)} style={{
      width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
      background: value ? '#337FFA' : '#d1d5db', transition: 'background 0.2s', position: 'relative',
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3, left: value ? 23 : 3,
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }}/>
    </button>
  </div>
)

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 9, padding: '10px 12px',
      fontSize: 13, background: '#fff', outline: 'none', cursor: 'pointer', color: '#111827',
    }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
)

const TABS = [
  { id: 'model', label: 'Modèle IA', icon: 'brain' },
  { id: 'behavior', label: 'Comportement', icon: 'sliders' },
  { id: 'language', label: 'Langue & Voix', icon: 'globe' },
  { id: 'limits', label: 'Limites & Sécurité', icon: 'shield' },
]

export default function AIParameters() {
  const [tab, setTab] = useState('model')
  const [saved, setSaved] = useState(false)

  // Model params
  const [model, setModel] = useState('claude-3-5-sonnet')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1024)
  const [topP, setTopP] = useState(0.9)
  const [presencePenalty, setPresencePenalty] = useState(0.0)
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0)


  const [persona, setPersona] = useState('Assistant Commercial')
  const [greetingMsg, setGreetingMsg] = useState('Bonjour ! Je suis l\'assistant virtuel de {company_name}. Comment puis-je vous aider aujourd\'hui ?')
  const [fallbackMsg, setFallbackMsg] = useState('Je suis désolé, je n\'ai pas compris votre demande. Pourriez-vous reformuler ?')
  const [streaming, setStreaming] = useState(true)
  const [memory, setMemory] = useState(true)
  const [rag, setRag] = useState(true)

  // Language
  const [language, setLanguage] = useState('français')
  const [voice, setVoice] = useState('alloy')
  const [speechRate, setSpeechRate] = useState(1.0)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [sttEnabled, setSttEnabled] = useState(true)

  // Behavior
  const [systemPrompt, setSystemPrompt] = useState(
  `Tu es un {persona} intelligent pour {company_name}. Tu réponds toujours en {language}, avec politesse et professionnalisme. Tu qualifies les leads, prends les rendez-vous et réponds aux questions fréquentes.`
)
const finalPrompt = systemPrompt
  .replace('{persona}', persona || 'assistant Commercial')
  .replace('{language}', language || 'français')
  const handleSave = async () => {
    // await aiParamsAPI.update(agentId, { temperature, maxTokens, ... })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }


  // Limits
  const [maxConvLength, setMaxConvLength] = useState(20)
  const [responseDelay, setResponseDelay] = useState(0)
  const [contentFilter, setContentFilter] = useState(true)
  const [humanHandoff, setHumanHandoff] = useState(true)
  const [handoffThreshold, setHandoffThreshold] = useState(3)

  const P = '#337FFA'
  const PL = '#EBF2FF'



  const tempHints = ['Déterministe', 'Équilibré', 'Créatif']
  const tempHint = temperature < 0.35 ? tempHints[0] : temperature < 0.7 ? tempHints[1] : tempHints[2]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>Paramètres IA</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Configurez le comportement et les capacités de votre agent</p>
        </div>
        <button onClick={handleSave} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px',
          background: saved ? '#22c55e' : P, color: '#fff',
          border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          transition: 'background 0.3s',
        }}>
          <Ico n={saved ? 'check' : 'save'} s={15} c="#fff"/>
          {saved ? 'Enregistré !' : 'Enregistrer'}
        </button>
      </div>

      {/* Agent selector */}
      <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Ico n="bot" s={18} c={P}/>
        <span style={{ fontSize: 13, color: '#6b7280' }}>Agent actif :</span>
        <select style={{ border: '1px solid #e5e7eb', borderRadius: 7, padding: '6px 10px', fontSize: 13, background: '#fff', outline: 'none', color: '#111827' }}>
          <option>C2m — Advanced Agent</option>
          <option>Agent WhatsApp Support</option>
          <option>Agent Téléphonie</option>
        </select>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%' }}/>
          <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>Actif</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', borderRadius: 10, padding: 4, marginBottom: 24, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px',
            borderRadius: 7, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
            background: tab === t.id ? '#fff' : 'transparent',
            color: tab === t.id ? P : '#6b7280',
            boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
          }}>
            <Ico n={t.icon} s={14} c={tab === t.id ? P : '#6b7280'}/>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' }}>
        {/* Main panel */}
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 14, padding: 28 }}>

          {/* ── MODEL TAB ── */}
          {tab === 'model' && (
            <>
              <Select label="Modèle de langage" value={model} onChange={setModel} options={[
                { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet — Recommandé' },
                { value: 'claude-3-haiku', label: 'Claude 3 Haiku — Rapide & économique' },
                { value: 'claude-3-opus', label: 'Claude 3 Opus — Très puissant' },
                { value: 'gpt-4o', label: 'GPT-4o (OpenAI)' },
                { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
                { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Google)' },
              ]}/>

              <div style={{ height: 1, background: '#f3f4f6', margin: '20px 0' }}/>

              <Slider label="Température" value={temperature} onChange={setTemperature}
                min={0} max={2} step={0.01}
                format={v => v.toFixed(2)}
                hint={`${tempHint} — Contrôle la créativité des réponses (0 = précis, 2 = très créatif)`}
                color={temperature > 1.2 ? '#ef4444' : temperature > 0.7 ? '#f59e0b' : P}
              />
              <Slider label="Max Tokens" value={maxTokens} onChange={setMaxTokens}
                min={64} max={4096} step={64}
                format={v => v.toLocaleString()}
                hint="Longueur maximale de la réponse générée"
              />
              <Slider label="Top P" value={topP} onChange={setTopP}
                min={0} max={1} step={0.01}
                format={v => v.toFixed(2)}
                hint="Contrôle la diversité via échantillonnage nucléaire"
                color="#a855f7"
              />
              <Slider label="Presence Penalty" value={presencePenalty} onChange={setPresencePenalty}
                min={-2} max={2} step={0.1}
                format={v => v.toFixed(1)}
                hint="Pénalise les sujets déjà abordés (encourage la variété)"
                color="#22c55e"
              />
              <Slider label="Frequency Penalty" value={frequencyPenalty} onChange={setFrequencyPenalty}
                min={-2} max={2} step={0.1}
                format={v => v.toFixed(1)}
                hint="Réduit la répétition des mots fréquents"
                color="#f59e0b"
              />
            </>
          )}

          {/* ── BEHAVIOR TAB ── */}
          {tab === 'behavior' && (
            <>
              <Select label="Persona de l'agent" value={persona} onChange={setPersona} options={[
                { value: 'assistant', label: '🤝 Assistant commercial' },
                { value: 'support', label: '🛠 Support technique' },
                { value: 'sales', label: '💼 Vendeur expert' },
                { value: 'receptionist', label: '📞 Réceptionniste' },
                { value: 'coach', label: '🎯 Coach / Conseiller' },
                { value: 'custom', label: '✏️ Personnalisé' },
              ]}/>

              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  System Prompt
                  <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 8, fontWeight: 400 }}>Variables : {'{company_name}'}, {'{language}'}, {'{date}'}</span>
                </label>
                <textarea value={finalPrompt} onChange={e => setSystemPrompt(e.target.value)} rows={6}
                  style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 9, padding: '10px 12px', fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace', lineHeight: 1.6 }}/>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Message d'accueil</label>
                <textarea value={greetingMsg} onChange={e => setGreetingMsg(e.target.value)} rows={2}
                  style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 9, padding: '10px 12px', fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}/>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Message de repli (fallback)</label>
                <textarea value={fallbackMsg} onChange={e => setFallbackMsg(e.target.value)} rows={2}
                  style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 9, padding: '10px 12px', fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}/>
              </div>
              <div style={{ height: 1, background: '#f3f4f6', margin: '8px 0 16px' }}/>
              <Toggle label="Réponses en streaming" value={streaming} onChange={setStreaming} desc="Affiche la réponse mot par mot pour une meilleure UX"/>
              <Toggle label="Mémoire conversationnelle" value={memory} onChange={setMemory} desc="L'agent se souvient du contexte de la conversation"/>
              <Toggle label="RAG — Base de connaissances" value={rag} onChange={setRag} desc="Utilise vos documents et sites web comme contexte"/>
            </>
          )}

          {/* ── LANGUAGE TAB ── */}
          {tab === 'language' && (
            <>
              <Select label="Langue principale" value={language} onChange={setLanguage} options={[
                { value: 'fr', label: '🇫🇷 Français' },
                { value: 'ar-ma', label: '🇲🇦 Darija Marocaine' },
                { value: 'ar', label: '🇸🇦 Arabe standard' },
                { value: 'en', label: '🇬🇧 Anglais' },
                { value: 'es', label: '🇪🇸 Espagnol' },
                { value: 'multi', label: '🌍 Multilingue auto-détecté' },
              ]}/>
              <Select label="Voix TTS (Text-to-Speech)" value={voice} onChange={setVoice} options={[
                { value: 'alloy', label: 'Alloy — Neutre, professionnel' },
                { value: 'echo', label: 'Echo — Voix masculine douce' },
                { value: 'fable', label: 'Fable — Voix chaleureuse' },
                { value: 'nova', label: 'Nova — Voix féminine naturelle' },
                { value: 'shimmer', label: 'Shimmer — Voix féminine claire' },
                { value: 'onyx', label: 'Onyx — Voix masculine grave' },
              ]}/>
              <Slider label="Vitesse de parole" value={speechRate} onChange={setSpeechRate}
                min={0.5} max={2.0} step={0.1}
                format={v => `×${v.toFixed(1)}`}
                hint="Vitesse de lecture de la synthèse vocale (1.0 = normal)"
                color="#a855f7"
              />
              <div style={{ height: 1, background: '#f3f4f6', margin: '8px 0 16px' }}/>
              <Toggle label="Synthèse vocale (TTS)" value={ttsEnabled} onChange={setTtsEnabled} desc="L'agent parle à vos clients via audio"/>
              <Toggle label="Reconnaissance vocale (STT)" value={sttEnabled} onChange={setSttEnabled} desc="L'agent comprend la parole des clients"/>
            </>
          )}

          {/* ── LIMITS TAB ── */}
          {tab === 'limits' && (
            <>
              <Slider label="Longueur max. de conversation" value={maxConvLength} onChange={setMaxConvLength}
                min={5} max={100} step={1}
                format={v => `${v} tours`}
                hint="Nombre maximum d'échanges avant réinitialisation automatique"
                color="#f59e0b"
              />
              <Slider label="Délai de réponse (ms)" value={responseDelay} onChange={setResponseDelay}
                min={0} max={3000} step={100}
                format={v => v === 0 ? 'Immédiat' : `${v}ms`}
                hint="Délai artificiel pour simuler une réponse humaine"
              />
              <Slider label="Seuil de transfert humain" value={handoffThreshold} onChange={setHandoffThreshold}
                min={1} max={10} step={1}
                format={v => `${v} tentatives`}
                hint="Nombre d'incompréhensions avant transfert à un agent humain"
                color="#ef4444"
              />
              <div style={{ height: 1, background: '#f3f4f6', margin: '8px 0 16px' }}/>
              <Toggle label="Filtre de contenu" value={contentFilter} onChange={setContentFilter} desc="Bloque les messages inappropriés ou hors sujet"/>
              <Toggle label="Transfert humain auto" value={humanHandoff} onChange={setHumanHandoff} desc="Transfère à un agent humain si l'IA ne peut pas résoudre"/>
            </>
          )}
        </div>

        {/* Preview panel */}
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 14, padding: 20, position: 'sticky', top: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Ico n="msg" s={14} c={P}/> Aperçu du Chat
          </div>

          {/* Chat preview */}
          <div style={{ background: '#f8faff', borderRadius: 10, padding: 14, marginBottom: 16 }}>
            {/* Agent message */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, background: P, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ico n="bot" s={14} c="#fff"/>
              </div>
              <div style={{ background: '#fff', borderRadius: '0 10px 10px 10px', padding: '8px 12px', fontSize: 12, color: '#374151', maxWidth: 220, border: '1px solid #f0f0f0', lineHeight: 1.5 }}>
                {greetingMsg.replace('{company_name}', 'Sawtia').replace('{language}', 'français')}
              </div>
            </div>
            {/* User message */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: 12 }}>
              <div style={{ background: P, borderRadius: '10px 0 10px 10px', padding: '8px 12px', fontSize: 12, color: '#fff', maxWidth: 180, lineHeight: 1.5 }}>
                Bonjour ! Quels sont vos tarifs ?
              </div>
            </div>
            {/* Agent reply */}
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 28, height: 28, background: P, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ico n="bot" s={14} c="#fff"/>
              </div>
              <div style={{ background: '#fff', borderRadius: '0 10px 10px 10px', padding: '8px 12px', fontSize: 12, color: '#374151', maxWidth: 220, border: '1px solid #f0f0f0', lineHeight: 1.5 }}>
                Nos plans commencent à partir de 279 DH/mois. Puis-je vous proposer un appel de découverte gratuit ? 😊
                {streaming && <span style={{ display: 'inline-block', width: 2, height: 12, background: P, marginLeft: 2, animation: 'blink 1s infinite', verticalAlign: 'middle' }}/>}
              </div>
            </div>
          </div>
          <style>{`@keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }`}</style>

          {/* Config summary */}
          <div style={{ fontSize: 12, color: '#374151' }}>
            <div style={{ fontWeight: 700, marginBottom: 10, color: '#111827' }}>Configuration actuelle</div>
            {[
              ['Modèle', model],
              ['Température', temperature.toFixed(2)],
              ['Max tokens', maxTokens.toLocaleString()],
              ['Langue', language],
              ['Streaming', streaming ? '✓ Actif' : '✗ Inactif'],
              ['Mémoire', memory ? '✓ Actif' : '✗ Inactif'],
              ['RAG', rag ? '✓ Actif' : '✗ Inactif'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ color: '#6b7280' }}>{k}</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Estimated cost */}
          <div style={{ marginTop: 14, background: PL, borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Coût estimé / 1000 messages</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: P }}>
              ~{(maxTokens * 0.000003 * 1000).toFixed(2)} USD
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>Basé sur {maxTokens} tokens max.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
