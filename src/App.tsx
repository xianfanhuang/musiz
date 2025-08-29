import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat, Mic, Settings } from 'lucide-react';
import { AudioAnalyzer } from './components/AudioAnalyzer';
import { EmotionColorMapper } from './components/EmotionColorMapper';
import { BreathingVisualizer } from './components/BreathingVisualizer';
import { GestureController } from './components/GestureController';

const sampleTracks = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    album: "Ethereal Nights",
    duration: 245,
    bpm: 120,
    emotion: 'romantic' as const,
    cover: "https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 2,
    title: "Ocean Waves",
    artist: "Deep Blue",
    album: "Aquatic Symphony",
    duration: 198,
    bpm: 90,
    emotion: 'calm' as const,
    cover: "https://images.pexels.com/photos/1526994/pexels-photo-1526994.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 3,
    title: "Neon Lights",
    artist: "City Pulse",
    album: "Urban Glow",
    duration: 267,
    bpm: 140,
    emotion: 'energetic' as const,
    cover: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 4,
    title: "Sunny Day",
    artist: "Golden Hour",
    album: "Bright Moments",
    duration: 210,
    bpm: 110,
    emotion: 'happy' as const,
    cover: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400"
  }
];

function App() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>();
  const [isVoiceControlEnabled, setIsVoiceControlEnabled] = useState(false);
  const [gestureEnabled, setGestureEnabled] = useState(true);
  const [visualIntensity, setVisualIntensity] = useState(0.7);
  const [showSettings, setShowSettings] = useState(false);
  
  const progressInterval = useRef<NodeJS.Timeout>();
  const track = sampleTracks[currentTrack];
  
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= track.duration) {
            if (isRepeated) {
              return 0;
            } else {
              setIsPlaying(false);
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, track.duration, isRepeated]);

  const handleFrequencyData = useCallback((data: Uint8Array) => {
    setFrequencyData(new Uint8Array(data));
  }, []);

  const handleGesture = useCallback((gesture: string) => {
    switch (gesture) {
      case 'swipeLeft':
        nextTrack();
        break;
      case 'swipeRight':
        prevTrack();
        break;
      case 'swipeUp':
        setVolume(prev => Math.min(prev + 10, 100));
        break;
      case 'swipeDown':
        setVolume(prev => Math.max(prev - 10, 0));
        break;
      case 'tap':
        togglePlay();
        break;
      case 'doubleTap':
        setIsLiked(!isLiked);
        break;
    }
  }, [isLiked]);

  useEffect(() => {
    if (!isVoiceControlEnabled || !('webkitSpeechRecognition' in window)) return;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'zh-CN';

    recognition.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
      
      if (command.includes('播放') || command.includes('play')) {
        setIsPlaying(true);
      } else if (command.includes('暂停') || command.includes('pause')) {
        setIsPlaying(false);
      } else if (command.includes('下一首') || command.includes('next')) {
        nextTrack();
      } else if (command.includes('上一首') || command.includes('previous')) {
        prevTrack();
      }
    };

    if (isVoiceControlEnabled) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isVoiceControlEnabled]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % sampleTracks.length);
    setCurrentTime(0);
  };
  
  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + sampleTracks.length) % sampleTracks.length);
    setCurrentTime(0);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900">
      <AudioAnalyzer isPlaying={isPlaying} onFrequencyData={handleFrequencyData} />
      <GestureController onGesture={handleGesture} isEnabled={gestureEnabled} />
      <EmotionColorMapper 
        emotion={track.emotion} 
        intensity={visualIntensity * (frequencyData ? Array.from(frequencyData).reduce((sum, val) => sum + val, 0) / (frequencyData.length * 255) : 0.5)} 
      />
      <BreathingVisualizer 
        isPlaying={isPlaying} 
        frequencyData={frequencyData}
        bpm={track.bpm}
      />

      {/* 设置按钮 */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <Settings size={20} />
        </button>
        
        {showSettings && (
          <div className="absolute top-16 right-0 backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 min-w-48">
            <div className="flex flex-col gap-3">
              <div className="text-sm text-white/70 font-medium">控制设置</div>
              
              <label className="flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={isVoiceControlEnabled}
                  onChange={(e) => setIsVoiceControlEnabled(e.target.checked)}
                  className="rounded"
                />
                语音控制
              </label>
              
              <label className="flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={gestureEnabled}
                  onChange={(e) => setGestureEnabled(e.target.checked)}
                  className="rounded"
                />
                手势控制
              </label>
              
              <div className="flex flex-col gap-2">
                <span className="text-xs text-white/60">视觉强度</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={visualIntensity}
                  onChange={(e) => setVisualIntensity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider-small"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 主内容区域 */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          
          {/* 专辑封面 */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div 
                className="w-80 h-80 rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.3))',
                  transform: `scale(${1 + (frequencyData ? Array.from(frequencyData).reduce((sum, val) => sum + val, 0) / (frequencyData.length * 255) * 0.1 : 0)})`,
                  animation: isPlaying ? 'breathe-enhanced 6s ease-in-out infinite' : 'none'
                }}
              >
                <img 
                  src={track.cover} 
                  alt={track.album}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
                  style={{
                    background: `linear-gradient(135deg, ${track.emotion === 'energetic' ? 'rgba(255,107,157,0.3)' : 'rgba(78,205,196,0.2)'} 0%, transparent 70%)`
                  }}
                />
              </div>
              
              {isPlaying && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                </div>
              )}

              {isVoiceControlEnabled && (
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                  <Mic size={16} className="text-white" />
                </div>
              )}
            </div>
          </div>

          {/* 歌曲信息 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
              {track.title}
            </h1>
            <p className="text-lg text-white/70 font-medium mb-1">
              {track.artist}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-white/50">
              <span>{track.bpm} BPM</span>
              <span>•</span>
              <span className="capitalize">{track.emotion}</span>
            </div>
          </div>

          {/* 播放控制面板 */}
          <div 
            className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 transition-all duration-500"
            style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
            }}
          >
            
            {/* 进度条 */}
            <div className="mb-6">
              <input
                type="range"
                min="0"
                max={track.duration}
                value={currentTime}
                onChange={handleProgressChange}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider-enhanced"
                style={{
                  background: `linear-gradient(to right, 
                    rgba(255,107,157,0.8) 0%, 
                    rgba(78,205,196,0.8) ${(currentTime / track.duration) * 100}%, 
                    rgba(255,255,255,0.2) ${(currentTime / track.duration) * 100}%, 
                    rgba(255,255,255,0.2) 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-white/60 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(track.duration)}</span>
              </div>
            </div>

            {/* 主控制按钮 */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                onClick={prevTrack}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={togglePlay}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 text-white hover:from-white/30 hover:to-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </button>

              <button
                onClick={nextTrack}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* 辅助控制 */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isLiked ? 'bg-red-500/30 text-red-400 shadow-lg shadow-red-500/20' : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
                }`}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isShuffled ? 'bg-blue-500/30 text-blue-400 shadow-lg shadow-blue-500/20' : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
                }`}
              >
                <Shuffle size={16} />
              </button>

              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-white/60" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider-small"
                />
              </div>

              <button
                onClick={() => setIsRepeated(!isRepeated)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isRepeated ? 'bg-green-500/30 text-green-400 shadow-lg shadow-green-500/20' : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
                }`}
              >
                <Repeat size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes breathe-enhanced {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
            filter: brightness(1) saturate(1);
          }
          25% {
            transform: scale(1.02) rotate(0.5deg);
            opacity: 0.95;
            filter: brightness(1.1) saturate(1.1);
          }
          50% {
            transform: scale(1.05) rotate(0deg);
            opacity: 0.8;
            filter: brightness(1.2) saturate(1.2);
          }
          75% {
            transform: scale(1.02) rotate(-0.5deg);
            opacity: 0.95;
            filter: brightness(1.1) saturate(1.1);
          }
        }

        .slider-enhanced::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b9d, #4ecdc4, #a8e6cf);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(255,107,157,0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .slider-enhanced::-webkit-slider-thumb:hover {
          transform: scale(1.3);
          box-shadow: 0 6px 20px rgba(0,0,0,0.4), 0 0 30px rgba(255,107,157,0.5);
        }

        .slider-small::-webkit-slider-thumb {
          appearance: none;
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4ecdc4, #88d8b0);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2), 0 0 15px rgba(78,205,196,0.3);
          transition: all 0.2s ease;
        }

        .slider-small::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(78,205,196,0.4);
        }
      `}</style>
    </div>
  );
}

export default App;