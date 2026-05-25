import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
    // ─── CONSTANTS ─────────────────────────────────────────────────────
const P = '#337FFA'
const PL = '#EBF2FF'
const PD = '#1a5fd4'
const [dark, setDark] = useState(false)
const bg = dark ? '#0f172a' : '#f8faff'
const sidebarBg = dark ? '#1e293b' : '#fff'
const textPrimary = dark ? '#f1f5f9' : '#111827'
const textMuted = dark ? '#94a3b8' : '#6b7280'
const border = dark ? '#334155' : '#f0f0f0'
const [expanded, setExpanded] = useState({})
const [activePage, setActivePage] = useState('dashboard')
const [userMenu, setUserMenu] = useState(false)
const navSectionIcons = { 'Agents IA': 'bot', 'Base de Connaissances': 'database', 'Connecteurs CRM': 'plug', 'E-commerce': 'shopping-bag', 'API TTS (Dev)': 'code', 'Facturation': 'receipt', 'Support & Aide': 'help-circle' }
const navigate=useNavigate()

// ─── Icon component ─────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = 'currentColor' }) => {
  const icons = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    share2: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>,
    history: <><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.57"/></>,
    bot: <><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></>,
    megaphone: <><path d="M3 11l18-5v12L3 14v-3z"/></>,
    database: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>,
    plug: <><path d="M12 22v-5"/><path d="M9 7V2"/><path d="M15 7V2"/><path d="M6 13H2v-2a4 4 0 014-4h12a4 4 0 014 4v2h-4"/><rect x="6" y="13" width="12" height="5" rx="2"/></>,
    'shopping-bag': <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></>,
    code: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
    receipt: <><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></>,
    'help-circle': <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    'chevron-down': <polyline points="6 9 12 15 18 9"/>,
    'chevron-right': <polyline points="9 18 15 12 9 6"/>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
    'refresh-cw': <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    'message-square': <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    check: <polyline points="20 6 9 11 4 16"/>,
    'check-circle': <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
    sun: <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></>,
    moon: <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>,
    'log-out': <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    'file-text': <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    'credit-card': <><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
    download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.43 7.14a16 16 0 006.29 6.29l1.5-1.5a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.16z"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    'bar-chart': <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    'alert-triangle': <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    video: <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></>,
    'message-circle': <><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></>,
    facebook: <><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></>,
    sliders: <><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>,
    whatsapp: <><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></>,
    scan: <><path d="M3 7V5a2 2 0 012-2h2"/><path d="M17 3h2a2 2 0 012 2v2"/><path d="M21 17v2a2 2 0 01-2 2h-2"/><path d="M7 21H5a2 2 0 01-2-2v-2"/></>,
    'trending-up': <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    terminal: <><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name] || <circle cx="12" cy="12" r="10"/>}
    </svg>
  )
}

// ─── NAV CONFIG ─────────────────────────────────────────────────────
const navItems = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: 'grid' ,link:'/comingsoon' },
  { id: 'whatsapp', label: 'WhatsApp Sync', icon: 'whatsapp', badge: 'NEW', badgeColor: '#25D366' ,link:'/whatss-appsync' },
  { id: 'connexions', label: 'Connexions', icon: 'share2' ,link:'/comingsoon' },
  { id: 'conversations', label: 'Conversations', icon: 'history' ,link:'/comingsoon' },
  {
    label: 'Agents IA', icon: 'bot', children: [
      { id: 'agent-basic', label: 'Agent Basique', badge: 'Nv 1', badgeColor: '#3b82f6' ,link:'/comingsoon' },
      { id: 'agent-advanced', label: 'Agent Avancé', badge: 'Nv 2', badgeColor: '#a855f7' ,link:'/comingsoon' },
      { id: 'agent-expert', label: 'Agent Expert', badge: 'Nv 3', badgeColor: '#f59e0b' ,link:'/comingsoon' },
    ]
  },
  { id: 'ai-params', label: 'Paramètres IA', icon: 'sliders', link:'/ai-parametre' },
  { id: 'campaigns', label: 'Campagnes', icon: 'megaphone', link:'/broadcast' },
  {
    label: 'Base de Connaissances', icon: 'database', children: [
      { id: 'web-scanner', label: 'Scanner Web', link:'/webscanner' },
      { id: 'documents', label: 'Documents (PDF)', link:'/doc-indexed' },
      { id: 'articles', label: 'Articles & Textes', link:'/comingsoon' },
      { id: 'data-sources', label: 'Data Sources', link:'/comingsoon' },
    ]
  },
  {
    label: 'Connecteurs CRM', icon: 'plug', children: [
      { id: 'immotech', label: 'My Immotech', link:'/comingsoon' },
      { id: 'bitrix', label: 'Bitrix24', link:'/comingsoon' },
      { id: 'autre-crm', label: 'Autre CRM', link:'/comingsoon' },
    ]
  },
  {
    label: 'E-commerce', icon: 'shopping-bag', children: [
      { id: 'shopify', label: 'Shopify', link:'/comingsoon' },
      { id: 'woocommerce', label: 'WooCommerce', link:'/comingsoon' },
      { id: 'autre-store', label: 'Autre Store', link:'/comingsoon' },
    ]
  },
  {
    label: 'API TTS (Dev)', icon: 'code', children: [
      { id: 'api-keys', label: 'Clés API', link:'/comingsoon' },
      { id: 'documentation', label: 'Documentation', link:'/comingsoon' },
      { id: 'recharge', label: 'Recharge', link:'/comingsoon' },
    ]
  },
  {
    label: 'Facturation', icon: 'receipt', children: [
      { id: 'mon-plan', label: 'Mon Plan', link:'/comingsoon' },
      { id: 'profil-facturation', label: 'Profil Facturation', link:'/comingsoon' },
      { id: 'solde-paiement', label: 'Solde & Paiement', link:'/comingsoon' },
      { id: 'factures', label: 'Factures', link:'/comingsoon' },
    ]
  },
  {
    label: 'Support & Aide', icon: 'help-circle', children: [
      { id: 'videos', label: 'Vidéos Démos', link:'/comingsoon' },
      { id: 'faq', label: 'FAQ', link:'/comingsoon' },
      { id: 'tickets', label: 'Tickets', link:'/comingsoon' },
    ]
  },
  { id: 'settings', label: 'Paramètres', icon: 'settings', link:'/comingsoon' },
]
  return (
    <div style={{ width: 240, minWidth: 240, height: '100vh', background: sidebarBg, borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Logo */}
        <div style={{ padding: '18px 16px 14px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: P, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="bot" size={18} color="#fff"/>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: textPrimary, letterSpacing: '-0.3px' }}>Sawtia</div>
            <div style={{ fontSize: 10, color: textMuted, letterSpacing: '0.05em', fontWeight: 600 }}>AI AGENT</div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px', scrollbarWidth: 'thin' }}>
          {navItems.map((item, i) => {
            if (item.children) {
              const isExpanded = expanded[item.label] ?? false
              return (
                <div key={i}>
                  <button onClick={() => {setExpanded(p => ({ ...p, [item.label]: !p[item.label] }))}} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                    background: 'transparent', border: 'none', color: textMuted, fontSize: 12,
                    fontWeight: 600, cursor: 'pointer', borderRadius: 8, letterSpacing: '0.02em',
                  }}>
                    <Icon name={navSectionIcons[item.label] || 'folder'} size={13} color={textMuted}/>
                    <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                    <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} size={13} color={textMuted}/>
                  </button>
                  {isExpanded && item.children.map(c => {
                    const isActive = activePage === c.id
                    return (
                      <button key={c.id} onClick={() => {{setActivePage(c.id)} if(c.link){navigate(c.link)}}} style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '7px 12px 7px 30px', background: isActive ? P : 'transparent',
                        color: isActive ? '#fff' : textMuted, border: 'none', borderRadius: 7,
                        fontSize: 13, fontWeight: isActive ? 600 : 400, cursor: 'pointer',
                      }}>
                        <span>{c.label}</span>
                        {c.badge && (
                          <span style={{ background: isActive ? 'rgba(255,255,255,0.25)' : c.badgeColor + '20', color: isActive ? '#fff' : c.badgeColor, fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>
                            {c.badge}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )
            }
            const isActive = activePage === item.id
            return (
              <button key={item.id} onClick={() => {setActivePage(item.id); navigate(item.link)}} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px',
                background: isActive ? P : 'transparent', color: isActive ? '#fff' : textMuted,
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: isActive ? 600 : 400, cursor: 'pointer',
              }}>
                <Icon name={item.icon} size={14} color={isActive ? '#fff' : textMuted}/>
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                {item.badge && (
                  <span style={{ background: isActive ? 'rgba(255,255,255,0.25)' : item.badgeColor + '20', color: isActive ? '#fff' : item.badgeColor, fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* User */}
        <div style={{ borderTop: `1px solid ${border}`, padding: '10px 10px 12px' }}>
          <button onClick={() => setUserMenu(p => !p)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px',
            background: userMenu ? (dark ? '#334155' : '#f8faff') : 'transparent',
            border: 'none', borderRadius: 9, cursor: 'pointer',
          }}>
            <div style={{ width: 34, height: 34, background: PL, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: P, flexShrink: 0 }}>IM</div>
            <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>ibrahim EL MOUSSAOUI</div>
              <div style={{ fontSize: 11, color: textMuted }}>contact@c2m.ma</div>
            </div>
          </button>
          {userMenu && (
            <div style={{ background: dark ? '#334155' : '#f9fafb', borderRadius: 8, padding: 4, marginTop: 4 }}>
              <button onClick={() => setDark(p => !p)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'transparent', border: 'none', color: textMuted, fontSize: 12, cursor: 'pointer', borderRadius: 6 }}>
                <Icon name={dark ? 'sun' : 'moon'} size={13} color={textMuted}/>
                {dark ? 'Mode clair' : 'Mode sombre'}
              </button>
              <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: 12, cursor: 'pointer', borderRadius: 6 }}>
                <Icon name="log-out" size={13} color="#ef4444"/> Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
  )
}

export default Sidebar
