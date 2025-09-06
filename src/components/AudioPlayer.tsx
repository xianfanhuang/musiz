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
  <div className="max-w-4xl mx-auto">
    <audio ref={audioRef} />

    {/* 主播放器 - 始终显示 */}
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20">
      {/* 封面 / 歌曲信息 */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Music className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">
          {currentTrack?.name ?? '未选择歌曲'}
        </h2>
        <p className="text-blue-200">
          {currentTrack ? '正在播放' : '暂无音频'}
        </p>
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <input
          type="range"
          min="0"
          max={duration || 1}
          value={currentTime}
          onChange={handleSeek}
          disabled={!currentTrack}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider disabled:opacity-40 disabled:cursor-not-allowed"
        />
        <div className="flex justify-between text-sm text-blue-200 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={previousTrack}
          disabled={!currentTrack || currentTrackIndex === 0}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <SkipBack className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={togglePlay}
          disabled={!currentTrack}
          className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white ml-1" />
          )}
        </button>

        <button
          onClick={nextTrack}
          disabled={!currentTrack || currentTrackIndex === playlist.length - 1}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <SkipForward className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* 音量控制 */}
      <div className="flex items-center justify-center space-x-3">
        <button onClick={toggleMute} disabled={!currentTrack} className="text-white hover:text-blue-200 transition-colors disabled:opacity-40">
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
          className="w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider disabled:opacity-40"
        />
      </div>
    </div>

    {/* 添加音频按钮 - 始终可见 */}
    <div className="flex justify-center space-x-4 mb-6">
      <button
        onClick={() => setShowUpload(true)}
        className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
      >
        <Upload className="w-5 h-5" />
        <span>上传文件</span>
      </button>

      <button
        onClick={() => setShowUrlInput(true)}
        className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
      >
        <Link className="w-5 h-5" />
        <span>添加链接</span>
      </button>
    </div>

    {/* 播放列表 */}
    <PlaylistManager
      playlist={playlist}
      currentTrackIndex={currentTrackIndex}
      onSelectTrack={selectTrack}
      onRemoveTrack={removeTrack}
    />

    {/* 模态框 */}
    {showUpload && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">上传音频文件</h3>
            <button onClick={() => setShowUpload(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <FileUpload onFileSelect={addTrack} onClose={() => setShowUpload(false)} />
        </div>
      </div>
    )}

    {showUrlInput && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">添加音频链接</h3>
            <button onClick={() => setShowUrlInput(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <UrlInput onUrlAdd={addTrack} onClose={() => setShowUrlInput(false)} />
        </div>
      </div>
    )}
  </div>
);
