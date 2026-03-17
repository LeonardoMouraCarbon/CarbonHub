'use client'

import { ArrowLeft, ArrowRight, ArrowUpRight, Plus, CheckCircle, ScanFace, Layers, Diamond, CreditCard, Instagram, Facebook, Twitter } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FinancialLandingPage() {
  return (
    <div className="antialiased selection:bg-emerald-500 selection:text-white text-gray-900 bg-gray-200">
      {/* Main Wrapper with Vertical Layout Lines */}
      <div className="mx-auto max-w-7xl border-l border-r border-dashed border-gray-300 min-h-screen relative bg-gray-50/50">
        {/* Vertical Grid Lines Background */}
        <div className="absolute inset-0 pointer-events-none flex justify-between px-4 opacity-20 z-0">
          <div className="w-px h-full bg-gray-300"></div>
          <div className="w-px h-full bg-gray-300"></div>
          <div className="w-px h-full bg-gray-300"></div>
        </div>

        <main className="relative z-10 p-4 md:p-6 lg:p-8 space-y-6">
          {/* HERO SECTION */}
          <section className="relative w-full rounded-[2.5rem] overflow-hidden bg-[#0f1115] text-white min-h-[600px] flex flex-col justify-between p-8 lg:p-12 shadow-2xl shadow-gray-200 animate-fade-in">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <div className="opacity-60 mix-blend-overlay w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black animate-pulse-slow"></div>
              <div className="bg-gradient-to-t from-[#0f1115] via-transparent to-[#0f1115]/80 absolute inset-0"></div>
            </div>

            {/* Navigation Pill */}
            <div className="relative z-10 w-full flex justify-center animate-slide-down">
              <nav className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full py-2 px-3 flex items-center gap-6 text-sm transition-all duration-300 hover:bg-white/10">
                <div className="inline-flex items-center justify-center w-[100px] h-[40px] bg-white/10 rounded font-bold text-white">
                  LOGO
                </div>
                <a className="text-gray-300 hover:text-white transition-colors duration-200" href="#">Products</a>
                <a className="text-gray-300 hover:text-white transition-colors duration-200" href="#">Solutions</a>
                <a className="text-gray-300 hover:text-white transition-colors duration-200" href="#">Developers</a>
                <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm hover:bg-emerald-50 transition-all duration-200 hover:scale-105">
                  Dashboard
                </button>
              </nav>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 mt-auto max-w-4xl animate-slide-up animate-delay-300">
              <h1 className="text-5xl md:text-7xl leading-[1.1] mb-8 text-white font-medium tracking-tighter">
                The unified API for <br />
                <span className="text-gray-400">modern financial</span> <br />
                infrastructure.
              </h1>
            </div>

            {/* Floating Badge */}
            <div className="absolute bottom-12 right-12 z-20 hidden md:flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 p-2 pr-5 rounded-2xl animate-slide-left animate-delay-500 hover-lift">
              <div className="overflow-hidden w-12 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl relative shadow-lg animate-glow">
                <div className="bg-black/20 absolute inset-0"></div>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Status</p>
                <p className="text-sm text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  All Systems Operational
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-110">
                  <ArrowLeft className="text-white text-base" />
                </button>
                <button className="h-8 w-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-all duration-200 hover:scale-110">
                  <ArrowRight className="text-black text-base" />
                </button>
              </div>
            </div>
          </section>

          {/* THREE COLUMN GRID SECTION */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-12">
            {/* Col 1: Text */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-12 py-4 animate-slide-right">
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="text-sm text-black">01</span>
                <div className="flex gap-2 text-gray-400 text-xs">
                  <span>02</span>
                  <span>03</span>
                  <span>04</span>
                </div>
              </div>
              <div>
                <h3 className="text-3xl lg:text-4xl text-gray-900 leading-tight mb-6 font-medium tracking-tighter">
                  Built for <br />
                  <span className="text-gray-400">Scale & Velocity</span> <br />
                  From First Commit.
                </h3>
                <p className="text-lg text-gray-500 leading-relaxed mb-8">
                  We abstract away the complexity of banking rails so you can focus on building your product, not maintaining infrastructure.
                </p>
                <button className="group flex items-center gap-3 bg-gray-900 text-white pl-5 pr-2 py-2 rounded-full text-base font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <span>Read Documentation</span>
                  <span className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 group-hover:rotate-45 transition-all duration-300">
                    <ArrowUpRight className="text-lg" />
                  </span>
                </button>
              </div>
            </div>

            {/* Col 2: Card Light */}
            <div className="lg:col-span-4 relative group cursor-pointer animate-slide-up animate-delay-200">
              <div className="relative h-[500px] w-full rounded-3xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 transition-opacity duration-500"></div>
                <div className="absolute top-6 left-6 text-white mix-blend-difference transition-transform duration-300 group-hover:translate-x-2">
                  <p className="text-lg tracking-tight">Instant Settlement</p>
                  <p className="text-sm text-gray-300">Global Reach</p>
                </div>
                <div className="absolute bottom-6 w-full px-6 flex justify-between items-end text-white">
                  <div className="transition-transform duration-300 group-hover:translate-y-[-4px]">
                    <p className="text-xl font-medium tracking-tighter">Real-time Rails</p>
                    <button className="mt-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-all duration-200 hover:scale-105">
                      Explore <Plus className="text-base transition-transform duration-200 group-hover:rotate-90" />
                    </button>
                  </div>
                  <span className="text-5xl opacity-50 font-medium tracking-tighter transition-opacity duration-300 group-hover:opacity-70">02</span>
                </div>
              </div>
            </div>

            {/* Col 3: Card Dark */}
            <div className="lg:col-span-4 relative group cursor-pointer animate-slide-left animate-delay-400">
              <div className="relative h-[500px] w-full rounded-3xl overflow-hidden bg-[#1a1a1a] transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-60"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80"></div>
                <div className="absolute top-6 left-6 text-white transition-transform duration-300 group-hover:translate-x-2">
                  <p className="text-lg tracking-tight">Vault Security</p>
                  <p className="text-sm text-gray-400">SOC2 Type II</p>
                </div>
                <div className="absolute bottom-6 w-full px-6 flex justify-between items-end text-white">
                  <div className="max-w-[70%] transition-transform duration-300 group-hover:translate-y-[-4px]">
                    <p className="text-xl mb-2 font-medium tracking-tighter">Zero-Trust Architecture</p>
                    <p className="text-sm text-gray-400 line-clamp-2">Tokenized credentials and end-to-end encryption for every transaction.</p>
                    <button className="mt-4 flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-all duration-200 hover:scale-105">
                      Read More <ArrowRight className="text-base transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                  <span className="absolute bottom-6 right-6 text-5xl opacity-50 font-medium tracking-tighter transition-opacity duration-300 group-hover:opacity-70">03</span>
                </div>
              </div>
              
              {/* Navigation Below */}
              <div className="flex justify-end mt-4 gap-3 animate-fade-in animate-delay-700">
                <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 transition-all duration-200 text-gray-500 hover:text-gray-900 hover:scale-110">
                  <ArrowLeft className="text-lg" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-all duration-200 hover:scale-110 hover:shadow-lg">
                  <ArrowRight className="text-lg" />
                </button>
              </div>
            </div>
          </section>

          {/* BENEFITS SECTION */}
          <section className="py-24 relative overflow-hidden border-b border-gray-200/60 bg-white/50 rounded-[2.5rem]">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDAsIDAsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20 mix-blend-soft-light pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-20 animate-slide-up">
                <div className="inline-flex items-center rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm px-3 py-1 text-xs text-gray-500 mb-6 shadow-sm hover:scale-105 transition-transform duration-200">
                  Benefits
                </div>
                <h2 className="text-4xl md:text-5xl text-gray-900 mb-6 leading-[1.1] font-medium tracking-tighter">
                  Improve every step of the <br className="hidden md:block" /> financial lifecycle
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
                  Convert faster, automate reconciliation, reduce operational overhead, and boost net revenue retention with a single integration.
                </p>
              </div>

              {/* 3 Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                {/* Column 1: Onboarding */}
                <div className="group flex flex-col items-center text-center animate-fade-in animate-delay-200">
                  <div className="relative h-48 w-full flex items-center justify-center mb-8">
                    <div className="w-64 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 relative z-10 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)]">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 animate-pulse-slow">
                          <ScanFace className="text-emerald-600 text-sm" />
                        </div>
                        <div className="text-left space-y-1.5">
                          <div className="h-2 w-24 bg-gray-100 rounded-full animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.04), transparent)' }}></div>
                          <div className="h-1.5 w-16 bg-gray-50 rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2.5 mb-5">
                        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-emerald-500/20 rounded-full group-hover:w-full transition-all duration-1000 ease-out"></div>
                        </div>
                        <div className="h-1.5 w-5/6 bg-gray-50 rounded-full"></div>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                        <span className="text-xs text-emerald-600 font-medium">Verified</span>
                        <CheckCircle className="text-emerald-500 w-4 h-4 animate-bounce-slow" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl text-gray-900 mb-3 font-medium">Faster Onboarding</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Embedded KYC/KYB flows reduce drop-off by 40% and time-to-activation by 3 days.
                  </p>
                </div>

                {/* Column 2: Reconciliation */}
                <div className="group flex flex-col items-center text-center animate-fade-in animate-delay-400">
                  <div className="relative h-48 w-full flex items-center justify-center mb-8">
                    <div className="w-64 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 relative z-10 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)]">
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className={`flex items-center justify-between transition-all duration-300 animate-slide-right`} style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-gray-100 animate-pulse-slow" style={{ animationDelay: `${i * 200}ms` }}></div>
                              <div className="space-y-1">
                                <div className="h-1.5 w-16 bg-gray-100 rounded"></div>
                                <div className="h-1 w-12 bg-gray-50 rounded"></div>
                              </div>
                            </div>
                            <CheckCircle className="text-emerald-500 w-4 h-4 animate-scale-in" style={{ animationDelay: `${i * 150}ms` }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl text-gray-900 mb-3 font-medium">Auto Reconciliation</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Match transactions to ledger entries in real-time. Eliminate manual work and discrepancies.
                  </p>
                </div>

                {/* Column 3: Revenue */}
                <div className="group flex flex-col items-center text-center animate-fade-in animate-delay-700">
                  <div className="relative h-48 w-full flex items-center justify-center mb-8">
                    <div className="w-64 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 relative z-10 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)]">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Revenue</span>
                        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                          <span className="animate-bounce-slow">↗</span> +23%
                        </span>
                      </div>
                      <div className="h-24 flex items-end gap-1">
                        {[40, 65, 45, 70, 55, 80, 60, 90].map((height, i) => (
                          <div 
                            key={i} 
                            className="flex-1 bg-emerald-100 rounded-t transition-all duration-500 group-hover:bg-emerald-200 animate-slide-up" 
                            style={{ 
                              height: `${height}%`,
                              animationDelay: `${i * 50}ms`
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl text-gray-900 mb-3 font-medium">Boost NRR</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Flexible billing models and payment retry logic increase customer lifetime value.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* PRICING SECTION */}
          <section className="py-16 px-4 rounded-[2.5rem] bg-gradient-to-b from-[#0a0a0a] to-[#0f1115] relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-1 text-xs text-gray-400 mb-6">
                  Pricing
                </div>
                <h2 className="text-4xl md:text-5xl text-white mb-4 font-medium tracking-tighter">
                  Simple, transparent pricing
                </h2>
                <p className="text-gray-400 text-lg">
                  Start free. Scale as you grow. No hidden fees.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Startup */}
                <div className="group relative flex flex-col p-8 bg-white/[0.03] border border-white/10 rounded-3xl hover:bg-white/[0.05] transition-colors duration-300">
                  <div className="mb-6 flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                      <Layers className="text-white text-xl" />
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl text-white font-medium tracking-tighter">$0</span>
                      <span className="text-sm text-gray-500">/mo</span>
                    </div>
                    <h3 className="text-lg text-white mt-4">Startup</h3>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">Perfect for testing and small projects.</p>
                  </div>
                  <button className="w-full bg-white/10 text-white py-3 rounded-xl text-sm mb-8 hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                    Start Free <ArrowRight className="text-base" />
                  </button>
                  <div className="space-y-4 mt-auto">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Includes</p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle className="text-gray-500" /> 5,000 live API requests
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle className="text-gray-500" /> Full sandbox access
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle className="text-gray-500" /> Email support
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Card 2: Professional (Highlighted) */}
                <div className="group relative flex flex-col p-8 bg-white/[0.08] border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-emerald-500/20 to-transparent pointer-events-none"></div>
                  <div className="mb-6 flex items-start justify-between relative z-10">
                    <div className="h-10 w-10 rounded-xl bg-emerald-400/20 flex items-center justify-center border border-emerald-400/30">
                      <Layers className="text-emerald-400 text-xl" />
                    </div>
                    <span className="bg-emerald-400 text-black text-[10px] px-2 py-1 rounded uppercase tracking-wider">Most Popular</span>
                  </div>
                  <div className="mb-6 relative z-10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl text-white font-medium tracking-tighter">$99</span>
                      <span className="text-sm text-gray-500">/mo</span>
                    </div>
                    <h3 className="text-lg text-white mt-4">Scale</h3>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">For high-volume production apps.</p>
                  </div>
                  <button className="relative z-10 w-full bg-[#10b981] text-white py-3 rounded-xl text-sm mb-8 hover:bg-[#059669] transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    Upgrade Now <ArrowRight className="text-base" />
                  </button>
                  <div className="space-y-4 mt-auto relative z-10">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Everything in Startup plus</p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm text-white">
                        <CheckCircle className="text-emerald-400" /> 100,000 live API requests
                      </li>
                      <li className="flex items-center gap-3 text-sm text-white">
                        <CheckCircle className="text-emerald-400" /> Priority 24/7 support
                      </li>
                      <li className="flex items-center gap-3 text-sm text-white">
                        <CheckCircle className="text-emerald-400" /> Advanced fraud rules
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Card 3: Enterprise */}
                <div className="group relative flex flex-col p-8 bg-white/[0.03] border border-white/10 rounded-3xl hover:bg-white/[0.05] transition-colors duration-300">
                  <div className="mb-6 flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                      <Diamond className="text-white text-xl" />
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl text-white font-medium tracking-tighter">Custom</span>
                    </div>
                    <h3 className="text-lg text-white mt-4">Platform</h3>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">For marketplaces and large platforms.</p>
                  </div>
                  <button className="w-full bg-white text-black py-3 rounded-xl text-sm mb-8 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    Contact Sales <ArrowRight className="text-base" />
                  </button>
                  <div className="space-y-4 mt-auto">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Features</p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle className="text-gray-500" /> Volume discounts
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle className="text-gray-500" /> Dedicated success manager
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle className="text-gray-500" /> 99.99% Uptime SLA
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ SECTION */}
          <section className="py-16 px-4 rounded-[2.5rem] bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-sm text-gray-500 mb-2 block">/ Support</span>
                <h2 className="text-3xl text-gray-900 font-medium tracking-tighter">Frequently Asked Questions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {[
                  {
                    q: "Can I change my plan later?",
                    a: "Absolutely. You can upgrade, downgrade, or pause your subscription instantly via the dashboard. Usage is prorated to the second."
                  },
                  {
                    q: "How does the Sandbox work?",
                    a: "Sandbox is an exact mirror of our production environment. You can simulate charges, disputes, and payouts without moving real money."
                  },
                  {
                    q: "Is my data secure?",
                    a: "We are SOC2 Type II certified. All sensitive data is encrypted at rest and in transit using bank-grade AES-256 protocols."
                  },
                  {
                    q: "What happens if I hit my rate limit?",
                    a: "We provide soft limits and will alert you before throttling. For unexpected spikes, we offer burst capacity to keep you online."
                  }
                ].map((faq, i) => (
                  <div key={i} className="group">
                    <h3 className="text-lg text-gray-900 mb-2 flex items-center gap-2">
                      <span className="bg-gray-100 rounded-lg p-1 group-hover:bg-gray-200 transition-colors">
                        <Plus className="text-gray-400 text-sm" />
                      </span>
                      {faq.q}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed pl-8">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-8 w-full bg-[#050505] rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-white/5">
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
            
            {/* CTA Section */}
            <div className="pt-24 pb-16 px-8 text-center relative z-10">
              <div className="mx-auto w-20 h-20 bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.15)] backdrop-blur-sm">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/30">
                  <CreditCard className="text-emerald-400 text-2xl drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 font-medium tracking-tighter">Ready to build the future?</h2>
              <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">Join thousands of developers building the next generation of financial products.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-3 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-700 text-white hover:brightness-110 transition-all shadow-[0_0_25px_rgba(16,185,129,0.2)] flex items-center gap-2 border border-emerald-400/20">
                  Start building now <ArrowRight className="text-lg" />
                </button>
                <button className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                  View Documentation
                </button>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full my-8 opacity-50"></div>

            {/* Links Section */}
            <div className="px-8 md:px-16 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
              <div className="lg:col-span-5 space-y-6">
                <h3 className="text-3xl text-white font-medium tracking-tighter">Swipeeely<span className="text-emerald-500">.</span></h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                  Democratizing financial infrastructure for the internet economy.
                </p>
                <div className="flex gap-4 pt-2">
                  <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white border border-white/5" href="#">
                    <Instagram className="text-lg" />
                  </a>
                  <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white border border-white/5" href="#">
                    <Facebook className="text-lg" />
                  </a>
                  <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white border border-white/5" href="#">
                    <Twitter className="text-lg" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:pl-12">
                <div className="space-y-6">
                  <h4 className="text-white">Product</h4>
                  <ul className="space-y-3 text-sm text-gray-500">
                    <li><a className="hover:text-emerald-400 transition-colors" href="#">Payments</a></li>
                    <li><a className="hover:text-emerald-400 transition-colors" href="#">Billing</a></li>
                    <li><a className="hover:text-emerald-400 transition-colors" href="#">Connect</a></li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="text-white">Developers</h4>
                  <ul className="space-y-3 text-sm text-gray-500">
                    <li><a className="hover:text-emerald-400 transition-colors" href="#">Documentation</a></li>
                    <li><a className="hover:text-emerald-400 transition-colors" href="#">API Reference</a></li>
                    <li><a className="hover:text-emerald-400 transition-colors" href="#">Libraries</a></li>
                  </ul>
                </div>
                <div className="space-y-6 hidden sm:block">
                  <h4 className="text-white">Company</h4>
                  <ul className="space-y-3 text-sm text-gray-500">
                    <li><a className="hover:text-emerald-400 transition-colors" href="#">About Us</a></li>
                    <li><a className="hover:text-emerald-400 transition-colors" href="#">Careers</a></li>
                    <li><a className="hover:text-emerald-400 transition-colors" href="#">Legal</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
