import { useState } from "react";
import { Sparkles, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

interface AIFixPanelProps {
  issueLabel: string;
  currentContent: string;
  context: string;
}

export function AIFixPanel({ issueLabel, currentContent, context }: AIFixPanelProps) {
  const [loading, setLoading] = useState(false);
  const [fix, setFix] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const getFix = async () => {
    if (fix) {
      setExpanded(!expanded);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/generate-fix", {
        issueLabel,
        currentContent,
        context,
      });
      setFix(res.data.data);
      setExpanded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mt-4 border border-indigo-100 rounded-2xl bg-indigo-50/30 overflow-hidden transition-all duration-300">
      <button
        onClick={getFix}
        disabled={loading}
        className="w-full flex items-center justify-between p-4 hover:bg-indigo-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : "text-indigo-600"}`} />
          <span className="text-sm font-bold text-indigo-700">
            {loading ? "Generating AI Fix..." : fix ? "View AI Fix" : "Generate AI Fix"}
          </span>
        </div>
        {fix && (expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
      </button>

      {expanded && fix && (
        <div className="p-4 border-t border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="mb-4">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">SEO Reasoning</p>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{fix.reasoning}</p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Optimized Suggestions</p>
            {fix.suggestions.map((suggestion: string, idx: number) => (
              <div key={idx} className="group relative flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-all">
                <p className="text-xs font-bold text-slate-800 flex-1">{suggestion}</p>
                <button
                  onClick={() => handleCopy(suggestion, idx)}
                  className="p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-400 hover:text-indigo-600"
                >
                  {copied === idx ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between pt-4 border-t border-indigo-50">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Impact</span>
              <span className="text-xs font-bold text-emerald-600">{fix.impact}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                fix.priority === "High" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
              }`}>
                {fix.priority}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
