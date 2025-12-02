import React, { useState, useEffect } from 'react';
import WebcamFeed from './components/WebcamFeed';
import MetricsPanel from './components/MetricsPanel';
import TutorChat from './components/TutorChat';
import { useMockInference } from './hooks/useMockInference';
import { initializeGemini } from './services/gemini';
import { ChatMessage, SystemMetrics } from './types';
import { BrainCircuit, Key, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [metricsHistory, setMetricsHistory] = useState<SystemMetrics[]>([]);
  
  // Real-time metrics hook (simulates the Python backend inference)
  const currentMetrics = useMockInference(isSessionActive);

  // Update history buffer
  useEffect(() => {
    if (isSessionActive) {
      setMetricsHistory(prev => {
        const newHistory = [...prev, currentMetrics];
        return newHistory.slice(-50); // Keep last 50 points
      });
    }
  }, [currentMetrics, isSessionActive]);

  // Handle API Key Selection
  const handleApiKeyCheck = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio && aiStudio.hasSelectedApiKey) {
      const hasKey = await aiStudio.hasSelectedApiKey();
      if (hasKey) {
        setHasApiKey(true);
        // The API Key is injected into process.env.API_KEY by the environment
        if (process.env.API_KEY) {
          initializeGemini(process.env.API_KEY);
        }
      }
    } else {
        // Fallback for demo or if aistudio helper isn't present in this specific preview environment
        // We assume for this scaffold that the environment provides it if we just click "Start".
        // In a real scenario, we might prompt for input if not using the special Google selector.
        console.warn("AI Studio key selector not found, assuming dev environment or manual key provision.");
        if(process.env.API_KEY) {
            initializeGemini(process.env.API_KEY);
            setHasApiKey(true);
        }
    }
  };

  const openKeySelection = async () => {
      const aiStudio = (window as any).aistudio;
      if(aiStudio && aiStudio.openSelectKey) {
          await aiStudio.openSelectKey();
          await handleApiKeyCheck();
      }
  };
  
  // Initial check
  useEffect(() => {
      handleApiKeyCheck();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur fixed top-0 w-full z-10 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
             <BrainCircuit size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Emotion Aware AI Tutor</h1>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">FER-2013 • RAVDESS • GEMINI 2.5</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {!hasApiKey && (
               <button 
                onClick={openKeySelection}
                className="flex items-center gap-2 text-xs bg-amber-600/20 text-amber-400 px-3 py-1.5 rounded-full border border-amber-600/50 hover:bg-amber-600/30 transition-colors"
               >
                 <Key size={14} />
                 <span>Select API Key</span>
               </button>
           )}
           <div className={`h-2 w-2 rounded-full ${isSessionActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-600'}`} />
           <span className="text-xs font-medium text-slate-400">
             {isSessionActive ? 'System Active' : 'Standby'}
           </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 p-6 flex flex-col h-screen overflow-hidden">
        
        {!hasApiKey ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
             <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
                <BrainCircuit size={64} className="mx-auto text-indigo-500 mb-6 opacity-80" />
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to the AI Tutor</h2>
                <p className="text-slate-400 mb-8">
                  This system uses multimodal sensing (Simulated for Demo) and Gemini 2.5 Flash to adapt tutoring based on your emotional state.
                  <br/><br/>
                  Please select a paid Google Cloud Project API key to proceed.
                </p>
                <button 
                  onClick={openKeySelection}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 mx-auto"
                >
                  <Key size={20} />
                  Connect Gemini API
                </button>
                <div className="mt-6 text-xs text-slate-500">
                   <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-indigo-400">
                     Billing Information
                   </a>
                </div>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Left Column: Visuals & Metrics */}
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 h-full overflow-y-auto pb-4">
              
              {/* Top Row: Webcam & Controls */}
              <div className="flex-shrink-0">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                      <LayoutDashboard size={16} />
                      Observation Deck
                    </h2>
                    <button
                      onClick={() => setIsSessionActive(!isSessionActive)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isSessionActive 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30'
                      }`}
                    >
                      {isSessionActive ? 'Stop Session' : 'Start Session'}
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px]">
                    <div className="h-full">
                       <WebcamFeed isActive={isSessionActive} metrics={currentMetrics} />
                    </div>
                    {/* Placeholder for Data Info or Instructions */}
                    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-sm text-slate-400 overflow-y-auto">
                        <h3 className="text-white font-medium mb-2">System Status</h3>
                        <ul className="space-y-2 font-mono text-xs">
                           <li className="flex justify-between">
                             <span>Face Model:</span> <span className="text-emerald-400">Active (MobileNetV2)</span>
                           </li>
                           <li className="flex justify-between">
                             <span>Audio Model:</span> <span className="text-emerald-400">Active (RAVDESS-LSTM)</span>
                           </li>
                           <li className="flex justify-between">
                             <span>Tutor Agent:</span> <span className="text-indigo-400">Gemini 2.5 Flash</span>
                           </li>
                           <li className="border-t border-slate-700 pt-2 mt-2">
                             Engagement Algorithm:
                           </li>
                           <li className="pl-2 opacity-70">
                              - Blink Rate (EAR)<br/>
                              - Head Pose (Pitch/Yaw)<br/>
                              - Emotion Valency
                           </li>
                        </ul>
                    </div>
                 </div>
              </div>

              {/* Bottom Row: Charts */}
              <div className="flex-1 min-h-[300px]">
                <MetricsPanel metrics={currentMetrics} history={metricsHistory} />
              </div>
            </div>

            {/* Right Column: Chat Interface */}
            <div className="col-span-12 lg:col-span-5 h-full min-h-[500px]">
              <TutorChat 
                metrics={currentMetrics} 
                messages={messages} 
                setMessages={setMessages} 
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;