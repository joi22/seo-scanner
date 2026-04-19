import { useState } from "react";
import { Sparkles, FileText, ShoppingBag, LayoutGrid, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";

export function AIContentTools() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const tools = [
    { id: "blog", name: "Blog Post Generator", icon: FileText, placeholder: "Enter a topic (e.g. 10 Best Summer Dresses)" },
    { id: "product", name: "Product Description", icon: ShoppingBag, placeholder: "Enter product name & key features" },
    { id: "collection", name: "Collection SEO Content", icon: LayoutGrid, placeholder: "Enter collection theme (e.g. Eco-friendly Yoga Gear)" },
  ];

  const handleGenerate = async () => {
    if (!input) return;
    setLoading(true);
    setResult("");
    try {
      // Reusing generate-fix logic or creating a general generation prompt
      const res = await axios.post("/api/generate-fix", {
        issueLabel: `Generate ${activeTool} content`,
        currentContent: input,
        context: "SaaS Content Tool",
      });
      setResult(res.data.data.suggestions.join("\n\n"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">✍️</span>
        AI Content Factory
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => { setActiveTool(tool.id); setResult(""); }}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
              activeTool === tool.id 
                ? "bg-purple-50 border-purple-200 text-purple-700 ring-2 ring-purple-100" 
                : "bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200"
            }`}
          >
            <tool.icon className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">{tool.name}</span>
          </button>
        ))}
      </div>

      {activeTool && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tools.find(t => t.id === activeTool)?.placeholder}
            className="w-full min-h-[100px] p-5 rounded-2xl border border-slate-200 bg-slate-50 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none font-medium text-sm text-slate-800"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-purple-600 text-white font-black text-sm hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Generate Optimized Content <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      )}

      {result && (
        <div className="mt-6 p-6 rounded-2xl bg-slate-900 text-white/90 font-mono text-xs leading-relaxed max-h-[400px] overflow-y-auto animate-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">AI Generated Content</span>
            <button 
              onClick={() => navigator.clipboard.writeText(result)}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-[10px] font-bold"
            >
              Copy All
            </button>
          </div>
          <p className="whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
}
