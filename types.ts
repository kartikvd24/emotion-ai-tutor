export enum Emotion {
  Happy = 'Happy',
  Sad = 'Sad',
  Neutral = 'Neutral',
  Angry = 'Angry',
  Fear = 'Fear',
  Disgust = 'Disgust',
  Surprise = 'Surprise',
}

export interface EmotionMetric {
  emotion: Emotion;
  score: number; // 0 to 1
}

export interface SystemMetrics {
  timestamp: number;
  faceEmotion: EmotionMetric;
  voiceEmotionScore: number; // -1 (Negative) to 1 (Positive)
  engagementScore: number; // 0 to 100
  confusionLevel: number; // 0 to 100
  blinkRate: number; // blinks per minute
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  contextEmotion?: Emotion; // The emotion detected when this message was sent
}

export type ViewMode = 'dashboard' | 'setup';