import { useState } from "react";

const tabs = [
  { id: "meta",     label: "Métadonnées",  icon: "🏷️" },
  { id: "text",     label: "Contenu",      icon: "📄" },
  { id: "contact",  label: "Contact",      icon: "📞" },
  { id: "links",    label: "Liens",        icon: "🔗" },
  { id: "images",   label: "Images",       icon: "🖼️" },
  { id: "products", label: "Produits",     icon: "🛒" },
];

function Badge({ children, color = "blue" }) {
  const colors = {
    blue:  "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    gray:  "bg-gray-100 text-gray-500 border-gray-200",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colors[color]}`}>
      {children}
    </span>
  );
}

function Section({ title, count, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {count !== undefined && <Badge color={count > 0 ? "blue" : "gray"}>{count}</Badge>}
      </div>
      {children}
    </div>
  );
}

export default function WebScanner() {
  const [url, setUrl]       = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData]     = useState(null);
  const [error, setError]   = useState(null);
  const [activeTab, setActiveTab] = useState("meta");

  const handleScan = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur lors du scan");
      setData(json);
      setActiveTab("meta");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMeta = () => (
    <div className="space-y-3">
      {Object.entries(data.meta).map(([key, val]) => (
        <div key={key} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{key}</div>
          <div className="text-sm text-gray-800 break-words">{val || <span className="text-gray-400 italic">—</span>}</div>
        </div>
      ))}
      {Object.keys(data.meta).length === 0 && <p className="text-sm text-gray-400 italic">Aucune métadonnée trouvée.</p>}
    </div>
  );

  const renderText = () => (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
        {data.text || <span className="italic text-gray-400">Aucun contenu texte extrait.</span>}
      </p>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-5">
      <Section title="Emails" count={data.contact.emails.length}>
        {data.contact.emails.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.contact.emails.map((e, i) => (
              <a key={i} href={`mailto:${e}`} className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                ✉️ {e}
              </a>
            ))}
          </div>
        ) : <p className="text-sm text-gray-400 italic">Aucun email trouvé.</p>}
      </Section>

      <Section title="Téléphones" count={data.contact.phones.length}>
        {data.contact.phones.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.contact.phones.map((p, i) => (
              <span key={i} className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-1.5 rounded-lg">
                📞 {p}
              </span>
            ))}
          </div>
        ) : <p className="text-sm text-gray-400 italic">Aucun téléphone trouvé.</p>}
      </Section>

      <Section title="Adresses" count={data.contact.addresses.length}>
        {data.contact.addresses.length > 0 ? (
          <div className="space-y-2">
            {data.contact.addresses.map((a, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm text-gray-700">
                📍 {a}
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-gray-400 italic">Aucune adresse trouvée.</p>}
      </Section>
    </div>
  );

  const renderLinks = () => (
    <div className="space-y-2">
      {data.links.length > 0 ? data.links.map((l, i) => (
        <a
          key={i}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 rounded-xl px-4 py-3 transition-all group"
        >
          <span className="text-blue-400 group-hover:text-blue-600 text-lg flex-shrink-0">🔗</span>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-800 truncate">{l.text}</div>
            <div className="text-xs text-gray-400 truncate">{l.href}</div>
          </div>
        </a>
      )) : <p className="text-sm text-gray-400 italic">Aucun lien trouvé.</p>}
    </div>
  );

  const renderImages = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {data.images.length > 0 ? data.images.map((img, i) => (
        <div key={i} className="group relative bg-gray-100 rounded-xl overflow-hidden border border-gray-200 aspect-video">
          <img
            src={img.src}
            alt={img.alt || "image"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          {img.alt && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
              {img.alt}
            </div>
          )}
        </div>
      )) : <p className="text-sm text-gray-400 italic col-span-3">Aucune image trouvée.</p>}
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-2">
      {data.products.length > 0 ? data.products.map((p, i) => (
        <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 flex items-center gap-3">
          <span className="text-lg">🛒</span>
          <span>{p}</span>
        </div>
      )) : <p className="text-sm text-gray-400 italic">Aucun produit trouvé.</p>}
    </div>
  );

  const tabCount = (id) => {
    if (!data) return null;
    const map = {
      meta:     Object.keys(data.meta).length,
      text:     data.text ? 1 : 0,
      contact:  data.contact.emails.length + data.contact.phones.length + data.contact.addresses.length,
      links:    data.links.length,
      images:   data.images.length,
      products: data.products.length,
    };
    return map[id];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl">
            🌐
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Scanner Web</h1>
            <p className="text-xs text-gray-500">Extraire les informations d'un site web</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* URL Input */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <label className="text-sm font-medium text-gray-700 block mb-3">
            URL du site web
          </label>
          <div className="flex gap-3">
            <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 gap-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <span className="text-gray-400 text-lg">🌐</span>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                placeholder="https://example.com"
                className="flex-1 bg-transparent py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              {url && (
                <button onClick={() => setUrl("")} className="text-gray-300 hover:text-gray-500 text-lg">×</button>
              )}
            </div>
            <button
              onClick={handleScan}
              disabled={loading || !url.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm shadow-sm flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Scan...
                </>
              ) : (
                <>🔍 Scanner</>
              )}
            </button>
          </div>

          {/* Quick examples */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-gray-400">Essayer :</span>
            {["https://apple.com", "https://github.com", "https://wikipedia.org"].map((example) => (
              <button
                key={example}
                onClick={() => setUrl(example)}
                className="text-xs text-blue-500 hover:text-blue-700 hover:underline"
              >
                {example.replace("https://", "")}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
            <span>❌</span> {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
            <div className="h-3 bg-gray-100 rounded w-4/6" />
          </div>
        )}

        {/* Results */}
        {data && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Site summary bar */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4 bg-gradient-to-r from-blue-50 to-white">
              <img
                src={`https://www.google.com/s2/favicons?domain=${url}&sz=32`}
                alt="favicon"
                className="w-6 h-6 rounded"
                onError={(e) => e.target.style.display = "none"}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {data.meta.title || url}
                </div>
                <div className="text-xs text-gray-400 truncate">{data.url}</div>
              </div>
              <Badge color="green">Scanné ✓</Badge>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-100 px-2">
              {tabs.map((tab) => {
                const count = tabCount(tab.id);
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                    {count !== null && count > 0 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                        activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === "meta"     && renderMeta()}
              {activeTab === "text"     && renderText()}
              {activeTab === "contact"  && renderContact()}
              {activeTab === "links"    && renderLinks()}
              {activeTab === "images"   && renderImages()}
              {activeTab === "products" && renderProducts()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}