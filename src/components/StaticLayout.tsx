export default function StaticLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white font-sans pt-[120px] pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-12 border-b border-slate-100 pb-8">{title}</h1>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
