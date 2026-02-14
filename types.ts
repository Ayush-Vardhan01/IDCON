
export interface VisionMetric {
  id: string;
  partName: string;
  status: 'Pass' | 'Fail';
  confidence: number;
  defectType?: string;
  timestamp: string;
  segmentationMaskId?: string;
}

export interface SensorData {
  timestamp: string;
  pressure: number;
  temperature: number;
  vibration: number;
  oee: number;
  throughput: number;
  quality: number;
  energy: number;
  anomalyScore: number;
  predictedRUL: number; 
  aiConfidence: number;
  visionDefectRate: number;
  modelDrift: number;
  predictionUpper: number;
  predictionLower: number;
  isAnomaly?: boolean;
}

export interface MachineStatus {
  id: string;
  name: string;
  status: 'operational' | 'warning' | 'critical' | 'offline';
  plcType: string;
  scadaTag: string;
  lastMaintenance: string;
}

export interface InsightMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type AppView = 'home' | 'dashboards' | 'engineering' | 'contact';
export type DashboardModule = 'operational' | 'predictive' | 'vision-ai' | 'ai-optimization' | 'data-science-health';

export interface ContactFormData {
  name: string;
  email: string;
  domain: string;
  priority: string;
  industry: string;
  timeline: string;
  infrastructure: string;
  message: string;
  callback: boolean;
}
