import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, ScanFace } from 'lucide-react';
import { SystemMetrics } from '../types';

interface WebcamFeedProps {
  isActive: boolean;
  metrics: SystemMetrics;
}

const WebcamFeed: React.FC<WebcamFeedProps> = ({ isActive, metrics }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamError, setStreamError] = useState(false);

  useEffect(() => {
    if (isActive) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setStreamError(false);
        })
        .catch(err => {
          console.error("Error accessing webcam:", err);
          setStreamError(true);
        });
    } else {
      // Stop stream if inactive
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isActive]);

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'Happy': return 'text-green-400 border-green-400';
      case 'Angry': return 'text-red-500 border-red-500';
      case 'Sad': return 'text-blue-400 border-blue-400';
      case 'Fear': return 'text-purple-400 border-purple-400';
      case 'Surprise': return 'text-yellow-400 border-yellow-400';
      default: return 'text-slate-200 border-slate-200';
    }
  };

  const colorClass = getEmotionColor(metrics.faceEmotion.emotion);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-700 aspect-video group">
      {isActive && !streamError ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover opacity-80"
          />
          {/* Simulated Face Bounding Box Overlay */}
          <div className={`absolute top-1/4 left-1/3 w-1/3 h-1/2 border-2 rounded-lg transition-colors duration-500 ${colorClass.split(' ')[1]} opacity-50 flex flex-col items-center justify-start`}>
             <div className={`-mt-6 bg-slate-900/80 px-2 py-1 rounded text-xs font-bold ${colorClass.split(' ')[0]} backdrop-blur-sm`}>
               {metrics.faceEmotion.emotion} {(metrics.faceEmotion.score * 100).toFixed(0)}%
             </div>
          </div>
          
          {/* Status Indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono text-white/70">REC</span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full text-slate-500">
           {streamError ? <CameraOff size={48} className="mb-2 opacity-50" /> : <Camera size={48} className="mb-2 opacity-50" />}
           <p className="text-sm">{streamError ? "Camera Access Denied" : "Camera Off"}</p>
        </div>
      )}

      {/* Overlay UI */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
         <div className="bg-slate-900/80 backdrop-blur p-2 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
               <ScanFace size={14} />
               <span>Blink Rate: {metrics.blinkRate.toFixed(1)}/min</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WebcamFeed;