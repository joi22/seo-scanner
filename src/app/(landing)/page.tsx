"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post("/api/scan", { url });
      setResult(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred while scanning.");
    } finally {
      setLoading(false);
      
      // Scroll to view result on mobile if needed
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Page Scanner</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Blog</Link>
          </div>

          <div>
            <Link href="/login" className="hidden md:inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-indigo-200 text-indigo-600 font-medium hover:bg-indigo-50 transition-colors bg-white">
              Log In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Soft background gradients */}
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-purple-200/50 blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-200/50 blur-[120px] pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-5 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-sm w-max mb-6">
              ✨ SEO Marketing Platform
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Supercharge Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">SEO & Marketing</span> <br />
              for Shopify & Websites
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              All-in-one SEO and marketing automation tool that helps you boost rankings, traffic, and sales. Perfect for Shopify stores and websites.
            </p>

            <div className="relative z-20">
              <form onSubmit={handleScan} className="flex flex-col sm:flex-row shadow-xl shadow-indigo-100/50 rounded-2xl sm:rounded-full bg-white border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all">
                <div className="flex-grow flex items-center pl-6 pr-4 py-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-slate-400 mr-3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <input 
                    type="text" 
                    placeholder="Enter your website URL" 
                    className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 outline-none font-medium h-full"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 sm:rounded-full transition-all flex items-center justify-center gap-2 m-1 disabled:opacity-70 shadow-lg shadow-indigo-500/25"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : 'Scan Page'}
                </button>
              </form>
              <p className="text-sm font-medium text-slate-500 mt-4 ml-2">
                Free SEO Audit – No credit card required
              </p>
              {error && (
                <p className="text-sm font-medium text-red-500 mt-2 ml-2 bg-red-50 p-2 rounded-lg inline-block border border-red-100">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Right Hero Dashboard Mockup / Results */}
          <div className="lg:col-span-7 relative h-full min-h-[500px] w-full animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 fill-mode-both">
            {/* The main dashboard container */}
            <div className="absolute right-0 top-0 lg:-right-12 xl:-right-24 w-full md:w-[120%] lg:w-[130%] bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden transform md:-rotate-1 md:scale-105 transition-all">
              
              {/* Fake Browser header */}
              <div className="flex items-center px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                </div>
                <div className="mx-auto flex items-center bg-white border border-slate-200 rounded-md px-3 py-1 gap-2 text-xs text-slate-400 w-1/2 justify-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  app.pagescanner.com
                </div>
              </div>

              {/* Dashboard Content inside Mockup */}
              <div className="p-6 md:p-8 bg-slate-50/50 min-h-[500px]">
                
                {result ? (
                  // SHOWN WHEN WE HAVE ACTUAL SCAN RESULTS!
                  <div className="animate-in fade-in zoom-in-95 duration-500 bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-full relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8">
                       <div>
                         <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-green-500 bg-green-100 p-1.5 rounded-full">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </span>
                            Audit Complete!
                         </h2>
                         <p className="text-sm text-slate-500 mt-1 truncate max-w-sm">Scanned: {url}</p>
                       </div>
                       <button className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-slate-600 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                          Download Report
                       </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="col-span-1 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                         <div className="relative w-20 h-20 mb-2">
                           <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                             <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-200" strokeWidth="3"></circle>
                             <circle cx="18" cy="18" r="16" fill="none" className="stroke-indigo-500" strokeWidth="3" strokeDasharray="100" strokeDashoffset={result.h1Count > 0 ? "20" : "60"}></circle>
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-800">
                              {result.h1Count > 0 ? 'A' : 'C'}
                           </div>
                         </div>
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">SEO Grade</span>
                      </div>
                      <div className="col-span-2 grid grid-cols-2 gap-4">
                          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                             <span className="text-xs font-bold text-slate-400 block mb-1">H1 Headings</span>
                             <span className="text-2xl font-black text-slate-800">{result.h1Count}</span>
                          </div>
                          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                             <span className="text-xs font-bold text-slate-400 block mb-1">H2 Headings</span>
                             <span className="text-2xl font-black text-slate-800">{result.h2Count}</span>
                          </div>
                          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm col-span-2">
                             <span className="text-xs font-bold text-slate-400 block mb-1">Keywords Extracted</span>
                             <span className="text-2xl font-black text-slate-800">{result.topKeywords?.length || 0}</span>
                          </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800 mb-3 text-sm">SEO Overview</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                           <div className="mt-0.5 text-green-500">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                           </div>
                           <div>
                             <p className="text-sm font-semibold text-slate-800">Meta Title</p>
                             <p className="text-xs text-slate-500 line-clamp-1">{result.title}</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                           <div className={`mt-0.5 ${result.description ? 'text-green-500' : 'text-amber-500'}`}>
                             {result.description ? 
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> :
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                             }
                           </div>
                           <div>
                             <p className="text-sm font-semibold text-slate-800">Meta Description</p>
                             <p className="text-xs text-slate-500 line-clamp-1">{result.description}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // DEFAULT STATIC MOCKUP (Visible before scanning)
                  <div className={`space-y-6 transition-opacity duration-300 ${loading ? 'opacity-30' : 'opacity-100'}`}>
                    {/* Mock Header */}
                    <div className="flex items-center gap-4 border-b border-slate-200/60 pb-6">
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center text-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">yourwebsite.com/product</h3>
                        <p className="text-xs text-slate-400">Scanned a few hours ago</p>
                      </div>
                      <div className="ml-auto flex gap-2">
                        <div className="h-8 w-24 bg-slate-200/50 rounded-md"></div>
                      </div>
                    </div>

                    {/* Mock Scores Grid */}
                    <div className="grid grid-cols-4 gap-4">
                      {/* Score 1 */}
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider mb-3">SEO SCORE</span>
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="4"></circle>
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-emerald-400" strokeWidth="4" strokeDasharray="100" strokeDashoffset="22"></circle>
                          </svg>
                          <span className="text-xl font-bold text-slate-700">78</span>
                        </div>
                      </div>
                      {/* Score 2 */}
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider mb-3">PERFORMANCE</span>
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="4"></circle>
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-blue-500" strokeWidth="4" strokeDasharray="100" strokeDashoffset="15"></circle>
                          </svg>
                          <span className="text-xl font-bold text-slate-700">85</span>
                        </div>
                      </div>
                      {/* Score 3 */}
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider mb-3">KEYWORDS</span>
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="4"></circle>
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-purple-500" strokeWidth="4" strokeDasharray="100" strokeDashoffset="28"></circle>
                          </svg>
                          <span className="text-xl font-bold text-slate-700">72</span>
                        </div>
                      </div>
                      {/* Overall Grade Card */}
                      <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-5 rounded-2xl shadow-md border border-emerald-300 flex flex-col items-center justify-center text-white relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
                        <span className="text-[10px] font-bold tracking-wider mb-3 opacity-90">OVERALL</span>
                        <span className="text-5xl font-black drop-shadow-sm mb-1 leading-none">B</span>
                        <span className="text-[10px] font-medium opacity-90">Good Optimization</span>
                      </div>
                    </div>

                    {/* Mock Detailed List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative">
                      <div className="flex gap-4 border-b border-slate-100 pb-4 mb-4">
                        <div className="text-sm font-semibold text-indigo-600 border-b-2 border-indigo-600 pb-4 -mb-[17px]">SEO Overview</div>
                        <div className="text-sm font-medium text-slate-400 pb-4">Keywords</div>
                        <div className="text-sm font-medium text-slate-400 pb-4">Performance</div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                          <div className="w-32 text-sm font-semibold text-slate-700">Meta Title</div>
                          <div className="h-2 flex-grow bg-slate-100 rounded-full">
                            <div className="w-1/2 h-full bg-emerald-400 rounded-full"></div>
                          </div>
                          <div className="text-xs text-slate-400 w-16 text-right">Good</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          </div>
                          <div className="w-32 text-sm font-semibold text-slate-700">Meta Description</div>
                          <div className="h-2 flex-grow bg-slate-100 rounded-full">
                            <div className="w-1/4 h-full bg-amber-400 rounded-full"></div>
                          </div>
                          <div className="text-xs text-slate-400 w-16 text-right">Too short</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                          <div className="w-32 text-sm font-semibold text-slate-700">H1 Heading</div>
                          <div className="h-2 flex-grow bg-slate-100 rounded-full">
                            <div className="w-3/4 h-full bg-emerald-400 rounded-full"></div>
                          </div>
                          <div className="text-xs text-slate-400 w-16 text-right">Optimal</div>
                        </div>
                      </div>

                      {/* Floating Glass Element */}
                      <div className="absolute right-[-40px] top-[40%] bg-white/60 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 rounded-xl hidden xl:block w-48">
                         <div className="text-xs font-bold text-slate-800 mb-2">Detected Keywords</div>
                         <div className="flex flex-wrap gap-1">
                           <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">best product x</span>
                           <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">premium</span>
                           <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">seo rank tool</span>
                         </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <p className="text-slate-400 font-medium whitespace-nowrap">Trusted by <strong className="text-slate-600">2,000+</strong> businesses</p>
          <div className="flex items-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 overflow-x-auto w-full md:w-auto">
            {/* Fake SVG Logos */}
            <div className="text-xl font-black font-serif tracking-tighter flex items-center gap-1">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-600"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg> Shoplix
            </div>
            <div className="text-xl font-bold font-sans tracking-tight flex items-center gap-1">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg> Mivvy
            </div>
            <div className="text-xl font-extrabold font-sans flex items-center gap-1">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-purple-500"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path></svg> GrowthSpark
            </div>
            <div className="text-xl text-slate-800 font-bold font-mono tracking-tight flex items-center gap-1 hidden sm:flex">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-500"><circle cx="12" cy="12" r="10"></circle><path d="M16 12l-4-4-4 4M12 8v8"></path></svg> Monzex
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-48 mb-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 flex items-center justify-center relative overflow-hidden group-hover:border-indigo-200 transition-colors">
                 {/* Mini Mockup styling */}
                 <div className="absolute bottom-[-10px] w-5/6 h-36 bg-white rounded-t-xl shadow-md border border-slate-100 p-3 flex flex-col gap-3">
                    <div className="w-1/3 h-2 bg-slate-200 rounded-full"></div>
                    <div className="flex gap-2">
                       <div className="w-8 h-8 rounded-full border-2 border-emerald-400 bg-emerald-50"></div>
                       <div className="w-8 h-8 rounded-full border-2 border-blue-400 bg-blue-50"></div>
                       <div className="w-8 h-8 rounded-full border-2 border-amber-400 bg-amber-50"></div>
                    </div>
                    <div className="w-full h-8 bg-slate-50 rounded-md"></div>
                 </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Boost Your SEO Rankings</h3>
              <p className="text-slate-500 mb-8 leading-relaxed min-h-[48px]">Perform comprehensive audits and get actionable recommendations.</p>
              <button className="w-full xl:w-auto bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300">
                Get Started Free
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-48 mb-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/50 flex items-center justify-center relative overflow-hidden group-hover:border-blue-200 transition-colors">
                 {/* Mini Mockup styling */}
                 <div className="absolute top-[20px] left-[-10px] w-4/5 h-24 bg-white rounded-xl shadow-md border border-slate-100 p-3 flex flex-col justify-between">
                    <div className="w-1/2 h-2 bg-slate-200 rounded-full"></div>
                    <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden"><div className="w-2/3 h-full bg-blue-500"></div></div>
                 </div>
                 <div className="absolute bottom-[20px] right-[-10px] w-3/4 h-20 bg-white rounded-xl shadow-md border border-slate-100 p-3 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
                    <div className="flex-grow space-y-1"><div className="w-1/2 h-2 bg-slate-200 rounded-full"></div><div className="w-full h-1 bg-slate-100 rounded-full"></div></div>
                 </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Automate Your Marketing</h3>
              <p className="text-slate-500 mb-8 leading-relaxed min-h-[48px]">Set up email, social, and retargeting campaigns on autopilot.</p>
              <button className="w-full xl:w-auto bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300">
                Get Started Free
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-48 mb-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100/50 flex items-center justify-center relative overflow-hidden group-hover:border-purple-200 transition-colors">
                 {/* Mini Mockup styling */}
                 <div className="absolute inset-x-4 bottom-4 top-10 bg-white rounded-t-xl shadow-sm border-t border-x border-slate-100 p-4">
                    <div className="flex justify-between items-end h-full gap-2 pb-2">
                       <div className="w-1/5 bg-slate-100 rounded-t-md h-1/3"></div>
                       <div className="w-1/5 bg-slate-100 rounded-t-md h-2/3"></div>
                       <div className="w-1/5 bg-purple-400 rounded-t-md h-full relative">
                         <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white bg-slate-800 px-1 py-0.5 rounded">82%</div>
                       </div>
                       <div className="w-1/5 bg-slate-100 rounded-t-md h-1/2"></div>
                       <div className="w-1/5 bg-slate-100 rounded-t-md h-1/4"></div>
                    </div>
                 </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Drive More Traffic & Sales</h3>
              <p className="text-slate-500 mb-8 leading-relaxed min-h-[48px]">Discover top keywords & spy on your competitors.</p>
              <button className="w-full xl:w-auto bg-purple-50 hover:bg-purple-600 text-purple-600 hover:text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300">
                Get Started Free
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">All-In-One SEO & Marketing Platform</h2>
            <p className="text-lg text-slate-500">Everything you need to grow your traffic and revenue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Box 1 */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-default">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <h4 className="font-bold text-slate-900 mb-2">SEO Audits</h4>
              <p className="text-sm text-slate-500">Perform in-depth site audits to find structural issues and fix them quickly.</p>
            </div>

            {/* Box 2 */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md hover:blue-200 transition-all cursor-default">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Automated Campaigns</h4>
              <p className="text-sm text-slate-500">Set up email, social, and retargeting campaigns on autopilot.</p>
            </div>

            {/* Box 3 */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md hover:purple-200 transition-all cursor-default">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Keyword & Competitor</h4>
              <p className="text-sm text-slate-500">Discover top keywords and spy on your competitors easily.</p>
            </div>

            {/* Box 4 */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md hover:fuchsia-200 transition-all cursor-default">
              <div className="w-12 h-12 bg-fuchsia-50 rounded-xl flex items-center justify-center text-fuchsia-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Detailed Analytics</h4>
              <p className="text-sm text-slate-500">Track your rankings, traffic, sales, and comprehensive metrics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Minimal Logos */}
      <section className="py-12 bg-slate-50 border-t border-slate-200/60">
         <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-10 lg:gap-16 opacity-40 grayscale">
            <div className="text-2xl font-bold font-sans flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Trustwave</div>
            <div className="text-2xl font-black font-serif tracking-tighter flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg> Shoplix</div>
            <div className="text-2xl font-bold font-sans tracking-tight flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg> Mivvy</div>
            <div className="text-2xl font-extrabold font-sans flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path></svg> GrowthSpark</div>
            <div className="text-2xl font-bold font-mono tracking-tight flex items-center gap-2 hidden sm:flex"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M16 12l-4-4-4 4M12 8v8"></path></svg> Monzex</div>
         </div>
      </section>

    </div>
  );
}
