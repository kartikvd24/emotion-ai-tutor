import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, CartesianGrid 
} from 'recharts';
import { SystemMetrics, Emotion } from '../types';
import { Activity, Brain, Volume2 } from 'lucide-react';

interface MetricsPanelProps {
  metrics: SystemMetrics;
  history: SystemMetrics[];
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics, history }) => {
  const emotionsData = [
    { name: 'Happy', value: metrics.faceEmotion.emotion === Emotion.Happy ? metrics.faceEmotion.score : 0.1 },
    { name: 'Sad', value: metrics.faceEmotion.emotion === Emotion.Sad ? metrics.faceEmotion.score : 0.05 },
    { name: 'Neutral', value: metrics.faceEmotion.emotion === Emotion.Neutral ? metrics.faceEmotion.score : 0.2 },
    { name: 'Angry', value: metrics.faceEmotion.emotion === Emotion.Angry ? metrics.faceEmotion.score : 0.02 },
    { name: 'Confused', value: metrics.confusionLevel / 100 },
  ];

  // Keep last 30 data points for history chart
  const recentHistory = history.slice(-30);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {/* Real-time Emotions Bar */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col shadow-sm">
        <h3 className="text-slate-300 text-sm font-semibold mb-4 flex items-center gap-2">
          <Brain size={16} className="text-indigo-400" />
          Real-time Emotion Analysis
        </h3>
        <div className="flex-1 w-full min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={emotionsData} layout="vertical">
              <XAxis type="number" domain={[0, 1]} hide />
              <YAxis dataKey="name" type="category" width={70} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {emotionsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'Confused' ? '#f59e0b' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement & Voice History Area */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col shadow-sm">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-300 text-sm font-semibold flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" />
              Engagement Trend
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
               <Volume2 size={12} />
               <span>Voice Sentiment</span>
            </div>
         </div>
        
        <div className="flex-1 w-full min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={recentHistory}>
              <defs>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="timestamp" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                 labelFormatter={() => ''}
                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
              />
              <Area 
                type="monotone" 
                dataKey="engagementScore" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorEngagement)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="confusionLevel" 
                stroke="#f59e0b" 
                fill="none" 
                strokeWidth={2} 
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;