import React, { useEffect, useState } from 'react';

interface BreathingVisualizerProps {
  isPlaying: boolean;
  frequencyData?: Uint8Array;
  bpm?: number;
}

export const BreathingVisualizer: React.FC<BreathingVisualizerProps> = ({ 
  isPlaying, 
  frequencyData, 
  bpm = 120 
}) => {
  const [breathPhase, setBreathPhase] = useState(0);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
  }>>([]);

  // 呼吸节律同步
  useEffect(() => {
    if (!isPlaying) return;

    const breathInterval = (60 / bpm) * 4 * 1000; // 4拍一个呼吸周期
    const interval = setInterval(() => {
      setBreathPhase(prev => (prev + 1) % 4);
    }, breathInterval / 4);

    return () => clearInterval(interval);
  }, [isPlaying, bpm]);

  // 粒子系统
  useEffect(() => {
    if (!isPlaying) return;

    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.5 + 0.2
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const particleInterval = setInterval(generateParticles, 8000);

    return () => clearInterval(particleInterval);
  }, [isPlaying]);

  // 频谱数据驱动的视觉强度
  const getIntensity = () => {
    if (!frequencyData) return 0.5;
    const average = Array.from(frequencyData).reduce((sum, val) => sum + val, 0) / frequencyData.length;
    return Math.min(average / 255, 1);
  };

  const intensity = getIntensity();
  const breathScale = 1 + Math.sin(breathPhase * Math.PI / 2) * 0.1 * intensity;
  const breathOpacity = 0.3 + Math.cos(breathPhase * Math.PI / 2) * 0.2 * intensity;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 呼吸光晕 */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          transform: `scale(${breathScale})`,
          opacity: breathOpacity,
          background: `
            radial-gradient(circle at 30% 40%, rgba(255, 107, 157, ${0.3 * intensity}) 0%, transparent 60%),
            radial-gradient(circle at 70% 60%, rgba(78, 205, 196, ${0.3 * intensity}) 0%, transparent 60%),
            radial-gradient(circle at 50% 30%, rgba(168, 230, 207, ${0.2 * intensity}) 0%, transparent 70%)
          `
        }}
      />

      {/* 动态粒子 */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size * (1 + intensity)}px`,
            height: `${particle.size * (1 + intensity)}px`,
            opacity: particle.opacity * intensity,
            animationDuration: `${4 + particle.speed * 2}s`,
            animationDelay: `${particle.id * 0.1}s`
          }}
        />
      ))}

      {/* 频谱可视化波纹 */}
      {frequencyData && (
        <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-1 opacity-30">
          {Array.from({ length: 32 }).map((_, i) => {
            const dataIndex = Math.floor((i / 32) * frequencyData.length);
            const height = (frequencyData[dataIndex] / 255) * 100;
            return (
              <div
                key={i}
                className="bg-gradient-to-t from-white/60 to-white/20 rounded-t transition-all duration-100"
                style={{
                  width: '3px',
                  height: `${Math.max(height, 2)}%`,
                  transform: `scaleY(${1 + Math.sin(breathPhase * Math.PI / 2) * 0.3})`
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};