import React, { useEffect, useState, useMemo } from 'react';

interface BreathingVisualizerProps {
  isPlaying: boolean;
  frequencyData?: Uint8Array;
  bpm?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
  color: string;
}

export const BreathingVisualizer: React.FC<BreathingVisualizerProps> = ({ 
  isPlaying, 
  frequencyData, 
  bpm = 120 
}) => {
  const [breathPhase, setBreathPhase] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const breathCycle = (60 / bpm) * 4 * 1000;
    const phaseInterval = breathCycle / 100;

    const interval = setInterval(() => {
      setBreathPhase(prev => (prev + 1) % 100);
      setTime(prev => prev + phaseInterval);
    }, phaseInterval);

    return () => clearInterval(interval);
  }, [isPlaying, bpm]);

  const generateParticles = useMemo(() => {
    const colors = ['#FF6B9D', '#4ECDC4', '#A8E6CF', '#88D8B0', '#FFB347'];
    
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      opacity: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.8 + 0.3,
      angle: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }, []);

  useEffect(() => {
    if (isPlaying) {
      setParticles(generateParticles);
    }
  }, [isPlaying, generateParticles]);

  const getAudioIntensity = () => {
    if (!frequencyData || frequencyData.length === 0) return 0.5;
    
    const lowFreq = Array.from(frequencyData.slice(0, 85)).reduce((sum, val) => sum + val, 0) / 85;
    const midFreq = Array.from(frequencyData.slice(85, 170)).reduce((sum, val) => sum + val, 0) / 85;
    const highFreq = Array.from(frequencyData.slice(170)).reduce((sum, val) => sum + val, 0) / (frequencyData.length - 170);
    
    const weightedIntensity = (lowFreq * 0.5 + midFreq * 0.3 + highFreq * 0.2) / 255;
    return Math.min(Math.max(weightedIntensity, 0.2), 1);
  };

  const audioIntensity = getAudioIntensity();
  const breathProgress = breathPhase / 100;
  const breathWave = Math.sin(breathProgress * Math.PI * 2);
  const breathScale = 1 + (breathWave * 0.15 * audioIntensity);
  const breathOpacity = 0.4 + (Math.abs(breathWave) * 0.3 * audioIntensity);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* 主呼吸光晕 */}
      <div 
        className="absolute inset-0 transition-all duration-200 ease-out"
        style={{
          transform: `scale(${breathScale}) rotate(${breathProgress * 2}deg)`,
          opacity: breathOpacity,
          background: `
            radial-gradient(circle at 30% 40%, rgba(255, 107, 157, ${0.4 * audioIntensity}) 0%, transparent 60%),
            radial-gradient(circle at 70% 60%, rgba(78, 205, 196, ${0.3 * audioIntensity}) 0%, transparent 60%),
            radial-gradient(circle at 50% 30%, rgba(168, 230, 207, ${0.2 * audioIntensity}) 0%, transparent 70%)
          `
        }}
      />

      {/* 动态粒子系统 */}
      {isPlaying && particles.map(particle => {
        const particlePhase = (time * particle.speed + particle.id * 100) % 10000;
        const x = particle.x + Math.sin(particlePhase * 0.001 + particle.angle) * 10;
        const y = particle.y + Math.cos(particlePhase * 0.001 + particle.angle) * 8;
        const scale = 1 + Math.sin(particlePhase * 0.002) * 0.3 * audioIntensity;
        
        return (
          <div
            key={particle.id}
            className="absolute rounded-full transition-all duration-200"
            style={{
              left: `${Math.max(0, Math.min(100, x))}%`,
              top: `${Math.max(0, Math.min(100, y))}%`,
              width: `${particle.size * scale}px`,
              height: `${particle.size * scale}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity * audioIntensity * breathOpacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              filter: `blur(${Math.max(0, 2 - audioIntensity * 2)}px)`
            }}
          />
        );
      })}

      {/* 频谱可视化波纹 */}
      {frequencyData && isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-40 flex items-end justify-center gap-1 opacity-40">
          {Array.from({ length: 64 }).map((_, i) => {
            const dataIndex = Math.floor((i / 64) * frequencyData.length);
            const height = Math.max((frequencyData[dataIndex] / 255) * 100, 2);
            const hue = (i / 64) * 360 + breathProgress * 180;
            
            return (
              <div
                key={i}
                className="transition-all duration-100 ease-out rounded-t"
                style={{
                  width: '2px',
                  height: `${height}%`,
                  backgroundColor: `hsl(${hue}, 70%, 60%)`,
                  transform: `scaleY(${1 + breathWave * 0.3}) scaleX(${1 + audioIntensity * 0.5})`,
                  boxShadow: `0 0 ${height * 0.1}px hsl(${hue}, 70%, 60%)`,
                  filter: `blur(${Math.max(0, 1 - audioIntensity)}px)`
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};