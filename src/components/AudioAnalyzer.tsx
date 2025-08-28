import React, { useEffect, useRef, useState } from 'react';

interface AudioAnalyzerProps {
  isPlaying: boolean;
  onFrequencyData: (data: Uint8Array) => void;
}

export const AudioAnalyzer: React.FC<AudioAnalyzerProps> = ({ isPlaying, onFrequencyData }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (isPlaying && !audioContextRef.current) {
      // 初始化Web Audio API
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      // 配置分析器
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      // 创建虚拟音频源用于演示
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      oscillator.start();
    }

    const updateFrequencyData = () => {
      if (analyserRef.current && dataArrayRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        onFrequencyData(dataArrayRef.current);
        animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
      }
    };

    if (isPlaying) {
      updateFrequencyData();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, onFrequencyData]);

  return null;
};