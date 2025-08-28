import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat } from 'lucide-react';

// 模拟音乐数据
const sampleTracks = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    album: "Ethereal Nights",
    duration: 245,
    cover: "https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 2,
    title: "Ocean Waves",
    artist: "Deep Blue",
    album: "Aquatic Symphony",
    duration: 198,
    cover: "https://images.pexels.com/photos/1526994/pexels-photo-1526994.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 3,
    title: "Neon Lights",
    artist: "City Pulse",
    album: "Urban Glow",
    duration: 267,
    cover: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400"
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
  
  const progressInterval = useRef<NodeJS.Timeout>();
  
  const track = sampleTracks[currentTrack];
  
  // 播放/暂停逻辑
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= track.duration) {
            setIsPlaying(false);
            return 0;
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
  }, [isPlaying, track.duration]);

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
      {/* 动态背景层 */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-blue-500/30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-green-400/20 via-teal-500/20 to-orange-400/20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/25 via-rose-500/25 to-cyan-500/25 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* 粒子效果 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* 主内容区域 */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          
          {/* 专辑封面 - 呼吸动画 */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div 
                className="w-80 h-80 rounded-3xl overflow-hidden shadow-2xl animate-breathe"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.3))'
                }}
              >
                <img 
                  src={track.cover} 
                  alt={track.album}
                  className="w-full h-full object-cover"
                />
                {/* 封面发光效果 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
              
              {/* 播放状态指示器 */}
              {isPlaying && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
              )}
            </div>
          </div>

          {/* 歌曲信息 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
              {track.title}
            </h1>
            <p className="text-lg text-white/70 font-medium">
              {track.artist}
            </p>
          </div>

          {/* 播放控制面板 - 毛玻璃效果 */}
          <div 
            className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20"
            style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
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
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider"
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
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={togglePlay}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </button>

              <button
                onClick={nextTrack}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* 辅助控制 */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isLiked ? 'bg-red-500/30 text-red-400' : 'bg-white/10 text-white/60 hover:text-white'
                }`}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isShuffled ? 'bg-blue-500/30 text-blue-400' : 'bg-white/10 text-white/60 hover:text-white'
                }`}
              >
                <Shuffle size={16} />
              </button>

              {/* 音量控制 */}
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
                  isRepeated ? 'bg-green-500/30 text-green-400' : 'bg-white/10 text-white/60 hover:text-white'
                }`}
              >
                <Repeat size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 自定义CSS样式 */}
      <style jsx>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.3;
          }
        }

        .animate-breathe {
          animation: breathe 6s ease-in-out infinite;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .slider {
          background: linear-gradient(to right, 
            rgba(255,255,255,0.8) 0%, 
            rgba(255,255,255,0.8) ${(currentTime / track.duration) * 100}%, 
            rgba(255,255,255,0.2) ${(currentTime / track.duration) * 100}%, 
            rgba(255,255,255,0.2) 100%);
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b9d, #4ecdc4);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: all 0.2s;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }

        .slider-small {
          background: linear-gradient(to right, 
            rgba(255,255,255,0.8) 0%, 
            rgba(255,255,255,0.8) ${volume}%, 
            rgba(255,255,255,0.2) ${volume}%, 
            rgba(255,255,255,0.2) 100%);
        }

        .slider-small::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4ecdc4, #88d8b0);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

export default App;