import { useState, useRef } from "react";

export default function BroadcastPage() {
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (f && (f.name.endsWith(".csv") || f.name.endsWith(".txt"))) {
      setFile(f);
      setError(null);
    } else {
      setError("Veuillez télécharger un fichier .csv");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !topic.trim()) {
      setError("Veuillez fournir un fichier CSV et un sujet.");
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("topic", topic);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Une erreur est survenue");
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sentCount = results?.results?.filter((r) => r.sent).length ?? 0;
  const failCount = results?.results?.filter((r) => !r.sent).length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Campagnes WhatsApp</h1>
            <p className="text-xs text-gray-500">Envoi en masse personnalisé par IA</p>
          </div>
        </div>
        <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full font-medium">
          IA activée
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        {/* CSV Format hint */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <div className="text-blue-500 mt-0.5">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div className="text-sm text-blue-700">
            <span className="font-semibold">Format CSV requis : </span>
            numéro, prénom — une ligne par contact, sans en-tête
            <div className="mt-1.5 bg-blue-100 rounded-lg px-3 py-2 font-mono text-xs text-blue-600">
              212612345678,Ahmed<br />
              212698765432,Fatima
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">

          {/* Topic */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Sujet du message
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Promouvoir notre nouvelle offre de prêt sans intérêt disponible ce mois-ci..."
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
            />
          </div>

          {/* File upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Fichier contacts (CSV)
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
              className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragOver
                  ? "border-blue-400 bg-blue-50"
                  : file
                  ? "border-green-400 bg-green-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
              {file ? (
                <div className="space-y-1">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg width="20" height="20" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="text-sm font-semibold text-gray-800">{file.name}</div>
                  <div className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB — cliquer pour changer
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <svg width="20" height="20" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                    </svg>
                  </div>
                  <div className="text-sm text-gray-500">
                    Glissez votre CSV ici ou{" "}
                    <span className="text-blue-600 font-medium underline">parcourir</span>
                  </div>
                  <div className="text-xs text-gray-400">.csv ou .txt acceptés</div>
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !file || !topic.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Génération et envoi en cours...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Générer et envoyer les messages
              </span>
            )}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{results.total}</div>
                <div className="text-xs text-gray-500 mt-1">Total contacts</div>
              </div>
              <div className="bg-white border border-green-200 rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-600">{sentCount}</div>
                <div className="text-xs text-gray-500 mt-1">Envoyés</div>
              </div>
              <div className="bg-white border border-red-200 rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-red-500">{failCount}</div>
                <div className="text-xs text-gray-500 mt-1">Échoués</div>
              </div>
            </div>

            {/* Per contact */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 text-sm font-medium text-gray-700">
                Détail des envois
              </div>
              <div className="divide-y divide-gray-100">
                {results.results.map((r, i) => (
                  <div key={i} className="px-5 py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          r.sent ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                        }`}>
                          {r.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{r.name}</div>
                          <div className="text-xs text-gray-400">{r.phone}</div>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        r.sent
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {r.sent ? "✓ Envoyé" : "✗ Échoué"}
                      </span>
                    </div>
                    {r.message && (
                      <p className="text-xs text-gray-500 leading-relaxed ml-11 bg-gray-50 rounded-lg px-3 py-2">
                        {r.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}