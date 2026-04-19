import { RoadmapStep } from "@/lib/roadmapGenerator";
import { CheckCircle2, Circle, TrendingUp } from "lucide-react";

interface RoadmapSectionProps {
  roadmap: RoadmapStep[];
  currentScore: number;
  potentialScore: number;
}

export function RoadmapSection({ roadmap, currentScore, potentialScore }: RoadmapSectionProps) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">🚀</span>
            SEO Improvement Roadmap
          </h2>
          <p className="text-sm text-slate-500 mt-1">Follow these steps to boost your search rankings.</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-emerald-600 font-black text-2xl">
            <TrendingUp className="w-6 h-6" />
            {potentialScore}%
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Potential Score</p>
        </div>
      </div>

      <div className="space-y-6">
        {roadmap.map((step, idx) => (
          <div key={step.id} className="relative flex gap-6">
            {/* Connector Line */}
            {idx !== roadmap.length - 1 && (
              <div className="absolute left-[11px] top-8 bottom-[-24px] w-[2px] bg-slate-100" />
            )}
            
            <div className="z-10 bg-white">
              {step.status === "completed" ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              ) : (
                <Circle className="w-6 h-6 text-slate-300" />
              )}
            </div>

            <div className={`flex-1 p-5 rounded-2xl border transition-all ${
              step.priority === "High" ? "bg-red-50/30 border-red-100" : "bg-slate-50 border-slate-100"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900">{step.task}</h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                  step.priority === "High" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                }`}>
                  +{step.impact} pts
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {step.description}
              </p>
              
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Priority: <span className={step.priority === "High" ? "text-red-500" : "text-amber-500"}>{step.priority}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 p-6 rounded-2xl bg-indigo-600 text-white text-center shadow-xl shadow-indigo-100">
        <p className="text-sm font-bold mb-1">Current Score: {currentScore}%</p>
        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-white transition-all duration-1000" 
            style={{ width: `${currentScore}%` }} 
          />
        </div>
        <p className="text-xs font-medium text-white/70">Estimated improvement: +{potentialScore - currentScore}%</p>
      </div>
    </div>
  );
}
