// Header.jsx
export default function Header({ pageTitle }) {
  return (
    <div style={{ height: 54, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
      <div style={{ flex: 1 }}>{pageTitle}</div>
    </div>
  )
}