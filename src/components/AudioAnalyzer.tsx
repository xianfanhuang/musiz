import React, { useEffect, useRef, useCallback } from 'react';

interface AudioAnalyzerProps {
  isPlaying: boolean;
  onFrequencyData: (data: Uint8Array) => void;
}

export const AudioAnalyzer: React.FC<AudioAnalyzerProps> = ({ isPlaying, onFrequencyData }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number>();
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initializeAudio = useCallback(async () => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      oscillatorRef.current = audioContextRef.current.createOscillator();
      gainNodeRef.current = audioContextRef.current.createGain();
      
      oscillatorRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(analyserRef.current);
      
      oscillatorRef.current.frequency.setValueAtTime(220, audioContextRef.current.currentTime);
      gainNodeRef.current.gain.setValueAtTime(0.05, audioContextRef.current.currentTime);
      
      oscillatorRef.current.start();
      
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }, []);

  const updateFrequencyData = useCallback(() => {
    if (analyserRef.current && dataArrayRef.current && isPlaying) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      const simulatedData = new Uint8Array(dataArrayRef.current.length);
      for (let i = 0; i < simulatedData.length; i++) {
        const baseValue = Math.sin(Date.now() * 0.001 + i * 0.1) * 50 + 100;
        const randomVariation = Math.random() * 30;
        simulatedData[i] = Math.max(0, Math.min(255, baseValue + randomVariation));
      }
      
      onFrequencyData(simulatedData);
      animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
    }
  }, [isPlaying, onFrequencyData]);

  useEffect(() => {
    if (isPlaying) {
      if (!audioContextRef.current) {
        initializeAudio();
      }
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
  }, [isPlaying, initializeAudio, updateFrequencyData]);

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {
          // 忽略已停止的振荡器错误
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return null;
};