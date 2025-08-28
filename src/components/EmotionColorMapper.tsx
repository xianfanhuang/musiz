import React from 'react';

interface EmotionColorMapperProps {
  emotion: 'happy' | 'sad' | 'energetic' | 'calm' | 'romantic';
  intensity: number; // 0-1
}

export const EmotionColorMapper: React.FC<EmotionColorMapperProps> = ({ emotion, intensity }) => {
  const getEmotionColors = (emotion: string, intensity: number) => {
    const colorMaps = {
      happy: {
        primary: `hsl(${45 + intensity * 15}, ${70 + intensity * 20}%, ${60 + intensity * 20}%)`,
        secondary: `hsl(${25 + intensity * 10}, ${80 + intensity * 15}%, ${65 + intensity * 15}%)`,
        accent: `hsl(${60 + intensity * 20}, ${75 + intensity * 20}%, ${70 + intensity * 10}%)`
      },
      sad: {
        primary: `hsl(${220 + intensity * 20}, ${40 + intensity * 30}%, ${30 + intensity * 20}%)`,
        secondary: `hsl(${240 + intensity * 15}, ${50 + intensity * 25}%, ${40 + intensity * 15}%)`,
        accent: `hsl(${200 + intensity * 25}, ${60 + intensity * 20}%, ${50 + intensity * 10}%)`
      },
      energetic: {
        primary: `hsl(${0 + intensity * 30}, ${80 + intensity * 15}%, ${60 + intensity * 20}%)`,
        secondary: `hsl(${320 + intensity * 20}, ${75 + intensity * 20}%, ${65 + intensity * 15}%)`,
        accent: `hsl(${40 + intensity * 25}, ${85 + intensity * 10}%, ${70 + intensity * 10}%)`
      },
      calm: {
        primary: `hsl(${180 + intensity * 20}, ${50 + intensity * 25}%, ${70 + intensity * 15}%)`,
        secondary: `hsl(${160 + intensity * 15}, ${45 + intensity * 30}%, ${75 + intensity * 10}%)`,
        accent: `hsl(${200 + intensity * 25}, ${55 + intensity * 20}%, ${65 + intensity * 15}%)`
      },
      romantic: {
        primary: `hsl(${330 + intensity * 15}, ${70 + intensity * 20}%, ${65 + intensity * 15}%)`,
        secondary: `hsl(${350 + intensity * 10}, ${60 + intensity * 25}%, ${70 + intensity * 10}%)`,
        accent: `hsl(${310 + intensity * 20}, ${75 + intensity * 15}%, ${60 + intensity * 20}%)`
      }
    };

    return colorMaps[emotion] || colorMaps.calm;
  };

  const colors = getEmotionColors(emotion, intensity);

  return (
    <div 
      className="absolute inset-0 opacity-80 transition-all duration-2000 ease-in-out"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, ${colors.primary} 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, ${colors.secondary} 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, ${colors.accent} 0%, transparent 70%),
          linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)
        `
      }}
    />
  );
};