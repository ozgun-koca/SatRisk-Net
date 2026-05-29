import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Map, 
  Cpu, 
  Layers, 
  TrendingUp, 
  Flame, 
  Zap, 
  ArrowRight, 
  Menu, 
  X, 
  ChevronRight, 
  Code,
  BookOpen,
  Award,
  Globe,
  Database,
  Grid,
  Sun,
  Moon
} from 'lucide-react'

type LandingPageProps = {
  onLaunch: () => void
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void
}

export function LandingPage({ onLaunch, theme, setTheme }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Active section tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'overview', 'problem', 'pipeline', 'models', 'datasets', 'benchmarks', 'edge-ai', 'platform', 'contributions', 'team', 'future']
      const scrollPos = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const top = element.offsetTop
          const height = element.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`min-h-screen font-sans selection:bg-rose-500 selection:text-white overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* 1. NAVIGATION BAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300 border-b ${
        theme === 'dark' 
          ? 'bg-slate-950/80 border-slate-800/60' 
          : 'bg-white/80 border-slate-200/60'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="p-0.5 border border-rose-500/20 rounded-lg overflow-hidden flex items-center justify-center bg-slate-950">
                <img src="/logo.png" alt="SatRisk-Net Logo" className="w-9 h-9 rounded-md object-cover" />
              </div>
              <span className={`text-xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent ${
                theme === 'dark' ? 'from-white via-slate-100 to-rose-400' : 'from-slate-950 via-slate-800 to-rose-600'
              }`}>
                SatRisk-Net
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'problem', label: 'Problem' },
                { id: 'pipeline', label: 'Pipeline' },
                { id: 'models', label: 'Models' },
                { id: 'benchmarks', label: 'Benchmarks' },
                { id: 'edge-ai', label: 'Edge AI' },
                { id: 'team', label: 'Team' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? activeSection === item.id ? 'text-rose-400' : 'text-slate-400 hover:text-white'
                      : activeSection === item.id ? 'text-rose-600' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Nav Right (Theme Switcher + Launch Map) */}
            <div className="hidden sm:flex items-center gap-4">
              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2.5 rounded-xl border transition-all hover:scale-[1.03] active:scale-[0.97] ${
                  theme === 'dark'
                    ? 'border-slate-800 bg-slate-900/60 text-amber-400 hover:bg-slate-900 hover:text-amber-300'
                    : 'border-slate-200 bg-white text-indigo-600 hover:bg-slate-50 hover:text-indigo-700 shadow-sm'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              <button
                onClick={onLaunch}
                className="relative inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-sm shadow-[0_0_20px_rgba(244,63,94,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Launch Map Platform
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Theme Toggle Mobile */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-lg border transition-all ${
                  theme === 'dark'
                    ? 'border-slate-800 bg-slate-900 text-amber-400'
                    : 'border-slate-200 bg-white text-indigo-600 shadow-sm'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg focus:outline-none ${
                  theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden border-b ${
                theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="px-4 pt-2 pb-6 space-y-1.5">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'problem', label: 'The Problem' },
                  { id: 'pipeline', label: 'AI Pipeline' },
                  { id: 'models', label: 'Architectures & Datasets' },
                  { id: 'benchmarks', label: 'Benchmarks' },
                  { id: 'edge-ai', label: 'Edge AI & Jetson' },
                  { id: 'team', label: 'Research Team' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                      theme === 'dark' 
                        ? 'text-slate-300 hover:text-white hover:bg-slate-900' 
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 px-3">
                  <button
                    onClick={onLaunch}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  >
                    Launch Platform
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 lg:pt-48 lg:pb-40 flex flex-col justify-center overflow-hidden">
        {/* Background Grid & Radial Glow */}
        <div className={`absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] ${
          theme === 'dark'
            ? 'bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)]'
        }`} />
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] rounded-full blur-[120px] pointer-events-none ${
          theme === 'dark' ? 'bg-rose-600/10' : 'bg-rose-500/5'
        }`} />
        <div className={`absolute top-1/3 left-1/3 w-[25rem] h-[25rem] rounded-full blur-[100px] pointer-events-none ${
          theme === 'dark' ? 'bg-purple-600/10' : 'bg-purple-500/5'
        }`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left: Title & Actions */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold tracking-wider uppercase mx-auto lg:mx-0 ${
                  theme === 'dark'
                    ? 'border-rose-500/30 bg-rose-500/5 text-rose-400'
                    : 'border-rose-200 bg-rose-50 text-rose-600'
                }`}
              >
                <Award className="w-4 h-4" />
                Hacettepe University Graduation Project
              </motion.div>

              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`text-4xl sm:text-6xl font-extrabold tracking-tight leading-none ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  SatRisk-Net
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`text-lg sm:text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent max-w-2xl mx-auto lg:mx-0 ${
                    theme === 'dark'
                      ? 'from-rose-400 via-purple-300 to-indigo-300'
                      : 'from-rose-600 via-purple-600 to-indigo-600'
                  }`}
                >
                  Optimization of Neural Networks for Satellite Imagery-Based Disaster Risk Monitoring
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className={`text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  An end-to-end AI system for wildfire burn-scar segmentation using Sentinel-2 satellite imagery, modern semantic segmentation architectures, and edge-optimized hardware deployment pipelines.
                </motion.p>
              </div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <button
                  onClick={onLaunch}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-base shadow-[0_0_30px_rgba(244,63,94,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Open Interactive Platform
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollTo('overview')}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border transition-colors font-semibold text-base ${
                    theme === 'dark'
                      ? 'border-slate-700 hover:border-slate-500 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  <BookOpen className="w-5 h-5 text-rose-500" />
                  View Research Overview
                </button>
              </motion.div>

              {/* Statistics Cards */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-left"
              >
                {[
                  { value: '0.8280', label: 'IoU on CEMS' },
                  { value: '137 ms', label: 'Edge Inference' },
                  { value: '99+', label: 'Wildfire Regions' },
                  { value: '3', label: 'Model Options' },
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-xl border backdrop-blur-sm ${
                      theme === 'dark'
                        ? 'border-slate-800/80 bg-slate-900/40'
                        : 'border-slate-200/80 bg-white/60 shadow-sm'
                    }`}
                  >
                    <div className={`text-xl sm:text-2xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent ${
                      theme === 'dark' ? 'from-white to-slate-300' : 'from-slate-900 to-slate-700'
                    }`}>{stat.value}</div>
                    <div className={`text-xs mt-1 font-medium tracking-wide uppercase ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero Right: Visualization Placeholder */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className={`relative aspect-square w-full max-w-[450px] mx-auto rounded-3xl border p-2.5 backdrop-blur-md shadow-2xl overflow-hidden group ${
                theme === 'dark' ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white/40'
              }`}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500/35 to-rose-600/35 rounded-3xl blur opacity-40 group-hover:opacity-60 transition duration-1000" />
                
                {/* Image Container */}
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <img 
                    src="/wildfire.jpg" 
                    alt="Active Wildfire Disaster Remote Sensing" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  {/* Active Radar Sweep animation */}
                  <motion.div 
                    animate={{ y: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_8px_rgba(244,63,94,0.8)] z-10"
                  />

                  {/* Satellite Label badge */}
                  <div className="absolute top-4 left-4 p-1.5 bg-slate-950/80 border border-rose-500/35 rounded-lg text-rose-400 flex items-center gap-1.5 shadow-md">
                    <Globe className="w-4 h-4 animate-spin-slow" />
                    <span className="text-[9px] font-mono font-bold tracking-widest uppercase">Sentinel-2 Live feed</span>
                  </div>

                  {/* Caption at the bottom */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="text-white text-xs font-bold font-mono tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      ACTIVE DISASTER REMOTE SENSING
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. PROJECT OVERVIEW */}
      <section id="overview" className={`py-20 sm:py-28 relative border-t ${
        theme === 'dark' ? 'border-slate-900 bg-slate-950/40' : 'border-slate-200 bg-slate-100/30'
      }`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e293b12,transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Project Overview</h2>
            <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              SatRisk-Net is an advanced deep learning research and deployment project focused on rapid, autonomous wildfire burn-scar segmentation from Sentinel-2 satellite imagery. 
              The system analyzes multi-spectral inputs across multiple wildfire datasets and deploys optimized models directly to NVIDIA Jetson hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-16">
            {[
              {
                icon: Globe,
                title: "Remote Sensing",
                desc: "Harnessing multi-spectral bands from the ESA Sentinel-2 L2A satellite constellation to detect deep infrared signatures of post-fire vegetation destruction."
              },
              {
                icon: Layers,
                title: "Semantic Segmentation",
                desc: "Comparing three distinct Deep Learning architectures (U-Net, DeepLabV3+, SegFormer-B0) to establish a comprehensive quality baseline for burn scars."
              },
              {
                icon: Cpu,
                title: "Edge AI Optimization",
                desc: "Accelerating neural network structures via pruning and TensorRT compilation to enable deployment under 6W constraints on Jetson hardware."
              },
              {
                icon: Map,
                title: "Geospatial Visualization",
                desc: "A fully static, high-performance React + Leaflet interactive platform displaying real-world predictions, ground truths, and exact IoU calculations."
              }
            ].map((card, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col gap-4 relative group overflow-hidden ${
                  theme === 'dark'
                    ? 'border-slate-800/80 bg-slate-900/20 hover:bg-slate-900/40 hover:border-slate-700/80'
                    : 'border-slate-200/80 bg-white/80 hover:bg-white hover:border-slate-300 hover:shadow-md shadow-sm'
                }`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition duration-300" />
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl w-fit">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{card.title}</h3>
                <p className={`text-sm leading-relaxed flex-grow ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. THE PROBLEM */}
      <section id="problem" className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Problem Left: Context */}
            <div className="lg:col-span-6 space-y-6">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${
                theme === 'dark' ? 'border-rose-500/20 bg-rose-500/5 text-rose-400' : 'border-rose-200 bg-rose-50 text-rose-600'
              }`}>
                <Flame className="w-3.5 h-3.5 animate-pulse" />
                Critical Ecological Challenge
              </div>
              <h2 className={`text-3xl sm:text-4xl font-extrabold leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Why Wildfire Mapping Matters
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Climate change has dramatically increased the frequency and severity of wildfire disasters globally. 
                Traditional manual GIS annotation of burn scars is tedious and extremely slow, delaying emergency response, 
                damage assessment, and recovery planning. 
              </p>
              <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Emergency teams need near real-time, highly accurate mapping of burn-scar delineations to estimate carbon release, 
                assess ecological damage, validate insurance claims, and prevent mudslides/floods.
              </p>

              {/* Statistics lists */}
              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { label: "Rapid Emergency Response", desc: "Saves critical hours during disaster evaluation." },
                  { label: "Ecological Monitoring", desc: "Tracks forest regeneration and carbon emissions." },
                  { label: "Insurance Validation", desc: "Automates burn boundaries verification." },
                  { label: "Disaster Assessment", desc: "Evaluates exact area destruction accurately." }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className={`font-bold flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                      <ChevronRight className="w-4 h-4 text-rose-500" />
                      {item.label}
                    </div>
                    <p className={`text-xs pl-5 leading-normal ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem Right: Visual Before/After mockup */}
            <div className="lg:col-span-6">
              <div className={`aspect-video w-full rounded-2xl border p-2.5 backdrop-blur-md relative overflow-hidden shadow-2xl group ${
                theme === 'dark' ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white/40'
              }`}>
                <div className={`w-full h-full rounded-xl border overflow-hidden flex relative ${
                  theme === 'dark' ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'
                }`}>
                  {/* Left Side: Before Imagery */}
                  <div className="w-1/2 h-full relative overflow-hidden">
                    <img src="/before.png" alt="Pre-Disaster Imagery" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/20" />
                    <div className="absolute bottom-4 left-4 z-10 px-2 py-1 rounded bg-slate-950/80 border border-slate-800/80 text-[9px] font-bold tracking-widest uppercase text-rose-400 shadow-md">
                      During Disaster
                    </div>
                  </div>

                  {/* Right Side: After (Segmentation Mask) Imagery */}
                  <div className="w-1/2 h-full relative overflow-hidden">
                    <img src="/after.png" alt="AI Burn Scar Delineation" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/20" />
                    <div className="absolute bottom-4 right-4 z-10 px-2 py-1 rounded bg-slate-950/80 border border-slate-800/80 text-[9px] font-bold tracking-widest uppercase text-emerald-400 shadow-md">
                      AI Segmentation
                    </div>
                  </div>

                  {/* Split slider thumb mockup */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-slate-700 bg-slate-950 shadow-xl flex items-center justify-center text-slate-400 z-20 pointer-events-none">
                    <Map className="w-4 h-4 text-rose-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. OUR SOLUTION */}
      <section id="pipeline" className={`py-20 sm:py-28 relative border-t ${
        theme === 'dark' ? 'border-slate-900 bg-slate-950/40' : 'border-slate-200 bg-slate-100/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Our AI Pipeline</h2>
            <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              We developed an end-to-end multi-spectral pipeline from satellite orbit telemetry down to real-time edge processing and interactive browser visualizations.
            </p>
          </div>

          {/* Flowchart/Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 pt-16 relative">
            {[
              { title: "Satellite Imagery", desc: "Sentinel-2 spectral bands acquisition" },
              { title: "Preprocessing", desc: "Percentile robust scaling & normalization" },
              { title: "Deep Segmentation", desc: "CNN and Transformer inferences" },
              { title: "Prediction Masks", desc: "Sigmoids thresholding to binary PNGs" },
              { title: "IoU Evaluation", desc: "Exact metric scoring against ground truth" },
              { title: "Web Platform", desc: "Static mapping and overlay showcase" },
              { title: "Edge Deployment", desc: "NVIDIA Jetson optimization & TensorRT" }
            ].map((step, i) => (
              <div 
                key={i} 
                className={`p-5 rounded-2xl border backdrop-blur-sm relative group flex flex-col justify-between min-h-[160px] ${
                  theme === 'dark' ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white/70 shadow-sm'
                }`}
              >
                <div className="absolute top-4 right-4 text-5xl font-black text-slate-800/20 group-hover:text-rose-500/10 transition duration-300 font-mono">
                  {i + 1}
                </div>
                <h3 className={`text-sm font-bold tracking-wide uppercase pr-8 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
                <p className={`text-xs leading-relaxed mt-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. MODEL ARCHITECTURES */}
      <section id="models" className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Compared Architectures</h2>
            <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              We evaluated three distinct classes of deep learning segmentation models, analyzing their relative tradeoffs between performance, scale, and resource usage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-16">
            
            {/* U-Net */}
            <div className={`p-6 rounded-2xl border space-y-6 flex flex-col justify-between group hover:border-slate-700/80 transition duration-300 ${
              theme === 'dark' ? 'border-slate-800 bg-slate-900/10' : 'border-slate-200 bg-white shadow-sm'
            }`}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl">
                    <Grid className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest px-2 py-1 rounded border uppercase ${
                    theme === 'dark' ? 'text-slate-400 bg-slate-900 border-slate-800' : 'text-slate-600 bg-slate-50 border-slate-200'
                  }`}>Lightweight CNN</span>
                </div>
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1. U-Net</h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Classic convolution encoder-decoder architecture with skip connections. Exceptionally strong on smaller segmentation datasets, extremely lightweight, and fast to train.
                </p>
                <ul className={`text-xs space-y-2 pt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> 17.2M Parameters</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Double conv building blocks</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Ideal for memory-constrained edge hardware</li>
                </ul>
              </div>
              <div className={`pt-4 border-t text-xs font-semibold tracking-wide uppercase ${
                theme === 'dark' ? 'border-slate-800 text-rose-400' : 'border-slate-100 text-rose-600'
              }`}>Excellent edge candidate</div>
            </div>

            {/* DeepLabV3+ */}
            <div className={`p-6 rounded-2xl border space-y-6 flex flex-col justify-between group hover:border-slate-700/80 transition duration-300 ${
              theme === 'dark' ? 'border-slate-800 bg-slate-900/10' : 'border-slate-200 bg-white shadow-sm'
            }`}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded-xl">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest px-2 py-1 rounded border uppercase ${
                    theme === 'dark' ? 'text-slate-400 bg-slate-900 border-slate-800' : 'text-slate-600 bg-slate-50 border-slate-200'
                  }`}>Heavy CNN</span>
                </div>
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>2. DeepLabV3+</h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Atrous Spatial Pyramid Pooling (ASPP) structure leveraging ResNet backbones. Captures strong contextual scene understanding, yielding top results on large, complex segmentation sets.
                </p>
                <ul className={`text-xs space-y-2 pt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> 54.4M Parameters (ResNet-50)</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Dilated convolutions at multiple scales</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Superb boundary definition</li>
                </ul>
              </div>
              <div className={`pt-4 border-t text-xs font-semibold tracking-wide uppercase ${
                theme === 'dark' ? 'border-slate-800 text-purple-400' : 'border-slate-100 text-purple-600'
              }`}>Best Context Understanding</div>
            </div>

            {/* SegFormer-B0 */}
            <div className={`p-6 rounded-2xl border space-y-6 flex flex-col justify-between group hover:border-slate-700/80 transition duration-300 ${
              theme === 'dark' ? 'border-slate-800 bg-slate-900/10' : 'border-slate-200 bg-white shadow-sm'
            }`}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-xl">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest px-2 py-1 rounded border uppercase ${
                    theme === 'dark' ? 'text-slate-400 bg-slate-900 border-slate-800' : 'text-slate-600 bg-slate-50 border-slate-200'
                  }`}>Transformer</span>
                </div>
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>3. SegFormer-B0</h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Hierarchical Transformer encoder paired with lightweight MLP decoders. Captures global multi-scale attention maps while avoiding heavy positional encoding.
                </p>
                <ul className={`text-xs space-y-2 pt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> 3.7M Parameters (Highly Efficient)</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Global Attention maps</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Superb Multispectral adaptation</li>
                </ul>
              </div>
              <div className={`pt-4 border-t text-xs font-semibold tracking-wide uppercase ${
                theme === 'dark' ? 'border-slate-800 text-indigo-400' : 'border-slate-100 text-indigo-600'
              }`}>State of the art efficiency</div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. DATASETS */}
      <section id="datasets" className={`py-20 sm:py-28 relative border-t ${
        theme === 'dark' ? 'border-slate-900 bg-slate-950/40' : 'border-slate-200 bg-slate-100/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Datasets Left: Info */}
            <div className="lg:col-span-6 space-y-6">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${
                theme === 'dark' ? 'border-rose-500/20 bg-rose-500/5 text-rose-400' : 'border-rose-200 bg-rose-50 text-rose-600'
              }`}>
                <Database className="w-3.5 h-3.5" />
                Evaluated Datasets
              </div>
              <h2 className={`text-3xl sm:text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Multispectral Data Scale</h2>
              <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                The models were cross-evaluated across three major public datasets containing satellite imagery of globally destructive wildfires:
              </p>

              <div className="space-y-4 pt-2">
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'border-slate-800/80 bg-slate-900/20' : 'border-slate-200 bg-white shadow-sm'
                }`}>
                  <h3 className={`text-base font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    CEMS Wildfires Dataset
                  </h3>
                  <p className={`text-xs mt-2 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    European Copernicus Emergency Management Service wildfire activations. Features Sentinel-2 L2A high-resolution spectral bands, paired with exact hand-annotated delineation shapes. Contains **281 train samples** and **99 test regions** across the Mediterranean.
                  </p>
                </div>
                
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'border-slate-800/80 bg-slate-900/20' : 'border-slate-200 bg-white shadow-sm'
                }`}>
                  <h3 className={`text-base font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    IBM-NASA HLS Burn Scars
                  </h3>
                  <p className={`text-xs mt-2 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Harmonized Landsat Sentinel-2 (HLS) dataset containing wildfire events throughout North America. Standardized for deep learning burn-scar evaluation, featuring **459 train samples** and massive complex forest boundaries.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'border-slate-800/80 bg-slate-900/20' : 'border-slate-200 bg-white shadow-sm'
                }`}>
                  <h3 className={`text-base font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Satellite Burned Area Dataset
                  </h3>
                  <p className={`text-xs mt-2 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    A multimodal dataset by Politecnico di Torino containing **73 satellite acquisitions (14.0 GB)** from Sentinel-2 (Optical) and Sentinel-1 (Synthetic Aperture Radar / SAR). Curated for multimodal DL models for burned area delineation and severity estimation.
                  </p>
                </div>
              </div>
            </div>

            {/* Datasets Right: Geographic Visualization placeholder */}
            <div className="lg:col-span-6">
              <div className={`relative border rounded-2xl p-4 overflow-hidden aspect-video shadow-2xl flex flex-col justify-center items-center ${
                theme === 'dark' ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'
              }`}>

                {/* World map outline mockup with glowing dots */}
                <div className={`w-full h-full rounded-xl border flex items-center justify-center relative overflow-hidden ${
                  theme === 'dark' ? 'border-slate-800/80 bg-slate-950' : 'border-slate-200 bg-slate-50'
                }`}>
                  
                  {/* Earth map image background */}
                  <img 
                    src="/earth.png" 
                    alt="World Map Background" 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />

                  {/* Glowing activation pins simulation placed exactly on the map coordinate splits */}
                  {/* Pin 1: North America */}
                  <span className="absolute top-[32%] left-[24%] w-3.5 h-3.5 rounded-full bg-rose-500/20 border border-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.6)] flex items-center justify-center z-20">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  </span>

                  {/* Pin 2: Mediterranean (Middle East/Turkey) */}
                  <span className="absolute top-[38%] left-[54%] w-3.5 h-3.5 rounded-full bg-rose-500/20 border border-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.6)] flex items-center justify-center z-20">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  </span>

                  {/* Pin 3: East Asia / Japan */}
                  <span className="absolute top-[35%] left-[72%] w-3.5 h-3.5 rounded-full bg-rose-500/20 border border-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.6)] flex items-center justify-center z-20">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Dataset Comparison Table */}
          <div className="pt-16 overflow-x-auto">
            <table className={`w-full text-left border-collapse border rounded-xl ${
              theme === 'dark' ? 'border-slate-800 bg-slate-900/10' : 'border-slate-200 bg-white shadow-sm'
            }`}>
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50'}`}>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Dataset</th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Telemetry Origin</th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Bands</th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Train Split</th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Test Regions</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm ${
                theme === 'dark' ? 'divide-slate-800/80 text-slate-400' : 'divide-slate-200 text-slate-600'
              }`}>
                <tr className={`transition-colors ${theme === 'dark' ? 'hover:bg-slate-900/20' : 'hover:bg-slate-50'}`}>
                  <td className={`p-4 font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Copernicus CEMS</td>
                  <td className={`p-4 font-mono text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Sentinel-2 L2A</td>
                  <td className="p-4">12 Spectral Bands</td>
                  <td className="p-4 font-mono text-xs">281 Tiles</td>
                  <td className="p-4 font-mono text-xs">99 AOIs</td>
                </tr>
                <tr className={`transition-colors ${theme === 'dark' ? 'hover:bg-slate-900/20' : 'hover:bg-slate-50'}`}>
                  <td className={`p-4 font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>IBM-NASA HLS</td>
                  <td className={`p-4 font-mono text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Harmonized Landsat Sentinel</td>
                  <td className="p-4">Multi-Spectral</td>
                  <td className="p-4 font-mono text-xs">459 Tiles</td>
                  <td className="p-4 font-mono text-xs">Custom Split</td>
                </tr>
                <tr className={`transition-colors ${theme === 'dark' ? 'hover:bg-slate-900/20' : 'hover:bg-slate-50'}`}>
                  <td className={`p-4 font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Satellite Burned Area</td>
                  <td className={`p-4 font-mono text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Sentinel-2 & Sentinel-1 SAR</td>
                  <td className="p-4">Multimodal / Backscatter</td>
                  <td className="p-4 font-mono text-xs">73 Acquisitions (14.0 GB)</td>
                  <td className="p-4 font-mono text-xs">Delineation & Severity Folds</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* 8. RESULTS & BENCHMARKS */}
      <section id="benchmarks" className="py-20 sm:py-28 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Results & Benchmarking</h2>
            <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Our benchmarks demonstrate that the optimal architecture depends heavily on dataset size, domain characteristics, and resource bounds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-16">
            
            {/* CEMS Results */}
            <div className={`p-6 rounded-2xl border backdrop-blur-sm space-y-6 ${
              theme === 'dark' ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white shadow-sm'
            }`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                <span className="p-1.5 bg-rose-500/10 rounded-lg text-rose-500"><TrendingUp className="w-4 h-4" /></span>
                CEMS Wildfire Metrics (Mediterranean)
              </h3>
              
              {/* Animated bar charts */}
              <div className="space-y-4">
                {[
                  { name: "U-Net", score: 0.8280, color: "bg-rose-500" },
                  { name: "SegFormer-B0", score: 0.7985, color: "bg-indigo-500" },
                  { name: "DeepLabV3+", score: 0.7908, color: "bg-purple-500" }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{item.name}</span>
                      <span className={`font-mono ${theme === 'dark' ? 'text-slate-300' : 'text-slate-900'}`}>{item.score.toFixed(4)} IoU</span>
                    </div>
                    <div className={`w-full h-3 rounded-full overflow-hidden border ${
                      theme === 'dark' ? 'bg-slate-900 border-slate-800/80' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.score * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HLS Results */}
            <div className={`p-6 rounded-2xl border backdrop-blur-sm space-y-6 ${
              theme === 'dark' ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white shadow-sm'
            }`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                <span className="p-1.5 bg-rose-500/10 rounded-lg text-rose-500"><TrendingUp className="w-4 h-4" /></span>
                IBM-NASA HLS Burn Scar Metrics
              </h3>
              
              {/* Animated bar charts */}
              <div className="space-y-4">
                {[
                  { name: "DeepLabV3+", score: 0.8298, color: "bg-purple-500" },
                  { name: "SegFormer-B0", score: 0.8106, color: "bg-indigo-500" },
                  { name: "U-Net", score: 0.8014, color: "bg-rose-500" }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{item.name}</span>
                      <span className={`font-mono ${theme === 'dark' ? 'text-slate-300' : 'text-slate-900'}`}>{item.score.toFixed(4)} IoU</span>
                    </div>
                    <div className={`w-full h-3 rounded-full overflow-hidden border ${
                      theme === 'dark' ? 'bg-slate-900 border-slate-800/80' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.score * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className={`mt-8 p-4 rounded-xl border text-center text-xs ${
            theme === 'dark' ? 'border-slate-800/80 bg-slate-900/10 text-slate-400' : 'border-slate-200 bg-white text-slate-500 shadow-sm'
          }`}>
            * U-Net performs exceptionally well on the limited local CEMS dataset due to precise pixel boundaries mapping, whereas DeepLabV3+ leads on the larger, globally diverse HLS dataset.
          </div>

        </div>
      </section>

      {/* 9. EDGE AI / JETSON SECTION */}
      <section id="edge-ai" className={`py-20 sm:py-28 relative border-t ${
        theme === 'dark' ? 'border-slate-900 bg-slate-950/40' : 'border-slate-200 bg-slate-100/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Edge AI Left: Info */}
            <div className="lg:col-span-6 space-y-6">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${
                theme === 'dark' ? 'border-rose-500/20 bg-rose-500/5 text-rose-400' : 'border-rose-200 bg-rose-50 text-rose-600'
              }`}>
                <Cpu className="w-3.5 h-3.5" />
                Edge AI Hardware Integration
              </div>
              <h2 className={`text-3xl sm:text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>NVIDIA Jetson Edge Deployment</h2>
              <p className={`text-slate-400 text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                For real-time drone and edge-satellite mapping, we compiled and optimized the semantic segmentation networks using **TensorRT** and structured pruning.
              </p>

              {/* Benching Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white shadow-sm'
                }`}>
                  <div className="text-2xl font-black text-rose-500">137 ms</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">End-to-End Latency</div>
                </div>
                
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white shadow-sm'
                }`}>
                  <div className="text-2xl font-black text-rose-500">&lt; 6W</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">Average Power Mode</div>
                </div>

                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white shadow-sm'
                }`}>
                  <div className="text-2xl font-black text-rose-500">FP16</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">TensorRT Compiled</div>
                </div>
              </div>

              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                By leveraging half-precision (FP16) mathematics, we achieved near-zero accuracy drops while accelerating inference by **over 3.2x** compared to standard PyTorch CPU executions.
              </p>
            </div>

            {/* Edge AI Right: Jetson benchmark custom interactive chart */}
            <div className="lg:col-span-6">
              <div className={`w-full rounded-2xl border p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md transition-all duration-300 ${
                theme === 'dark' ? 'border-slate-800 bg-slate-950 text-slate-100' : 'border-slate-200 bg-white text-slate-900 shadow-sm'
              }`}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h3 className={`text-base font-extrabold tracking-wide ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      GPU latency / tile (ms)
                    </h3>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <span>↓</span>
                      <span className="italic">lower is better</span>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-sky-500 inline-block" />
                      <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>PyTorch Baseline</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                      <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>TensorRT FP16</span>
                    </div>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="flex items-stretch h-[240px] pt-4 relative">
                  
                  {/* Y-Axis title rotated */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 -translate-x-6 origin-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Latency (ms)
                  </div>

                  {/* Y-Axis Scale */}
                  <div className="flex flex-col justify-between items-end pr-3 border-r border-slate-500/10 text-[10px] font-mono font-semibold text-slate-400 w-15 h-[190px]">
                    <span>200</span>
                    <span>160</span>
                    <span>120</span>
                    <span>80</span>
                    <span>40</span>
                    <span>0</span>
                  </div>

                  {/* Grid & Bars Container */}
                  <div className="flex-grow h-[190px] relative px-4 sm:px-8">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {[0, 1, 2, 3, 4, 5].map((idx) => (
                        <div 
                          key={idx} 
                          className={`w-full border-t border-dashed ${
                            theme === 'dark' ? 'border-slate-800/70' : 'border-slate-200/80'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Columns Container */}
                    <div className="absolute inset-0 flex justify-around items-end z-10 px-2 sm:px-4">
                      
                      {/* 1. U-Net Column */}
                      <div className="flex flex-col items-center w-1/3 h-full justify-end">
                        <div className="flex items-end justify-center gap-1 sm:gap-2 h-full pb-0.5 w-full">
                          
                          {/* PyTorch Bar (70ms) */}
                          <div className="flex flex-col items-center justify-end h-full w-6 sm:w-10 group relative">
                            <span className={`text-[9px] font-mono font-bold mb-1 transition-opacity ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>70</span>
                            <motion.div
                              initial={{ height: '0%' }}
                              animate={{ height: '35%' }} // 70 / 200 = 35%
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="w-full rounded-t bg-gradient-to-t from-sky-600 to-sky-400 hover:from-sky-500 hover:to-sky-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all cursor-pointer"
                            />
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-6 hidden group-hover:flex flex-col items-center z-30 transition-all duration-200">
                              <div className="bg-slate-950 text-white border border-slate-800 text-[10px] py-1.5 px-2 rounded shadow-2xl font-mono whitespace-nowrap">
                                PyTorch: <span className="font-bold text-sky-400">70 ms</span>
                              </div>
                              <div className="w-1.5 h-1.5 bg-slate-950 border-r border-b border-slate-800 rotate-45 -mt-1" />
                            </div>
                          </div>

                          {/* TensorRT Bar (25ms) */}
                          <div className="flex flex-col items-center justify-end h-full w-6 sm:w-10 group relative">
                            <span className={`text-[9px] font-mono font-bold mb-1 transition-opacity ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>25</span>
                            <motion.div
                              initial={{ height: '0%' }}
                              animate={{ height: '12.5%' }} // 25 / 200 = 12.5%
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                              className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all cursor-pointer"
                            />
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-6 hidden group-hover:flex flex-col items-center z-30 transition-all duration-200">
                              <div className="bg-slate-950 text-white border border-slate-800 text-[10px] py-1.5 px-2.5 rounded shadow-2xl font-mono whitespace-nowrap text-center">
                                <div className="font-bold text-emerald-400">TensorRT: 25 ms</div>
                                <div className="text-[9px] text-slate-400 font-sans mt-0.5">🚀 2.8x speedup</div>
                              </div>
                              <div className="w-1.5 h-1.5 bg-slate-950 border-r border-b border-slate-800 rotate-45 -mt-1" />
                            </div>
                          </div>
                        </div>
                        <span className={`text-[11px] sm:text-xs font-bold mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          U-Net
                        </span>
                      </div>

                      {/* 2. DeepLabV3+ Column */}
                      <div className="flex flex-col items-center w-1/3 h-full justify-end">
                        <div className="flex items-end justify-center gap-1 sm:gap-2 h-full pb-0.5 w-full">
                          
                          {/* PyTorch Bar (180ms) */}
                          <div className="flex flex-col items-center justify-end h-full w-6 sm:w-10 group relative">
                            <span className={`text-[9px] font-mono font-bold mb-1 transition-opacity ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>180</span>
                            <motion.div
                              initial={{ height: '0%' }}
                              animate={{ height: '90%' }} // 180 / 200 = 90%
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="w-full rounded-t bg-gradient-to-t from-sky-600 to-sky-400 hover:from-sky-500 hover:to-sky-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all cursor-pointer"
                            />
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-6 hidden group-hover:flex flex-col items-center z-30 transition-all duration-200">
                              <div className="bg-slate-950 text-white border border-slate-800 text-[10px] py-1.5 px-2 rounded shadow-2xl font-mono whitespace-nowrap">
                                PyTorch: <span className="font-bold text-sky-400">180 ms</span>
                              </div>
                              <div className="w-1.5 h-1.5 bg-slate-950 border-r border-b border-slate-800 rotate-45 -mt-1" />
                            </div>
                          </div>

                          {/* TensorRT Bar (60ms) */}
                          <div className="flex flex-col items-center justify-end h-full w-6 sm:w-10 group relative">
                            <span className={`text-[9px] font-mono font-bold mb-1 transition-opacity ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>60</span>
                            <motion.div
                              initial={{ height: '0%' }}
                              animate={{ height: '30%' }} // 60 / 200 = 30%
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                              className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all cursor-pointer"
                            />
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-6 hidden group-hover:flex flex-col items-center z-30 transition-all duration-200">
                              <div className="bg-slate-950 text-white border border-slate-800 text-[10px] py-1.5 px-2.5 rounded shadow-2xl font-mono whitespace-nowrap text-center">
                                <div className="font-bold text-emerald-400">TensorRT: 60 ms</div>
                                <div className="text-[9px] text-slate-400 font-sans mt-0.5">🚀 3.0x speedup</div>
                              </div>
                              <div className="w-1.5 h-1.5 bg-slate-950 border-r border-b border-slate-800 rotate-45 -mt-1" />
                            </div>
                          </div>
                        </div>
                        <span className={`text-[11px] sm:text-xs font-bold mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          DeepLabV3+
                        </span>
                      </div>

                      {/* 3. SegFormer Column */}
                      <div className="flex flex-col items-center w-1/3 h-full justify-end">
                        <div className="flex items-end justify-center gap-1 sm:gap-2 h-full pb-0.5 w-full">
                          
                          {/* PyTorch Bar (80ms) */}
                          <div className="flex flex-col items-center justify-end h-full w-6 sm:w-10 group relative">
                            <span className={`text-[9px] font-mono font-bold mb-1 transition-opacity ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>80</span>
                            <motion.div
                              initial={{ height: '0%' }}
                              animate={{ height: '40%' }} // 80 / 200 = 40%
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="w-full rounded-t bg-gradient-to-t from-sky-600 to-sky-400 hover:from-sky-500 hover:to-sky-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all cursor-pointer"
                            />
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-6 hidden group-hover:flex flex-col items-center z-30 transition-all duration-200">
                              <div className="bg-slate-950 text-white border border-slate-800 text-[10px] py-1.5 px-2 rounded shadow-2xl font-mono whitespace-nowrap">
                                PyTorch: <span className="font-bold text-sky-400">80 ms</span>
                              </div>
                              <div className="w-1.5 h-1.5 bg-slate-950 border-r border-b border-slate-800 rotate-45 -mt-1" />
                            </div>
                          </div>

                          {/* TensorRT Bar (25ms) */}
                          <div className="flex flex-col items-center justify-end h-full w-6 sm:w-10 group relative">
                            <span className={`text-[9px] font-mono font-bold mb-1 transition-opacity ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>25</span>
                            <motion.div
                              initial={{ height: '0%' }}
                              animate={{ height: '12.5%' }} // 25 / 200 = 12.5%
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                              className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all cursor-pointer"
                            />
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-6 hidden group-hover:flex flex-col items-center z-30 transition-all duration-200">
                              <div className="bg-slate-950 text-white border border-slate-800 text-[10px] py-1.5 px-2.5 rounded shadow-2xl font-mono whitespace-nowrap text-center">
                                <div className="font-bold text-emerald-400">TensorRT: 25 ms</div>
                                <div className="text-[9px] text-slate-400 font-sans mt-0.5">🚀 3.2x speedup</div>
                              </div>
                              <div className="w-1.5 h-1.5 bg-slate-950 border-r border-b border-slate-800 rotate-45 -mt-1" />
                            </div>
                          </div>
                        </div>
                        <span className={`text-[11px] sm:text-xs font-bold mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          SegFormer
                        </span>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className={`mt-5 pt-4 border-t text-[11px] flex items-center justify-between font-mono ${
                  theme === 'dark' ? 'border-slate-800/80 text-slate-500' : 'border-slate-200 text-slate-500'
                }`}>
                  <div>Hardware: NVIDIA Jetson Orin Nano (8GB)</div>
                  <div className="text-rose-500 font-bold">Max Power Mode: 15W</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. WEB PLATFORM SHOWCASE */}
      <section id="platform" className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Platform Left: Visual Platform Mockup */}
            <div className="lg:col-span-6 order-last lg:order-first">
              <div className={`aspect-video w-full rounded-2xl border p-2.5 backdrop-blur-md relative overflow-hidden shadow-2xl group ${
                theme === 'dark' ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white/40'
              }`}>
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[9px] font-bold tracking-widest uppercase text-rose-400 shadow-md">
                  SatRisk-Net Interactive Map Interface
                </div>

                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <img 
                    src="/dashboard.png" 
                    alt="SatRisk-Net Interactive Map Platform Dashboard Screenshot" 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Platform Right: Details */}
            <div className="lg:col-span-6 space-y-6">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${
                theme === 'dark' ? 'border-rose-500/20 bg-rose-500/5 text-rose-400' : 'border-rose-200 bg-rose-50 text-rose-600'
              }`}>
                <Map className="w-3.5 h-3.5" />
                Interactive Visualizer
              </div>
              <h2 className={`text-3xl sm:text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Disaster Monitoring Platform</h2>
              <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                The visual results of this research are fully browsable through our dynamic, high-performance web platform.
              </p>

              <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {[
                  "Browse wildfire regions globally",
                  "Compare semantic architectures side-by-side",
                  "Inspect prediction masks dynamically",
                  "Visualize exact ground truth overlaps",
                  "Analyze per-region computed IoU metrics"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6">
                <button
                  onClick={onLaunch}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Launch Interactive Demo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 11. RESEARCH CONTRIBUTIONS */}
      <section id="contributions" className={`py-20 sm:py-28 relative border-t ${
        theme === 'dark' ? 'border-slate-900 bg-slate-950/40' : 'border-slate-200 bg-slate-100/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Research Contributions</h2>
            <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Our graduation project delivers significant, real-world technical and academic research contributions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-16">
            {[
              {
                num: "01",
                title: "SegFormer Recovery Pipeline",
                desc: "Developed custom multispectral adjustments that successfully raised SegFormer-B0's baseline IoU from a poor 0.1146 to a highly robust 0.80+ score."
              },
              {
                num: "02",
                title: "Dataset-Architecture Dependency",
                desc: "Published complete comparative analyses proving that CNNs (like U-Net) are superior on smaller regional datasets, whereas Transformers dominate on larger datasets."
              },
              {
                num: "03",
                title: "CNN vs Transformer Evaluation",
                desc: "Formulated robust multi-spectral evaluation methodologies highlighting structural tradeoffs in handling deep infrared telemetry."
              },
              {
                num: "04",
                title: "Jetson Orin Edge Benchmarking",
                desc: "Published precise, physical benchmarking tables for TensorRT FP16 executions on low-power NVIDIA Jetson edge systems."
              },
              {
                num: "05",
                title: "Public Delineation Platform",
                desc: "Created a highly optimized, fully static open-source visualization platform making disaster risk assessments instantly accessible to anyone, anywhere."
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-2xl border relative group transition duration-300 flex flex-col justify-between min-h-[220px] ${
                  theme === 'dark'
                    ? 'border-slate-800 bg-slate-900/10'
                    : 'border-slate-200 bg-white shadow-sm hover:shadow-md'
                }`}
              >
                <div className={`text-4xl font-black font-mono transition duration-300 ${
                  theme === 'dark'
                    ? 'text-rose-500/20 group-hover:text-rose-500/40'
                    : 'text-rose-500/15 group-hover:text-rose-500/30'
                }`}>
                  {item.num}
                </div>
                <div className="space-y-2 mt-4">
                  <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                  <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 12. TEAM SECTION */}
      <section id="team" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Project Research Team</h2>
            <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Developed under the academic guidance of Hacettepe University Computer Engineering Department.
            </p>
          </div>

          {/* Supervisor */}
          <div className="flex justify-center pt-16">
            <div className={`p-6 rounded-2xl border text-center max-w-md w-full relative overflow-hidden group ${
              theme === 'dark' ? 'border-rose-500/20 bg-rose-500/5' : 'border-rose-200 bg-rose-50/50 shadow-sm'
            }`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition duration-300" />
              <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-rose-500/30 mx-auto flex items-center justify-center text-slate-400">
                <Award className="w-10 h-10 text-rose-500" />
              </div>
              <h3 className={`text-lg font-bold mt-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Asst. Prof. Dr. Selma Dilek</h3>
              <p className="text-xs text-rose-500 mt-1 uppercase font-semibold tracking-wider">Project Supervisor</p>
              <p className={`text-xs mt-3 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Academic supervision and critical research advice.
              </p>
            </div>
          </div>

          {/* Members */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-16">
            {[
              { name: "Emre Erdoğan", roles: [ "Jetson Deployment", "Model Training", "Evaluation"] },
              { name: "Emre Yeğin", roles: ["Model Training", "Evaluation", "            "] },
              { name: "Özgün Serergün Koca", roles: ["Optimization", "Model Training", "Evaluation"] },
              { name: "Mustafa Ege", roles: ["Full-Stack Platform Development", "Model Training", "Evaluation"] },
              { name: "Kağan Canerik", roles: ["Model Training", "Evaluation", "Optimization"] }
            ].map((member, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-2xl border text-center space-y-3 transition duration-200 flex flex-col justify-between ${
                  theme === 'dark'
                    ? 'border-slate-800/80 bg-slate-900/10 hover:bg-slate-900/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50 shadow-sm'
                }`}
              >
                <div className="space-y-3 flex-grow flex flex-col justify-start">
                  <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400 text-sm font-bold border border-slate-700 mb-1">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h4 className={`text-sm font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{member.name}</h4>
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-3 space-y-1 leading-normal border-t border-slate-500/10 pt-2 h-20 flex flex-col justify-start">
                  {member.roles.map((role, ri) => (
                    <div key={ri}>{role}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 13. FUTURE WORK */}
      <section id="future" className={`py-20 sm:py-28 relative border-t ${
        theme === 'dark' ? 'border-slate-900 bg-slate-950/40' : 'border-slate-200 bg-slate-100/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Future Directions</h2>
            <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              We aim to expand SatRisk-Net into a multi-hazard, real-time remote sensing disaster response pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-16">
            {[
              {
                title: "Flood Segmentation",
                desc: "Adapting deep architectures to segment active flooding events and calculate regional water boundaries."
              },
              {
                title: "Landslide Detection",
                desc: "Harnessing temporal change-detection metrics to locate landslide and erosion risks in mountainous regions."
              },
              {
                title: "SAR Telemetry Integration",
                desc: "Integrating Synthetic Aperture Radar (SAR) signals to capture telemetry through thick smoke and clouds."
              },
              {
                title: "Real-Time Disaster Feeds",
                desc: "Connecting pipelines directly to active Sentinel-2 ingestion ports to provide near real-time automated mapping feeds."
              }
            ].map((card, i) => (
              <div key={i} className={`p-6 rounded-2xl border space-y-4 ${
                theme === 'dark' ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white shadow-sm'
              }`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{card.title}</h3>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 14. FINAL CTA & FOOTER */}
      <footer className={`relative py-16 sm:py-24 border-t text-center overflow-hidden ${
        theme === 'dark' ? 'border-slate-900 bg-slate-950' : 'border-slate-200 bg-white'
      }`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[20rem] bg-rose-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center space-y-8">
          <h2 className={`text-3xl sm:text-5xl font-extrabold max-w-3xl leading-tight text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Advancing AI-Powered Disaster Response
          </h2>
          <p className={`text-base sm:text-lg max-w-xl leading-relaxed text-center ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Harnessing satellite imagery, semantic segmentation architectures, and edge computing to save critical response hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <button
              onClick={onLaunch}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-base shadow-[0_0_35px_rgba(244,63,94,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Open Platform
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="https://github.com/mustafa-ege/satrisk-net"
              target="_blank"
              rel="noreferrer"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border transition-colors font-semibold text-base ${
                theme === 'dark'
                  ? 'border-slate-800 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-sm'
              }`}
            >
              <Code className="w-5 h-5 text-rose-500" />
              View Project Repository
            </a>
          </div>

          <div className={`w-full pt-16 border-t text-xs space-y-2 ${theme === 'dark' ? 'border-slate-900 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
            <div className={`font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Hacettepe University • Computer Engineering Department</div>
            <div>BBM479/480 Graduation Project • 2026</div>
          </div>
        </div>
      </footer>

    </div>
  )
}
