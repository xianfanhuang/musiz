import React from 'react';

interface EmotionColorMapperProps {
  emotion: 'happy' | 'sad' | 'energetic' | 'calm' | 'romantic';
  intensity: number; // 0-1
}

export const EmotionColorMapper: React.FC<EmotionColorMapperProps> = ({ emotion, intensity }) => {
  const getEmotionColors = (emotion: string, intensity: number) => {
    const baseIntensity = Math.max(0.3, intensity); // 确保最小可见度
    
    const colorMaps = {
      happy: {
        primary: `hsla(${45 + intensity * 15}, ${70 + intensity * 20}%, ${60 + intensity * 20}%, ${0.4 + intensity * 0.3})`,
        secondary: `hsla(${25 + intensity * 10}, ${80 + intensity * 15}%, ${65 + intensity * 15}%, ${0.3 + intensity * 0.2})`,
        accent: `hsla(${60 + intensity * 20}, ${75 + intensity * 20}%, ${70 + intensity * 10}%, ${0.2 + intensity * 0.3})`
      },
      sad: {
        primary: `hsla(${220 + intensity * 20}, ${40 + intensity * 30}%, ${30 + intensity * 20}%, ${0.5 + intensity * 0.3})`,
        secondary: `hsla(${240 + intensity * 15}, ${50 + intensity * 25}%, ${40 + intensity * 15}%, ${0.4 + intensity * 0.2})`,
        accent: `hsla(${200 + intensity * 25}, ${60 + intensity * 20}%, ${50 + intensity * 10}%, ${0.3 + intensity * 0.3})`
      },
      energetic: {
        primary: `hsla(${0 + intensity * 30}, ${80 + intensity * 15}%, ${60 + intensity * 20}%, ${0.4 + intensity * 0.4})`,
        secondary: `hsla(${320 + intensity * 20}, ${75 + intensity * 20}%, ${65 + intensity * 15}%, ${0.3 + intensity * 0.3})`,
        accent: `hsla(${40 + intensity * 25}, ${85 + intensity * 10}%, ${70 + intensity * 10}%, ${0.2 + intensity * 0.4})`
      },
      calm: {
        primary: `hsla(${180 + intensity * 20}, ${50 + intensity * 25}%, ${70 + intensity * 15}%, ${0.3 + intensity * 0.3})`,
        secondary: `hsla(${160 + intensity * 15}, ${45 + intensity * 30}%, ${75 + intensity * 10}%, ${0.2 + intensity * 0.2})`,
        accent: `hsla(${200 + intensity * 25}, ${55 + intensity * 20}%, ${65 + intensity * 15}%, ${0.2 + intensity * 0.3})`
      },
      romantic: {
        primary: `hsla(${330 + intensity * 15}, ${70 + intensity * 20}%, ${65 + intensity * 15}%, ${0.4 + intensity * 0.3})`,
        secondary: `hsla(${350 + intensity * 10}, ${60 + intensity * 25}%, ${70 + intensity * 10}%, ${0.3 + intensity * 0.2})`,
        accent: `hsla(${310 + intensity * 20}, ${75 + intensity * 15}%, ${60 + intensity * 20}%, ${0.2 + intensity * 0.4})`
      }
    };

    return colorMaps[emotion] || colorMaps.calm;
  };

  const colors = getEmotionColors(emotion, intensity);

  return (
    <div 
      className="fixed inset-0 transition-all duration-3000 ease-in-out pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse at 25% 25%, ${colors.primary} 0%, transparent 50%),
          radial-gradient(ellipse at 75% 75%, ${colors.secondary} 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, ${colors.accent} 0%, transparent 70%),
          linear-gradient(135deg, ${colors.primary}, ${colors.secondary}),
          linear-gradient(45deg, ${colors.accent}, transparent)
        `,
        backgroundSize: '150% 150%, 120% 120%, 100% 100%, 100% 100%, 100% 100%',
        backgroundPosition: '0% 0%, 100% 100%, 50% 50%, 0% 0%, 0% 0%',
        animation: 'gradientShift 20s ease-in-out infinite'
      }}
    >
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 0%, 100% 100%, 50% 50%, 0% 0%, 0% 0%;
          }
          25% {
            background-position: 100% 0%, 0% 100%, 25% 75%, 100% 0%, 100% 0%;
          }
          50% {
            background-position: 100% 100%, 0% 0%, 75% 25%, 100% 100%, 100% 100%;
          }
          75% {
            background-position: 0% 100%, 100% 0%, 25% 75%, 0% 100%, 0% 100%;
          }
        }
      `}</style>
    </div>
  );
};