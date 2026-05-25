import { useState, useRef,useEffect } from "react";
import { DocsApi } from "../api/docs";

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const PDFIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="2" width="13" height="17" rx="2" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
    <path d="M16 2l5 5h-5V2z" fill="#fca5a5" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M7 9h6M7 12h6M7 15h4" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);




export default function DocumentsPDF() {
  const [docs, setDocs] = useState([]);
  const [search, setSearch] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  const fetchDocs=async()=>{
    const res=await DocsApi.loadDoc()
    setDocs(res.docs)
    
}

useEffect(() => {
  fetchDocs();
}, []);
  const filtered = docs.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleFiles = async (files) => {
    const pdfs = Array.from(files).filter((f) => f.type === "application/pdf");
    if (!pdfs.length) return;
    setUploading(true);
    try{
      for (const file of pdfs){
        const formData=new FormData()
        formData.append("file",file);
        const res=await DocsApi.upload(formData)
      setDocs((prev)=>[res.document, ...prev])
      }
    }
    catch(err){
      console.error(err);
    }
  finally{
    setUploading(false);
  }
    
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = (id) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
          <PDFIcon size={18} />
        </div>
        <div>
          <h1 className="text-base font-semibold text-gray-800">Documents (PDF)</h1>
          <p className="text-xs text-gray-400">Base de Connaissances · Gérez vos documents PDF utilisés pour répondre aux utilisateurs</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 font-medium">
            {docs.filter((d) => d.status === "indexed").length} indexés
          </span>
          <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-3 py-1 font-medium">
            {docs.filter((d) => d.status === "processing").length} en cours
          </span>
        </div>
      </div>

      <div className="px-8 py-6 max-w-5xl mx-auto space-y-5">
        {/* Upload zone */}
        <div
          className={`relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer
            ${dragging ? "border-green-400 bg-green-50" : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/30"}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
              ${dragging ? "bg-green-400 text-white" : "bg-green-100 text-green-600"}`}>
              <UploadIcon />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">
                {dragging ? "Déposez vos fichiers ici" : "Glissez-déposez vos fichiers PDF"}
              </p>
              <p className="text-xs text-gray-400 mt-1">ou <span className="text-green-600 font-medium underline underline-offset-2">cliquez pour parcourir</span> · PDF uniquement · Max 20 MB</p>
            </div>
            {uploading && (
              <div className="flex items-center gap-2 text-xs text-green-600 font-medium animate-pulse">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Téléchargement en cours...
              </div>
            )}
          </div>
        </div>

        {/* Search + count */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
            />
          </div>
          <span className="text-sm text-gray-400 whitespace-nowrap">
            {filtered.length} document{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Documents list */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <PDFIcon size={40} />
              <p className="text-sm font-medium">Aucun document trouvé</p>
              <p className="text-xs">Ajoutez des PDF pour enrichir votre base de connaissances</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="text-left px-5 py-3 w-1/2">Document</th>
                  <th className="text-left px-3 py-3">Taille</th>
                  <th className="text-left px-3 py-3">Pages</th>
                  <th className="text-left px-3 py-3">Statut</th>
                  <th className="text-left px-3 py-3">Ajouté le</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc, i) => (
                  <tr
                    key={doc.id}
                    className={`border-b border-gray-50 hover:bg-green-50/20 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <PDFIcon size={32} />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate max-w-[240px]">{doc.name}</p>
                          {doc.status === "indexed" && (
                            // <p className="text-xs text-gray-400">{doc.chunks} fragments indexés</p>
                            <p>part of chunks</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-gray-500 text-xs">{formatBytes(doc.size)}</td>
                    <td className="px-3 py-3.5 text-gray-500 text-xs">{doc.pages}</td>
                    <td className="px-3 py-3.5">
                      {doc.status === "indexed" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                          <CheckCircleIcon />
                          Indexé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-full px-2.5 py-1">
                          <span className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                          En cours
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-gray-400 text-xs">
                      <div className="flex items-center gap-1">
                        <ClockIcon />
                        {formatDate(doc.uploadedAt)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                          title="Aperçu"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(doc)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Supprimer"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5">
          <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs text-blue-700 leading-relaxed">
            Les documents indexés sont utilisés automatiquement par l'IA pour répondre aux questions des utilisateurs WhatsApp. Plus vos documents sont précis et structurés, meilleures seront les réponses générées.
          </p>
        </div>
      </div>

      {/* Preview modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setPreviewDoc(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-5">
              <PDFIcon size={36} />
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{previewDoc.name}</h3>
                <p className="text-xs text-gray-400">Détails du document</p>
              </div>
            </div>
            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
              {[
                ["Taille", formatBytes(previewDoc.size)],
                ["Pages", previewDoc.pages],
                ["Fragments indexés", previewDoc.status === "indexed" ? previewDoc.chunks : "—"],
                ["Statut", previewDoc.status === "indexed" ? "Indexé ✓" : "En cours de traitement"],
                ["Ajouté le", formatDate(previewDoc.uploadedAt)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 text-xs">{label}</span>
                  <span className="font-medium text-gray-700 text-xs">{value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPreviewDoc(null)}
              className="mt-5 w-full py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-600 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <TrashIcon />
            </div>
            <h3 className="text-center font-semibold text-gray-800 mb-1">Supprimer le document ?</h3>
            <p className="text-center text-xs text-gray-400 mb-5">
              <span className="font-medium text-gray-600">"{deleteConfirm.name}"</span> sera supprimé définitivement de votre base de connaissances.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-sm font-medium text-white transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}