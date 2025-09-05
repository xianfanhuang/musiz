import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  Upload,
  Link,
  Music,
  X
} from 'lucide-react';
import FileUpload from './FileUpload';
import UrlInput from './UrlInput';
import PlaylistManager from './PlaylistManager';
import { AudioTrack } from '../types/audio';

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playlist, setPlaylist] = useState<AudioTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (currentTrackIndex < playlist.length - 1) {
        setCurrentTrackIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
        setCurrentTrackIndex(0);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, playlist.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.url;
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }, [currentTrack, isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const previousTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
    }
  };

  const nextTrack = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
    }
  };

  const addTrack = (track: AudioTrack) => {
    setPlaylist(prev => [...prev, track]);
    if (playlist.length === 0) {
      setCurrentTrackIndex(0);
    }
  };

  const removeTrack = (index: number) => {
    setPlaylist(prev => prev.filter((_, i) => i !== index));
    if (index === currentTrackIndex && playlist.length > 1) {
      if (index === playlist.length - 1) {
        setCurrentTrackIndex(prev => prev - 1);
      }
    } else if (index < currentTrackIndex) {
      setCurrentTrackIndex(prev => prev - 1);
    }
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    // 主播放器 - 总是显示
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20">
      <audio ref={audioRef} hidden />
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Music className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">
          {currentTrack?.name ?? '未选择歌曲'}
        </h2>
        <p className="text-blue-200">{currentTrack ? '正在播放' : '暂无音频'}</p>
      </div>

      {/* 进度条 - 没音频时禁用 */}
      <div className="mb-6">
        <input
          type="range"
          min="0"
          max={duration || 1}
          value={currentTime}
          onChange={handleSeek}
          disabled={!currentTrack}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider disabled:opacity-40"
        />
        <div className="flex justify-between text-sm text-blue-200 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 控制按钮 - 无音频时禁用 */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={previousTrack}
          disabled={currentTrackIndex === 0 || !currentTrack}
          className="disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <SkipBack className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={togglePlay}
          disabled={!currentTrack}
          className="disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
        </button>

        <button
          onClick={nextTrack}
          disabled={currentTrackIndex === playlist.length - 1 || !currentTrack}
          className="disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <SkipForward className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* 音量 - 同样禁用 */}
      <div className="flex items-center justify-center space-x-3">
        <button onClick={toggleMute} disabled={!currentTrack} className="disabled:opacity-40">
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          disabled={!currentTrack}
          className="disabled:opacity-40"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;