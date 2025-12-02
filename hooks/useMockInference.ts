import { useState, useEffect, useCallback } from 'react';
import { Emotion, SystemMetrics } from '../types';

const EMOTIONS = Object.values(Emotion);

/**
 * Since we cannot run heavy PyTorch/TensorFlow models in this lightweight frontend scaffold comfortably,
 * this hook simulates the data stream that would come from `inference_face.py` and `inference_audio.py`
 * via a WebSocket or API polling.
 */
export const useMockInference = (isActive: boolean) => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    timestamp: Date.now(),
    faceEmotion: { emotion: Emotion.Neutral, score: 0.8 },
    voiceEmotionScore: 0.1,
    engagementScore: 85,
    confusionLevel: 10,
    blinkRate: 15,
  });

  const generateMockData = useCallback(() => {
    setMetrics(prev => {
      // Drift the values naturally rather than random jumping
      const drift = (val: number, min: number, max: number, volatility: number) => {
        const change = (Math.random() - 0.5) * volatility;
        return Math.min(Math.max(val + change, min), max);
      };

      // Randomly switch dominant emotion occasionally
      let newEmotion = prev.faceEmotion.emotion;
      if (Math.random() > 0.95) {
        newEmotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
      }

      // If confusion is high, engagement usually drops
      const newConfusion = drift(prev.confusionLevel, 0, 100, 10);
      const engagementTarget = 100 - newConfusion;
      const newEngagement = drift(prev.engagementScore, 0, 100, 5) * 0.9 + engagementTarget * 0.1;

      return {
        timestamp: Date.now(),
        faceEmotion: {
          emotion: newEmotion,
          score: drift(prev.faceEmotion.score, 0.4, 0.99, 0.1)
        },
        voiceEmotionScore: drift(prev.voiceEmotionScore, -1, 1, 0.2),
        engagementScore: newEngagement,
        confusionLevel: newConfusion,
        blinkRate: drift(prev.blinkRate, 5, 40, 2),
      };
    });
  }, []);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(generateMockData, 1000); // 1Hz update rate
    return () => clearInterval(interval);
  }, [isActive, generateMockData]);

  return metrics;
};