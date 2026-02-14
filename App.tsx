
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Database, 
  Cpu, 
  Layout, 
  ShieldCheck, 
  BarChart3, 
  MessageSquare,
  ChevronRight,
  Menu,
  X,
  Zap,
  HardDrive,
  Factory,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Settings,
  Clock,
  CheckCircle2,
  BrainCircuit,
  Waves,
  RefreshCw,
  Search,
  Camera,
  Code,
  Layers,
  Terminal,
  Server,
  Globe,
  FileText,
  Shield,
  Headphones,
  Building2,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  ZAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart
} from 'recharts';
import { SensorData, VisionMetric, InsightMessage, AppView, DashboardModule, ContactFormData } from './types';
import { getIndustrialInsight } from './services/geminiService';

// --- Global Constants ---
const SECONDARY_EMAIL = "ranjit@industrialdesign.info";
const PRIMARY_EMAIL = "sales@idcon.in";

// --- Sub-Components ---

const CodeBlock = ({ code, language }: { code: string, language: string }) => (
  <div className="bg-[#001a1a] p-4 md:p-6 rounded-2xl font-mono text-[10px] md:text-[11px] text-teal-400 overflow-x-auto border border-teal-900/50 shadow-2xl">
    <div className="flex justify-between mb-4 border-b border-teal-900/40 pb-3">
      <span className="text-gray-300 uppercase font-black tracking-[0.2em] text-[10px]">{language}</span>
      <div className="flex space-x-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
      </div>
    </div>
    <pre className="leading-relaxed">{code}</pre>
  </div>
);

const Navbar = ({ currentView, setView }: { currentView: AppView, setView: (v: AppView) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setView('home')}>
              <div className="siemens-bg p-2 rounded-xl mr-3 shadow-lg shadow-[#009999]/20">
                <Factory className="text-white" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter siemens-text leading-none uppercase">IDCON</span>
                <span className="text-[7px] md:text-[8px] font-black text-gray-700 uppercase tracking-[0.05em] mt-0.5 leading-none">INDUSTRIAL DESIGNING CONSULTANTS</span>
              </div>
            </div>
            <div className="hidden lg:ml-10 lg:flex lg:space-x-6">
              {(['home', 'dashboards', 'engineering', 'contact'] as AppView[]).map((view) => (
                <button 
                  key={view} 
                  onClick={() => setView(view)}
                  className={`${currentView === view ? 'siemens-text font-black border-b-2 border-[#009999]' : 'text-gray-600 hover:text-gray-900 font-bold'} px-1 py-2 text-[10px] uppercase tracking-[0.15em] transition-all`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Global Inquiries</span>
              <a href={`mailto:${PRIMARY_EMAIL}`} className="text-xs font-black text-gray-900 hover:text-[#009999] transition-colors">{PRIMARY_EMAIL}</a>
            </div>
            <button onClick={() => setView('contact')} className="siemens-bg text-white px-5 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Consult Now
            </button>
          </div>
          <div className="flex items-center lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 p-2 focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-8 space-y-4 animate-in slide-in-from-top-4 duration-300">
          {(['home', 'dashboards', 'engineering', 'contact'] as AppView[]).map((view) => (
            <button 
              key={view} 
              onClick={() => { setView(view); setIsOpen(false); }}
              className={`block w-full text-left py-4 text-xs font-black uppercase tracking-[0.2em] ${currentView === view ? 'siemens-text' : 'text-gray-700'}`}
            >
              {view}
            </button>
          ))}
          <div className="pt-6 border-t border-gray-100 flex flex-col space-y-4">
            <a href={`mailto:${PRIMARY_EMAIL}`} className="flex items-center space-x-3 text-sm font-bold text-gray-900">
               <Mail size={16} className="siemens-text" />
               <span>{PRIMARY_EMAIL}</span>
            </a>
            <a href={`mailto:${SECONDARY_EMAIL}`} className="flex items-center space-x-3 text-sm font-bold text-gray-700">
               <Mail size={16} className="text-gray-700" />
               <span>{SECONDARY_EMAIL}</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

const VisionInspectionSystem = () => {
  const [visionData, setVisionData] = useState<VisionMetric[]>([]);
  const [activeFrame, setActiveFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const isPass = Math.random() > 0.08;
      const newMetric: VisionMetric = {
        id: `PX-${Math.floor(Math.random() * 9000) + 1000}`,
        partName: 'Engine Block Casting',
        status: isPass ? 'Pass' : 'Fail',
        confidence: 0.96 + Math.random() * 0.035,
        defectType: isPass ? undefined : ['Porosity', 'Dimension Error', 'Surface Crack'][Math.floor(Math.random() * 3)],
        timestamp: new Date().toLocaleTimeString(),
        segmentationMaskId: `M-${Math.floor(Math.random()*100)}`
      };
      setVisionData(prev => [newMetric, ...prev].slice(0, 10));
      setActiveFrame(f => (f + 1) % 500);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="bg-[#0a0a0a] rounded-[2rem] overflow-hidden relative border border-white/5 shadow-2xl aspect-video group">
        <img 
          src={`https://picsum.photos/seed/${activeFrame}/1280/720?grayscale&industrial`} 
          className="w-full h-full object-cover opacity-50 filter contrast-125 saturate-0 scale-105 group-hover:scale-100 transition-transform duration-1000"
          alt="Vision Feed"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border-[1px] border-[#009999] rounded-sm">
             <div className="absolute -top-5 left-0 flex items-center space-x-2">
                <span className="text-[8px] bg-[#009999] text-white px-1.5 py-0.5 font-black uppercase">IDCON_SCAN_01</span>
             </div>
          </div>
          {visionData[0]?.status === 'Fail' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-red-500/50 bg-red-500/5 backdrop-blur-sm flex flex-col items-center justify-center">
              <AlertTriangle className="text-red-500 mb-2" size={32} />
              <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 font-black uppercase">Anomaly Detected</span>
            </div>
          )}
        </div>
        <div className="absolute top-6 left-6 flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          <span className="text-white text-[9px] font-black tracking-[0.3em] uppercase opacity-80">Vision_Cluster_v2</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full">
        <h4 className="text-xl font-black mb-8 flex items-center text-gray-900">
          <Camera className="mr-3 siemens-text" size={20} />
          Inference Telemetry
        </h4>
        <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {visionData.map((v, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${v.status === 'Pass' ? 'border-green-50 bg-green-50/20' : 'border-red-50 bg-red-50/20'} animate-in slide-in-from-right-2`}>
              <div>
                <span className="text-[9px] font-black text-gray-600 uppercase">{v.timestamp}</span>
                <p className="text-sm font-black text-gray-900">{v.partName}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${v.status === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {v.status}
                </span>
                <p className="text-[9px] font-bold text-gray-700 mt-1">Conf: {(v.confidence * 100).toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DataScienceDashboard = ({ data }: { data: SensorData[] }) => {
  const [activeModule, setActiveModule] = useState<DashboardModule>('operational');
  const latest = data[data.length - 1] || { oee: 0, throughput: 0, quality: 0, energy: 0, anomalyScore: 0, predictedRUL: 0, aiConfidence: 0, visionDefectRate: 0, modelDrift: 0 };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl w-fit mx-auto lg:mx-0">
        {[
          { id: 'operational', label: 'Operational Core', icon: Activity },
          { id: 'predictive', label: 'Predictive Prognostics', icon: RefreshCw },
          { id: 'vision-ai', label: 'Vision Analytics', icon: Camera },
          { id: 'data-science-health', label: 'ML Health (MLOps)', icon: BrainCircuit },
        ].map((mod) => (
          <button
            key={mod.id}
            onClick={() => setActiveModule(mod.id as DashboardModule)}
            className={`flex items-center space-x-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeModule === mod.id ? 'bg-white shadow-md text-[#009999]' : 'text-gray-700 hover:text-gray-900'}`}
          >
            <mod.icon size={16} />
            <span>{mod.label}</span>
          </button>
        ))}
      </div>

      {activeModule === 'data-science-health' && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                 <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-6">Model Drift</h5>
                 <div className="flex items-center justify-between">
                    <span className="text-4xl font-black text-gray-900">{(latest.modelDrift * 100).toFixed(2)}%</span>
                    <span className="text-[10px] font-black text-green-700 bg-green-50 px-3 py-1 rounded-full uppercase">NOMINAL</span>
                 </div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                 <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-6">Prediction Confidence</h5>
                 <div className="flex items-center justify-between">
                    <span className="text-4xl font-black text-gray-900">{(latest.aiConfidence * 100).toFixed(1)}%</span>
                    <span className="text-[10px] font-black text-[#009999] bg-[#009999]/5 px-3 py-1 rounded-full uppercase">HIGH</span>
                 </div>
              </div>
              <div className="bg-[#003333] p-8 rounded-[2rem] text-white">
                 <h5 className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-6">Inference Latency</h5>
                 <div className="flex items-center justify-between">
                    <span className="text-4xl font-black">24ms</span>
                    <Globe className="text-teal-400" size={20} />
                 </div>
              </div>
           </div>
           <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h4 className="text-lg font-black mb-8 text-gray-800">ML Training Signal Distribution</h4>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                       <XAxis dataKey="timestamp" fontSize={9} axisLine={false} tickLine={false} />
                       <YAxis fontSize={9} axisLine={false} tickLine={false} />
                       <Tooltip />
                       <Area type="monotone" dataKey="energy" fill="#009999" fillOpacity={0.05} stroke="#009999" strokeWidth={2} />
                       <Bar dataKey="throughput" barSize={15} fill="#f59e0b" radius={[5, 5, 0, 0]} opacity={0.6} />
                    </ComposedChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>
      )}

      {activeModule === 'vision-ai' && <VisionInspectionSystem />}

      {activeModule === 'operational' && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Overall OEE', value: latest.oee.toFixed(1) + '%', icon: Activity, color: 'text-[#009999]', bg: 'bg-[#009999]/10' },
              { label: 'Throughput', value: latest.throughput.toFixed(0) + ' UPH', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Quality Sigma', value: '5.2σ', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-50' },
              { label: 'Energy Load', value: latest.energy.toFixed(1) + ' kW', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                <div className={`${kpi.bg} ${kpi.color} w-12 h-12 flex items-center justify-center rounded-xl mb-6 group-hover:scale-110 transition-transform`}>
                  <kpi.icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">{kpi.label}</p>
                  <p className="text-3xl font-black text-gray-900 tracking-tighter">{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h4 className="text-lg font-black mb-10 flex items-center text-gray-800">
               <TrendingUp className="mr-3 siemens-text" size={24} />
               Process Performance Timeline
            </h4>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="opOee" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#009999" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#009999" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="timestamp" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} domain={[80, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="oee" stroke="#009999" strokeWidth={4} fillOpacity={1} fill="url(#opOee)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeModule === 'predictive' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-700">
           <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
             <h4 className="text-lg font-black mb-12 flex items-center text-gray-900">
                <Waves className="mr-4 text-amber-500" size={24} />
                Bearing Vibration Frequency
             </h4>
             <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="timestamp" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="step" dataKey="vibration" stroke="#f59e0b" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
             </div>
           </div>
           <div className="bg-[#003333] p-12 rounded-[2.5rem] text-white flex flex-col justify-center relative overflow-hidden group">
              <h5 className="text-teal-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Maintenance Prediction</h5>
              <div className="flex items-baseline space-x-3 mb-6">
                 <p className="text-7xl font-black">{latest.predictedRUL}</p>
                 <span className="text-xl font-light text-gray-400">Hours to Failure</span>
              </div>
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden mb-8">
                <div className="h-full siemens-bg shadow-[0_0_20px_#009999]" style={{ width: `${(latest.predictedRUL / 600) * 100}%` }}></div>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                 <p className="text-xs text-gray-300 font-light leading-relaxed">
                   <strong className="text-white font-black">IDCON AI Alert:</strong> Component <span className="text-teal-400 font-bold">ASSEMBLY_NODE_S1</span> shows early stage lubrication degradation. Scheduled inspection for shift B.
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const AIChat = ({ currentData }: { currentData: SensorData | undefined }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<InsightMessage[]>([
    { role: 'assistant', content: "IDCON Industrial Agent ready. PLC telemetry streams are active and OpenCV vision nodes are validating precision. How can I optimize your metrics today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: InsightMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const response = await getIndustrialInsight(input, currentData);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  if (!isExpanded) {
    return (
      <button 
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-8 right-8 siemens-bg text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 flex items-center group overflow-hidden max-w-[64px] hover:max-w-[240px]"
      >
        <BrainCircuit size={24} />
        <span className="ml-3 font-black uppercase text-[10px] tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">IDCON AI Assistant</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-[420px] max-w-[calc(100vw-4rem)] z-50 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden flex flex-col h-[600px]">
        <div className="siemens-bg p-6 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <BrainCircuit size={24} />
            <div>
              <span className="block font-black leading-none mb-1 text-sm uppercase tracking-widest">IDCON AI Core</span>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">Neural Node v5.1</span>
            </div>
          </div>
          <button onClick={() => setIsExpanded(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-[#009999] text-white' : 'bg-white text-gray-800 border border-gray-100'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && <div className="animate-pulse bg-gray-200 w-12 h-6 rounded-full"></div>}
        </div>
        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="relative flex items-center">
            <input 
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query IDCON Intelligence..." 
              className="w-full pl-6 pr-14 py-4 bg-gray-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#009999]/20 font-medium text-gray-900"
            />
            <button onClick={handleSend} className="absolute right-2.5 siemens-bg text-white p-2.5 rounded-xl hover:scale-105 transition-all shadow-md"><Zap size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PLCShowcase = () => (
  <section className="py-32 bg-[#001a1a] text-white overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#009999]/50 to-transparent"></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-teal-400 text-[10px] font-black uppercase tracking-[0.5em] mb-6">IDCON Logic Layer</h2>
          <h3 className="text-4xl md:text-5xl font-black mb-8 leading-[1.1] tracking-tight">Pure Deterministic <br/> Engineering.</h3>
          <p className="text-lg text-gray-300 font-medium mb-12 leading-relaxed opacity-90">
            IDCON architects high-performance SIMATIC S7-1500 clusters. We build genuine industrial software that scales from single machines to global giga-factories.
          </p>
          <div className="space-y-8">
            {[
              { icon: Code, title: "Structured Control Logic", desc: "Native SCL algorithms for complex math directly in the PLC cycle." },
              { icon: Layers, title: "Distributed Topology", desc: "Reliable ET200SP nodes for millisecond-level remote I/O processing." },
              { icon: Server, title: "Secure Data Bridges", desc: "Encrypted OPC-UA and MQTT pipelines for enterprise analytics." }
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-5">
                <div className="bg-[#003333] p-3 rounded-xl text-teal-400 shadow-xl group-hover:siemens-bg transition-all">
                   <item.icon size={24} />
                </div>
                <div>
                  <h4 className="font-black text-lg mb-1">{item.title}</h4>
                  <p className="text-gray-400 text-sm font-bold">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <CodeBlock 
            language="TIA SCL OPTIMIZATION" 
            code={`// IDCON Industrial Intelligence Logic
IF "System_Enable" AND NOT "Emergency_Stop" THEN
  "PID_Node_01".Setpoint := "HMI_Data".Target;
  "PID_Node_01".Input := "AI_Vision_Feedback";
  
  // Real-time Anomaly Sampling
  FOR #i := 0 TO 512 DO
    IF "Telemetry_Buffer".Tags[#i] > "Threshold" THEN
      "AI_Gateway".Alert := TRUE;
      "AI_Gateway".Payload := #i;
    END_IF;
  END_FOR;
END_IF;`} 
          />
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: "0.9ms", lab: "Avg Cycle" },
              { val: "24K+", lab: "Total Tags" },
              { val: "SIL 3", lab: "Safety" }
            ].map((s, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/10 text-center">
                <span className="block text-xl md:text-2xl font-black text-teal-400 mb-1">{s.val}</span>
                <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">{s.lab}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
        <div className="lg:col-span-2">
          <div className="flex items-center mb-8">
            <div className="siemens-bg p-2 rounded-xl mr-3">
              <Factory className="text-white" size={28} />
            </div>
            <span className="text-3xl font-black tracking-tighter siemens-text uppercase">IDCON</span>
          </div>
          <p className="text-sm text-gray-700 max-w-md font-semibold leading-relaxed mb-8">
            INDUSTRIAL DESIGNING CONSULTANTS provides high-fidelity engineering consultancy, specializing in the intersection of PLC logic and advanced manufacturing data science.
          </p>
          <div className="space-y-4">
             <a href={`mailto:${PRIMARY_EMAIL}`} className="flex items-center space-x-3 group">
                <Mail size={18} className="siemens-text transition-transform group-hover:scale-110" />
                <span className="text-sm font-black text-gray-900 group-hover:text-[#009999] transition-colors">{PRIMARY_EMAIL}</span>
             </a>
             <a href={`mailto:${SECONDARY_EMAIL}`} className="flex items-center space-x-3 group">
                <Mail size={18} className="siemens-text opacity-70 transition-transform group-hover:scale-110" />
                <span className="text-sm font-black text-gray-700 group-hover:text-[#009999] transition-colors">{SECONDARY_EMAIL}</span>
             </a>
          </div>
        </div>
        <div>
          <h4 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-[10px]">Domains</h4>
          <ul className="space-y-3 text-xs text-gray-700 font-bold uppercase tracking-tight">
            <li className="hover:text-[#009999] cursor-pointer">Automotive BiW</li>
            <li className="hover:text-[#009999] cursor-pointer">Battery Cells</li>
            <li className="hover:text-[#009999] cursor-pointer">Energy Systems</li>
            <li className="hover:text-[#009999] cursor-pointer">Precision CNC</li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-[10px]">Solutions</h4>
          <ul className="space-y-3 text-xs text-gray-700 font-bold uppercase tracking-tight">
            <li className="hover:text-[#009999] cursor-pointer">PLC Clusters</li>
            <li className="hover:text-[#009999] cursor-pointer">OpenCV Nodes</li>
            <li className="hover:text-[#009999] cursor-pointer">MLOps Pipeline</li>
            <li className="hover:text-[#009999] cursor-pointer">Cyber-Security</li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-[10px]">Global HQ</h4>
          <p className="text-xs text-gray-700 leading-relaxed font-bold uppercase tracking-wide">
            Tech Park IV, Noida<br/>
            UP 201309, India<br/>
            <span className="text-gray-900 block mt-4">+91 (0) 120 4587 9000</span>
          </p>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-10 flex flex-col items-center gap-6">
        <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest text-center w-full">© 2024 INDUSTRIAL DESIGNING CONSULTANTS Genuine Engineering</p>
        <div className="flex space-x-8 opacity-40 grayscale hover:grayscale-0 transition-all">
           <span className="text-[9px] font-black tracking-widest">ISO 9001:2015</span>
           <span className="text-[9px] font-black tracking-widest">IEC 61131-3</span>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [view, setView] = useState<AppView>('home');
  const [data, setData] = useState<SensorData[]>([]);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    domain: 'PLC Software Architecture',
    priority: 'Standard Review',
    industry: 'Automotive',
    timeline: '1-3 Months',
    infrastructure: 'Brownfield (Modernization)',
    message: '',
    callback: false
  });

  useEffect(() => {
    const generateInitialData = () => {
      const now = new Date();
      const initial: SensorData[] = [];
      for (let i = 40; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000);
        const baseOee = 89 + Math.random() * 6;
        initial.push({
          timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          pressure: 47 + Math.random() * 6,
          temperature: 70 + Math.random() * 5,
          vibration: 2.2 + Math.random() * 2,
          oee: baseOee,
          throughput: 450 + Math.random() * 50,
          quality: 98.8 + Math.random() * 0.8,
          energy: 25.0 + Math.random() * 3,
          anomalyScore: Math.random() * 0.1,
          predictedRUL: 500 + Math.floor(Math.random() * 100),
          aiConfidence: 0.95 + Math.random() * 0.03,
          visionDefectRate: 0.01 + Math.random() * 0.015,
          modelDrift: 0.01 + Math.random() * 0.01,
          predictionUpper: baseOee + 1.5,
          predictionLower: baseOee - 1.5
        });
      }
      setData(initial);
    };
    
    generateInitialData();
    const interval = setInterval(() => {
      setData(prev => {
        const nextTime = new Date();
        const last = prev[prev.length - 1];
        const baseOee = 89 + Math.random() * 6;
        const nextPoint: SensorData = {
          timestamp: nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          pressure: 47 + Math.random() * 6,
          temperature: 70 + Math.random() * 5,
          vibration: 2.2 + Math.random() * 2,
          oee: baseOee,
          throughput: 450 + Math.random() * 50,
          quality: 98.8 + Math.random() * 0.8,
          energy: 25.0 + Math.random() * 3,
          anomalyScore: Math.random() * 0.1,
          predictedRUL: Math.max(0, last.predictedRUL - (Math.random() > 0.95 ? 1 : 0)),
          aiConfidence: 0.95 + Math.random() * 0.03,
          visionDefectRate: 0.01 + Math.random() * 0.015,
          modelDrift: 0.01 + Math.random() * 0.01,
          predictionUpper: baseOee + 1.5,
          predictionLower: baseOee - 1.5
        };
        return [...prev.slice(1), nextPoint];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate real submission
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ 
        name: '', 
        email: '', 
        domain: 'PLC Software Architecture', 
        priority: 'Standard Review', 
        industry: 'Automotive',
        timeline: '1-3 Months',
        infrastructure: 'Brownfield (Modernization)',
        message: '', 
        callback: false 
      });
      setTimeout(() => setFormStatus('idle'), 6000);
    }, 1800);
  };

  const currentSnapshot = useMemo(() => data[data.length - 1], [data]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#009999] selection:text-white bg-[#fcfdfd] font-inter overflow-x-hidden">
      <Navbar currentView={view} setView={setView} />
      
      <main className="flex-grow">
        {view === 'home' && (
          <>
            <section className="relative bg-[#003333] text-white overflow-hidden py-32 md:py-48">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="grid grid-cols-12 gap-2 h-full w-full">
                  {Array.from({length: 144}).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-white/20"></div>
                  ))}
                </div>
              </div>
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:w-4/5 text-center md:text-left">
                  <h2 className="text-teal-400 text-[10px] md:text-xs font-black uppercase tracking-[0.6em] mb-8 animate-in fade-in slide-in-from-left-4 duration-500">Autonomous Factory Intelligence</h2>
                  <h1 className="text-6xl md:text-[8rem] font-black leading-[0.9] mb-12 tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 uppercase">
                    IDCON <br/> <span className="siemens-text font-black">Industrial.</span>
                  </h1>
                  <p className="text-lg md:text-2xl text-gray-100 mb-16 max-w-3xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 opacity-95">
                    IDCON (INDUSTRIAL DESIGNING CONSULTANTS) engineers the high-performance digital core for modern manufacturing. We harmonize deterministic PLC logic with real-time OpenCV computer vision analytics.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start animate-in fade-in slide-in-from-bottom-16 duration-1000">
                    <button onClick={() => setView('dashboards')} className="siemens-bg px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center hover:shadow-[0_20px_40px_rgba(0,153,153,0.3)] hover:-translate-y-1 transition-all">
                      View Telemetry <ChevronRight size={18} className="ml-3" />
                    </button>
                    <a href={`mailto:${PRIMARY_EMAIL}`} className="border-2 border-white/10 px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
                      Email Engineering
                    </a>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mb-32 items-end">
                <div>
                  <h2 className="text-[10px] font-black text-[#009999] uppercase tracking-[0.5em] mb-6">Expertise Stack</h2>
                  <h3 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">Genuine Industrial <br/> Consultancy.</h3>
                </div>
                <p className="text-lg text-gray-800 font-semibold leading-relaxed">
                  INDUSTRIAL DESIGNING CONSULTANTS provides genuine, optimistic engineering solutions. We don't just solve immediate problems; we architect systems that grow with your industrial ambition.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: Camera, title: "Computer Vision", desc: "OpenCV nodes for high-speed anomaly detection and defect segmentation." },
                  { icon: Terminal, title: "PLC Software", desc: "High-performance S7-1500 logic designed for millisecond stability." },
                  { icon: BrainCircuit, title: "Predictive AI", desc: "ML models forecasting component health with 98%+ validation accuracy." },
                  { icon: ShieldCheck, title: "Secure SCADA", desc: "Unified HMI designs with end-to-end industrial data encryption." }
                ].map((f, i) => (
                  <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-xl transition-all duration-500 cursor-default group">
                    <div className="bg-gray-50 text-[#009999] w-14 h-14 flex items-center justify-center rounded-2xl mb-8 group-hover:siemens-bg group-hover:text-white transition-all">
                      <f.icon size={28} />
                    </div>
                    <h4 className="text-xl font-black mb-4 text-gray-900 leading-tight">{f.title}</h4>
                    <p className="text-gray-700 text-sm font-semibold leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <PLCShowcase />

            <section className="bg-gray-50 py-32 border-y border-gray-100">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col items-center text-center mb-20">
                     <h2 className="text-[10px] font-black text-[#009999] uppercase tracking-[0.5em] mb-6">Live Engineering Node</h2>
                     <h3 className="text-4xl font-black text-gray-900 tracking-tight">Operational Intelligence</h3>
                  </div>
                  <DataScienceDashboard data={data} />
               </div>
            </section>
          </>
        )}

        {view === 'dashboards' && (
          <section className="py-24 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
                  <div>
                    <h2 className="text-[10px] font-black text-[#009999] uppercase tracking-[0.4em] mb-4">Industrial Data Console</h2>
                    <h3 className="text-5xl font-black text-gray-900 tracking-tighter">Global Telemetry Node</h3>
                  </div>
                  <div className="bg-white px-8 py-4 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center space-x-4 mx-auto md:mx-0">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">System Link</p>
                      <p className="text-xs font-black text-gray-900">IDCON_S7_LIVE : ONLINE</p>
                    </div>
                  </div>
               </div>
               <DataScienceDashboard data={data} />
            </div>
          </section>
        )}

        {view === 'engineering' && <PLCShowcase />}
        
        {view === 'contact' && (
          <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
               <div className="space-y-10 text-center lg:text-left">
                  <h2 className="text-[10px] font-black text-[#009999] uppercase tracking-[0.6em] mb-6">Partner with IDCON</h2>
                  <h3 className="text-6xl md:text-7xl font-black leading-[0.9] tracking-tighter text-gray-900">Building the <br/> Future Factory.</h3>
                  <p className="text-xl text-gray-800 font-semibold leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Reach out to our engineering leads to initiate a technical review of your factory automation or data science needs. We are optimistic about your production goals.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-10">
                     <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm text-center hover:shadow-lg transition-shadow">
                        <Mail className="siemens-text mb-6 mx-auto" size={28} />
                        <h4 className="font-black text-[10px] uppercase tracking-widest text-gray-700 mb-3">Global Sales</h4>
                        <a href={`mailto:${PRIMARY_EMAIL}`} className="text-sm font-black text-gray-900 hover:text-[#009999] transition-colors break-all">{PRIMARY_EMAIL}</a>
                     </div>
                     <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm text-center hover:shadow-lg transition-shadow">
                        <Headphones className="siemens-text opacity-70 mb-6 mx-auto" size={28} />
                        <h4 className="font-black text-[10px] uppercase tracking-widest text-gray-700 mb-3">Engineering Lead</h4>
                        <a href={`mailto:${SECONDARY_EMAIL}`} className="text-sm font-black text-gray-900 hover:text-[#009999] transition-colors break-all">{SECONDARY_EMAIL}</a>
                     </div>
                  </div>

                  <div className="pt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 opacity-90">
                     <div className="flex items-center space-x-3">
                        <Shield className="text-[#009999]" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Secure Handling</span>
                     </div>
                     <div className="flex items-center space-x-3">
                        <CheckCircle2 className="text-[#009999]" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">ISO Certified Ops</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white p-6 md:p-14 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-gray-100 relative">
                  {formStatus === 'success' ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-500 py-20">
                       <div className="bg-green-100 p-8 rounded-full text-green-600 shadow-lg shadow-green-100">
                          <CheckCircle2 size={64} />
                       </div>
                       <div>
                          <h4 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Transmission Successful</h4>
                          <p className="text-gray-800 font-bold px-4">Your request has been successfully transmitted to <span className="siemens-text font-black">sales@idcon.in</span>. Our team will initiate a technical audit within 24 hours.</p>
                       </div>
                       <button onClick={() => setFormStatus('idle')} className="text-[11px] font-black uppercase text-[#009999] tracking-[0.2em] pt-6 hover:opacity-70 transition-opacity">Submit Additional Node</button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-6 relative z-10">
                       <h4 className="text-3xl font-black text-gray-900 mb-8 border-b border-gray-100 pb-4 tracking-tighter uppercase">Enquiry Node Ingress</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest flex items-center">
                                <FileText size={12} className="mr-2 siemens-text" /> Full Name
                             </label>
                             <input 
                               required 
                               name="name"
                               value={formData.name}
                               onChange={handleInputChange}
                               className="w-full bg-gray-50 border border-gray-300 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#009999]/30 font-bold text-sm text-gray-900 transition-all placeholder-gray-500" 
                               placeholder="e.g. John Doe" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest flex items-center">
                                <Mail size={12} className="mr-2 siemens-text" /> Enterprise Email
                             </label>
                             <input 
                               required 
                               type="email" 
                               name="email"
                               value={formData.email}
                               onChange={handleInputChange}
                               className="w-full bg-gray-50 border border-gray-300 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#009999]/30 font-bold text-sm text-gray-900 transition-all placeholder-gray-500" 
                               placeholder="name@factory.com" 
                             />
                          </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest flex items-center">
                                <Layers size={12} className="mr-2 siemens-text" /> Engineering Domain
                             </label>
                             <select 
                               name="domain"
                               value={formData.domain}
                               onChange={handleInputChange}
                               className="w-full bg-gray-50 border border-gray-300 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#009999]/30 font-black text-[10px] uppercase tracking-widest text-gray-900 transition-all cursor-pointer"
                             >
                                <option>PLC Software Architecture</option>
                                <option>Manufacturing OpenCV Vision</option>
                                <option>Industrial Data Science</option>
                                <option>High-Speed SCADA / HMI</option>
                                <option>Predictive RUL Modeling</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest flex items-center">
                                <Building2 size={12} className="mr-2 siemens-text" /> Industrial Vertical
                             </label>
                             <select 
                               name="industry"
                               value={formData.industry}
                               onChange={handleInputChange}
                               className="w-full bg-gray-50 border border-gray-300 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#009999]/30 font-black text-[10px] uppercase tracking-widest text-gray-900 transition-all cursor-pointer"
                             >
                                <option>Automotive</option>
                                <option>Aerospace</option>
                                <option>Pharma / Biotech</option>
                                <option>Energy & Utilities</option>
                                <option>Heavy Machinery</option>
                             </select>
                          </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest flex items-center">
                                <Calendar size={12} className="mr-2 siemens-text" /> Est. Timeline
                             </label>
                             <select 
                               name="timeline"
                               value={formData.timeline}
                               onChange={handleInputChange}
                               className="w-full bg-gray-50 border border-gray-300 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#009999]/30 font-black text-[10px] uppercase tracking-widest text-gray-900 transition-all cursor-pointer"
                             >
                                <option>1-3 Months</option>
                                <option>3-6 Months</option>
                                <option>6-12 Months</option>
                                <option>Ongoing Partnership</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest flex items-center">
                                <HardDrive size={12} className="mr-2 siemens-text" /> Infrastructure
                             </label>
                             <select 
                               name="infrastructure"
                               value={formData.infrastructure}
                               onChange={handleInputChange}
                               className="w-full bg-gray-50 border border-gray-300 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#009999]/30 font-black text-[10px] uppercase tracking-widest text-gray-900 transition-all cursor-pointer"
                             >
                                <option>Greenfield (New Factory)</option>
                                <option>Brownfield (Modernization)</option>
                                <option>Edge-only Expansion</option>
                                <option>Cloud Integration Only</option>
                             </select>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest flex items-center ml-1">
                             <Terminal size={12} className="mr-2 siemens-text" /> Project Narrative / Scope
                          </label>
                          <textarea 
                            required 
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-300 px-6 py-6 rounded-2xl outline-none focus:ring-2 focus:ring-[#009999]/30 font-bold text-sm text-gray-900 min-h-[140px] transition-all placeholder-gray-500" 
                            placeholder="Describe your industrial challenge, PLC clusters, or vision requirements..."
                          ></textarea>
                       </div>
                       <div className="flex items-center space-x-3 py-2">
                          <input 
                            type="checkbox" 
                            id="callback"
                            name="callback"
                            checked={formData.callback}
                            onChange={handleInputChange}
                            className="w-5 h-5 rounded border-gray-300 text-[#009999] focus:ring-[#009999] cursor-pointer" 
                          />
                          <label htmlFor="callback" className="text-[10px] font-black text-gray-800 uppercase tracking-widest cursor-pointer select-none">Request technical callback within 4 hours</label>
                       </div>
                       <button 
                         type="submit"
                         disabled={formStatus === 'submitting'}
                         className="w-full siemens-bg text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-[#009999]/40 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                       >
                         {formStatus === 'submitting' ? 'Transmitting Ingress Data...' : 'Initiate IDCON Audit'}
                       </button>
                    </form>
                  )}
               </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <AIChat currentData={currentSnapshot} />
    </div>
  );
}
