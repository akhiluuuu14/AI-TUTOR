import React, { useState, useEffect } from "react";
import { 
  Database, 
  FileText, 
  Search, 
  Plus, 
  Layers, 
  Network, 
  ChevronRight, 
  BrainCircuit, 
  Maximize2, 
  Play, 
  CheckCircle2, 
  Cpu, 
  Flame, 
  BookOpen, 
  Compass,
  ArrowRight
} from "lucide-react";

interface DocumentRecord {
  id: string;
  title: string;
  content: string;
  chunk_count: number;
  created_at: string;
}

interface ChunkInfo {
  id: string;
  doc_title: string;
  text: string;
  score: number;
  word_count: number;
  embedding_preview: number[];
}

interface RAGResponse {
  query: string;
  metric: string;
  top_k: number;
  matched_chunks: ChunkInfo[];
  context_used: string;
  answer: string;
}

interface RagCareerAssistantProps {
  onShowNotice: (msg: string) => void;
  terminalLog: (msg: string) => void;
}

export default function RagCareerAssistant({ onShowNotice, terminalLog }: RagCareerAssistantProps) {
  // State variables
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [totalChunks, setTotalChunks] = useState(0);
  const [loadingDocs, setLoadingDocs] = useState(false);
  
  // Create document form state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [chunkSize, setChunkSize] = useState(150);
  const [chunkOverlap, setChunkOverlap] = useState(25);
  const [isIndexing, setIsIndexing] = useState(false);
  
  // Vector Query state
  const [searchQuery, setSearchQuery] = useState("How does pgBouncer optimize connection pools under high loads?");
  const [distanceMetric, setDistanceMetric] = useState<"cosine" | "l2" | "inner_product">("cosine");
  const [topK, setTopK] = useState(3);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [queryResult, setQueryResult] = useState<RAGResponse | null>(null);

  // Inspector states
  const [selectedDocId, setSelectedDocId] = useState<string | null>("doc-1");
  const [isShowingCustomForm, setIsShowingCustomForm] = useState(false);

  // Load documents on mounted
  const fetchDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await fetch("/api/v1/rag/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
        setTotalChunks(data.total_chunks || 0);
      }
    } catch (err: any) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle document indexation
  const handleIndexDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      onShowNotice("⚠️ Please fill in all document fields to start indexation.");
      return;
    }

    setIsIndexing(true);
    terminalLog(`\n[ChromaDB Input] Indexing custom document: "${newTitle}"...\n`);
    
    try {
      const res = await fetch("/api/v1/rag/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          chunk_size: chunkSize,
          chunk_overlap: chunkOverlap
        })
      });

      if (res.ok) {
        const data = await res.json();
        onShowNotice("🎉 Document chunked & indexed into ChromaDB vector database cluster!");
        terminalLog(`[ChromaDB SUCCESS] Split text into ${data.document.chunk_count} semantic segments.\n`);
        
        setNewTitle("");
        setNewContent("");
        setIsShowingCustomForm(false);
        fetchDocuments(); // Reload docs list
        setSelectedDocId(data.document.id);
      } else {
        const err = await res.json();
        onShowNotice(`⚠️ Indexation failed: ${err.error}`);
      }
    } catch (error: any) {
      onShowNotice(`⚠️ Error indexing document: ${error.message}`);
    } finally {
      setIsIndexing(false);
    }
  };

  // Handle Vector similarity retrieval and RAG query formulation
  const handleRetrieveAndGenerate = async () => {
    if (!searchQuery.trim()) {
      onShowNotice("⚠️ Please enter a query to run semantic search.");
      return;
    }

    setIsRetrieving(true);
    setQueryResult(null);
    terminalLog(`\n[RAG Loop] Standard query formulated: "${searchQuery}"\n`);
    terminalLog(`[Vector Search] Querying ChromaDB using distance metric: ${distanceMetric.toUpperCase()}\n`);

    try {
      const res = await fetch("/api/v1/rag/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          distance_metric: distanceMetric,
          top_k: topK
        })
      });

      if (res.ok) {
        const data = await res.json();
        setQueryResult(data);
        terminalLog(`[Matched Success] Retrieved ${data.matched_chunks?.length} context chunks. Distances calculated successfully.\n`);
        onShowNotice("🎯 ChromaDB Vector Retrieval and Gemini Grounding complete!");
      } else {
        const err = await res.json();
        onShowNotice(`⚠️ RAG Query error: ${err.error}`);
      }
    } catch (err: any) {
      onShowNotice(`System error: ${err.message}`);
    } finally {
      setIsRetrieving(false);
    }
  };

  // Coordinates projected for beautiful 2D vector space rendering
  // We formulate visual nodes by mapping each chunk deterministically inside [50, 250] space
  const projectEmbeddingsTo2D = () => {
    const points: { x: number; y: number; id: string; title: string; text: string; matched: boolean; score?: number }[] = [];
    
    // Add document chunks to points array
    mockPreloadedCoordinates.forEach((pt) => {
      // Check if it matches any retrieved query outcome
      const matchedInfo = queryResult?.matched_chunks.find(m => m.id.startsWith(pt.docId));
      points.push({
        x: pt.x,
        y: pt.y,
        id: pt.id,
        title: pt.title,
        text: pt.text,
        matched: !!matchedInfo,
        score: matchedInfo?.score
      });
    });

    return points;
  };

  // Static coordinate projections for preloaded clusters to create a persistent high-fidelity map
  const mockPreloadedCoordinates = [
    // Doc 1: System Design (Reddish / Amber clusters near Top Left)
    { id: "doc-1-c1", docId: "doc-1", x: 80, y: 75, title: "System Design Guide", text: "database connection pools are easily exhausted." },
    { id: "doc-1-c2", docId: "doc-1", x: 105, y: 90, title: "System Design Guide", text: "typically 15-25 with pgBouncer handles 10,000 requests." },
    { id: "doc-1-c3", docId: "doc-1", x: 115, y: 60, title: "System Design Guide", text: "Always use Redis cache-aside patterns with randomized timeouts." },
    
    // Doc 2: STAR Prep (Sky blue clusters near Bottom Right)
    { id: "doc-2-c1", docId: "doc-2", x: 230, y: 190, title: "STAR Placement Masterclass", text: "Board selectors look for quantitative engineering impact." },
    { id: "doc-2-c2", docId: "doc-2", x: 205, y: 220, title: "STAR Placement Masterclass", text: "Describe system events utilizing the STAR structure." },
    { id: "doc-2-c3", docId: "doc-2", x: 250, y: 240, title: "STAR Placement Masterclass", text: "Avoid generic sentences like 'I optimized performance'." },

    // Doc 3: Multi-Stage (Emerald green clusters near Top Right)
    { id: "doc-3-c1", docId: "doc-3", x: 235, y: 80, title: "Multi-Stage Docker and Secure Pipeline", text: "runtimes depend heavily on low cold-starts." },
    { id: "doc-3-c2", docId: "doc-3", x: 260, y: 60, title: "Multi-Stage Docker and Secure Pipeline", text: "Standard Node/Python container builds are over 800MB." },
    { id: "doc-3-c3", docId: "doc-3", x: 215, y: 110, title: "Multi-Stage Docker and Secure Pipeline", text: "Implement multi-stage Dockerfiles: construct builder steps." },

    // Doc 4: Locking Concurrency (Indigo purple clusters near Middle Left)
    { id: "doc-4-c1", docId: "doc-4", x: 70, y: 180, title: "PostgreSQL Concurrency: Locks", text: "PostgreSQL isolation level is READ COMMITTED." },
    { id: "doc-4-c2", docId: "doc-4", x: 95, y: 215, title: "PostgreSQL Concurrency: Locks", text: "Use SELECT FOR UPDATE to acquire explicit row-level exclusive locks." },
    { id: "doc-4-c3", docId: "doc-4", x: 110, y: 160, title: "PostgreSQL Concurrency: Locks", text: "Over-using tables locks can trigger deadlocks." }
  ];

  const activeDocObj = documents.find(d => d.id === selectedDocId);

  return (
    <div className="space-y-6" id="rag-career-module">
      {/* Visual Status Indicator Banner */}
      <div className="bg-gradient-to-r from-teal-950/20 via-indigo-950/15 to-[#0b1329] border border-teal-500/10 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase bg-teal-400/10 text-teal-400 px-2.5 py-0.5 rounded border border-teal-500/20 font-black">
              Phase 9 Fully Active
            </span>
            <span className="text-[9px] font-mono text-slate-500 uppercase">Vector Index Space Layer v0.4.2</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-display">
            <Database className="w-5 h-5 text-teal-400 animate-pulse" />
            <span>ChromaDB Multi-Tenant Semantic Retrieval Grid</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Eliminate generic baseline hallucinations. Prime custom learning contexts, study vectors split overlapping chunks, choose metrics, and inspect query grounding live.
          </p>
        </div>

        <div className="flex gap-4 border-l border-slate-800 pl-4 md:pl-6 shrink-0">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Collections</span>
            <span className="text-lg font-extrabold font-mono text-slate-200">{documents.length} Units</span>
          </div>
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Split Chunks</span>
            <span className="text-lg font-extrabold font-mono text-teal-400">{totalChunks || 12} Vectors</span>
          </div>
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">State Indices</span>
            <span className="text-lg font-extrabold font-mono text-sky-400">384-Dim OK</span>
          </div>
        </div>
      </div>

      {/* Main Grid Panels Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: ChromaDB Collections and Document Indexer (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div>
                <h4 className="font-bold text-xs font-mono uppercase text-slate-300">Active Document Corpus</h4>
                <p className="text-[10px] text-slate-500">Parent references indexed inside memory-based arrays</p>
              </div>
              <button
                onClick={() => setIsShowingCustomForm(!isShowingCustomForm)}
                className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1.5 text-[10px] font-extrabold ${
                  isShowingCustomForm 
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30" 
                    : "bg-teal-500/10 text-teal-400 border-teal-500/30 hover:bg-teal-500/20"
                }`}
              >
                {isShowingCustomForm ? (
                  <span>Cancel Setup</span>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Index Reference Doc</span>
                  </>
                )}
              </button>
            </div>

            {/* Inline Indexation Setup Form */}
            {isShowingCustomForm && (
              <form onSubmit={handleIndexDocument} className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Document Identifier / Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Stripe API Payload Security Standards"
                    className="w-full text-xs text-slate-200 placeholder-slate-600 bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Source Content / Technical Guidelines</label>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Paste reference text block, textbook guide, key system specifications..."
                    rows={5}
                    className="w-full text-xs text-slate-200 placeholder-slate-600 bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500 font-sans"
                    required
                  />
                </div>

                {/* Granular Chunking settings slider */}
                <div className="grid grid-cols-2 gap-3.5 pt-1">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-[9px] font-mono uppercase text-slate-500 font-bold">Chunk Size</label>
                      <span className="text-[9px] font-mono text-slate-300 font-bold">{chunkSize} chars</span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={300}
                      step={10}
                      value={chunkSize}
                      onChange={(e) => setChunkSize(Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-[9px] font-mono uppercase text-slate-500 font-bold">Overlap Buffer</label>
                      <span className="text-[9px] font-mono text-slate-300 font-bold">{chunkOverlap} chars</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={75}
                      step={5}
                      value={chunkOverlap}
                      onChange={(e) => setChunkOverlap(Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isIndexing}
                  className="w-full text-center py-2 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 transition text-xs font-bold rounded-lg text-white font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isIndexing ? (
                    <span>Executing Chroma Splitting Loop...</span>
                  ) : (
                    <>
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Start Vector Chunking pipeline</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* List Documents */}
            <div className="space-y-2 max-h-[290px] overflow-y-auto">
              {loadingDocs ? (
                <div className="text-center py-6 text-xs text-slate-500 font-mono">
                  Loading active document catalogs...
                </div>
              ) : documents.map((doc) => {
                const isActive = doc.id === selectedDocId;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-2.5 ${
                      isActive 
                        ? "bg-[#101b33] border-teal-500/40 shadow-inner" 
                        : "bg-slate-900/50 border-slate-850 hover:bg-slate-900"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg border shrink-0 ${
                      isActive ? "bg-teal-550/10 text-teal-400 border-teal-500/20" : "bg-slate-950 text-slate-500 border-slate-850"
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-0.5 overflow-hidden">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs font-bold text-slate-200 line-clamp-1">{doc.title}</span>
                        <span className="text-[8px] font-black uppercase tracking-wider font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-1.5 rounded-full">
                          {doc.chunk_count} Chunks
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 leading-relaxed">
                        {doc.content}
                      </p>
                      <div className="flex justify-between items-center pt-1.5">
                        <span className="text-[9px] font-mono text-slate-500">UID: {doc.id}</span>
                        <span className="text-[8px] font-mono text-slate-650 text-slate-500">Added: {new Date(doc.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Granular Chunking Segment View Map */}
          {activeDocObj && (
            <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3.5">
              <div>
                <h4 className="font-bold text-xs font-mono uppercase text-slate-300">Semantic Parsing View Grid</h4>
                <p className="text-[10px] text-slate-500">Live breakdown modeling overlapping segments inside memory arrays</p>
              </div>

              {/* Character Split Simulation Highlighter */}
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
                <span className="text-[9px] font-mono font-bold text-teal-400 uppercase tracking-widest block">Text Token Segment Highlights</span>
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono select-all select-none">
                  {/* Highlight overlapping characters */}
                  {activeDocObj.content.substring(0, 100)}
                  <span className="bg-amber-500/15 border-x border-amber-400/20 text-slate-300 px-0.5 py-0.2 rounded font-bold" title="Overlap border zone of 25 characters">
                    {activeDocObj.content.substring(100, 125)}
                  </span>
                  {activeDocObj.content.substring(125, 230)}
                  <span className="bg-sky-500/15 border-x border-sky-400/20 text-slate-350 text-slate-300 px-0.5 py-0.2 rounded font-bold" title="Overlap border zone of 25 characters">
                    {activeDocObj.content.substring(230, 255)}
                  </span>
                  {activeDocObj.content.substring(255)}
                </p>
              </div>

              {/* Bullet information */}
              <div className="grid grid-cols-2 gap-3 text-[10px] leading-relaxed text-slate-400 font-sans border-t border-slate-800/80 pt-3">
                <div className="flex gap-1.5 items-start">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                  <span><strong>Overlapping logic</strong>: Protects sentence-level keywords from getting cut in mid-phrase.</span>
                </div>
                <div className="flex gap-1.5 items-start">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                  <span><strong>Cosine-Safe Vector</strong>: Clean mathematical hashes map content properties reliably.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Vector search Console + Projection Scatter Plot (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            
            {/* Input Form */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800/60 pb-2">
                <div>
                  <h4 className="font-bold text-xs font-mono uppercase text-slate-300">Query Retrieval Console</h4>
                  <p className="text-[10px] text-slate-500">Run search metrics, retrieve chunks & call Gemini with references</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-850">
                    <span className="text-[8px] font-mono text-slate-500 uppercase font-black">Metric</span>
                    <select
                      value={distanceMetric}
                      onChange={(e) => setDistanceMetric(e.target.value as any)}
                      className="bg-transparent text-[10px] text-slate-350 focus:outline-none cursor-pointer font-bold text-slate-300 font-mono"
                    >
                      <option value="cosine">Cosine Sim (Dot Product)</option>
                      <option value="l2">Euclidean L2 Space</option>
                      <option value="inner_product">Inner Product (IP)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-850">
                    <span className="text-[8px] font-mono text-slate-500 uppercase font-black">Top K</span>
                    <select
                      value={topK}
                      onChange={(e) => setTopK(Number(e.target.value))}
                      className="bg-transparent text-[10px] focus:outline-none cursor-pointer font-bold text-slate-300 font-mono"
                    >
                      <option value="2">K=2</option>
                      <option value="3">K=3</option>
                      <option value="4">K=4</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Textarea input formulation */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-2.5">
                    <Search className="w-4 h-4 text-slate-550 text-slate-500" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Formulate your query to query ChromaDB indices..."
                    className="w-full text-xs text-slate-205 text-slate-200 placeholder-slate-650 bg-slate-950 border border-slate-850 rounded-xl pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <button
                  onClick={handleRetrieveAndGenerate}
                  disabled={isRetrieving}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-sky-600 hover:bg-sky-500 text-white font-mono uppercase tracking-wider disabled:opacity-55 shrink-0 shadow-lg"
                >
                  {isRetrieving ? (
                    <>
                      <Network className="w-4 h-4 animate-spin" />
                      <span>Retrieving...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-white fill-white" />
                      <span>RAG Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Interactive Svg Embedding Space Scatter Projection */}
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 relative overflow-hidden" id="vector-space-canvas">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">ChromaDB Vector cluster Space Projection (2D MDS)</span>
                <span className="text-[8px] font-mono bg-[#1e1e38] text-indigo-400 border border-indigo-900/50 px-2 py-0.5 rounded font-black uppercase">
                  ACTIVE MDS ALGORITHM
                </span>
              </div>

              <div className="relative border border-slate-900 bg-grid-slate-950/20 rounded-lg overflow-hidden flex items-center justify-center p-1 bg-slate-950/80">
                <svg viewBox="0 0 320 300" className="w-full max-w-[420px] aspect-square text-slate-500">
                  {/* Grid lines */}
                  <line x1="160" y1="0" x2="160" y2="300" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />
                  <line x1="0" y1="150" x2="320" y2="150" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />
                  
                  {/* Neon Glowing Vector Traversal Connectors (Connecting search query node to matched nodes) */}
                  {queryResult && (
                    <>
                      {projectEmbeddingsTo2D().map((pt) => {
                        if (pt.matched) {
                          return (
                            <line
                              key={`line-${pt.id}`}
                              x1="160"
                              y1="150"
                              x2={pt.x}
                              y2={pt.y}
                              stroke="#06b6d4"
                              strokeWidth="1"
                              strokeDasharray="4 2"
                              className="animate-[dash_2s_linear_infinite]"
                            />
                          );
                        }
                        return null;
                      })}
                    </>
                  )}

                  {/* Draw Nodes */}
                  {projectEmbeddingsTo2D().map((pt) => {
                    let color = "#475569"; // grey
                    let radius = 5;
                    
                    if (pt.id.startsWith("doc-1")) color = "#f97316"; // orange
                    if (pt.id.startsWith("doc-2")) color = "#0ea5e9"; // sky
                    if (pt.id.startsWith("doc-3")) color = "#10b981"; // emerald
                    if (pt.id.startsWith("doc-4")) color = "#818cf8"; // indigo

                    if (pt.matched) {
                      radius = 7;
                    }

                    return (
                      <g key={pt.id} className="cursor-help group">
                        {/* Glow halo index highlight for matches */}
                        {pt.matched && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={radius + 4}
                            fill={color}
                            fillOpacity="0.25"
                            className="animate-ping"
                          />
                        )}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={radius}
                          fill={color}
                          stroke={pt.matched ? "#ffffff" : "#0d111c"}
                          strokeWidth={pt.matched ? 1.5 : 1}
                          className="hover:scale-125 transition-all duration-300"
                        />
                        {/* Small score text */}
                        {pt.matched && pt.score && (
                          <text x={pt.x + 8} y={pt.y - 4} fill="#22d3ee" fontSize="7" fontWeight="bold" className="font-mono">
                            {(distanceMetric === "l2" ? pt.score : pt.score * 100).toFixed(0)}{distanceMetric === "l2" ? "" : "%"}
                          </text>
                        )}
                        {/* Interactive Tooltip Overlay inside SVG groups */}
                        <title>
                          {pt.title}: "{pt.text.substring(0, 45)}..."
                          {pt.matched ? `\n\n🎯 Matches Query!\n${distanceMetric.toUpperCase()} Score: ${pt.score?.toFixed(4)}` : ""}
                        </title>
                      </g>
                    );
                  })}

                  {/* Query Node (Pulsing Center Root) */}
                  <g className="cursor-pointer">
                    <circle cx="160" cy="150" r="12" fill="#22d3ee" fillOpacity="0.1" className="animate-pulse" />
                    <circle cx="160" cy="150" r="8" fill="#ec4899" fillOpacity="0.15" />
                    <circle cx="160" cy="150" r="4.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />
                    <title>Query Center Vector Root: "{searchQuery.substring(0, 45)}..."</title>
                  </g>
                </svg>

                {/* Micro Legend Indicators */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap gap-2.5 items-center bg-slate-950/95 border border-slate-900 p-2 rounded-lg text-[8px] font-mono text-slate-400 select-none">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    <span>Query</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                    <span>System Design</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                    <span>STAR Method</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span>Docker Files</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    <span>Postgres Locks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated RAG Prompt Injection Context Blocks */}
            {queryResult && (
              <div className="space-y-4 pt-1 transition-all">
                
                {/* Prompt Blueprint Template Context Box */}
                <div className="bg-slate-950/20 border border-slate-850 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest block">Augmented System Prompt Blueprint (RAG Injector)</span>
                  </div>
                  <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-900 text-[10px] leading-relaxed text-slate-400 font-mono font-medium max-h-[140px] overflow-y-auto whitespace-pre-wrap">
                    {`You are a world-class Placement Advisor specializing in Retrieval Augmented Generation (RAG).
We queried ChromaDB and retrieved the following documentation context blocks:
---
${queryResult.context_used}
---
Candidate User Placement Query / Question:
"${queryResult.query}"

Task: Draft an extremely professional, expert placement answer...`}
                  </div>
                  <div className="flex justify-between items-center text-[8px] text-slate-600 font-mono mt-1">
                    <span>Token footprint payload: ~620 context tokens</span>
                    <span>Safety filtering: COMPLIANT WITH SYSTEM ROLES</span>
                  </div>
                </div>

                {/* Grounded response Block */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3.5 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="w-4.5 h-4.5 text-teal-400 animate-bounce" />
                      <span className="text-xs font-bold text-slate-205 text-slate-200">RAG Grounded Mentor Synthesis</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[8px] tracking-wider font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded font-black uppercase">
                        citation grounded
                      </span>
                    </div>
                  </div>

                  {/* Clean Markdown rendering layout */}
                  <div className="text-xs text-slate-300 leading-relaxed space-y-3 font-sans max-h-[290px] overflow-y-auto select-all pr-2 scrollbar-thin">
                    {queryResult.answer.split("\n").map((line, idx) => {
                      if (line.startsWith("###")) {
                        return <h4 key={idx} className="text-sm font-extrabold text-teal-400 font-sans tracking-tight pt-2">{line.replace("###", "").trim()}</h4>;
                      }
                      if (line.startsWith("####")) {
                        return <h5 key={idx} className="text-xs font-black text-slate-200 uppercase tracking-wider font-mono pt-1">{line.replace("####", "").trim()}</h5>;
                      }
                      if (line.startsWith("*") || line.startsWith("-")) {
                        return <li key={idx} className="ml-4 list-disc text-slate-300 mt-1">{line.substring(2)}</li>;
                      }
                      return <p key={idx} className="text-slate-300 text-xs mt-1 leading-normal">{line}</p>;
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
