import React from 'react';
import { Music, Trash2, Play } from 'lucide-react';
import { AudioTrack } from '../types/audio';

interface PlaylistManagerProps {
  playlist: AudioTrack[];
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
  onRemoveTrack: (index: number) => void;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  playlist,
  currentTrackIndex,
  onSelectTrack,
  onRemoveTrack
}) => {
  if (playlist.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
        <Music className="w-12 h-12 text-white/50 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">播放列表为空</h3>
        <p className="text-blue-200">添加一些音频文件开始播放吧！</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Music className="w-6 h-6 mr-2" />
        播放列表 ({playlist.length})
      </h3>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {playlist.map((track, index) => (
          <div
            key={track.id}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all cursor-pointer ${
              index === currentTrackIndex
                ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50'
                : 'bg-white/5 hover:bg-white/10'
            }`}
            onClick={() => onSelectTrack(index)}
          >
            {/* 播放指示器 */}
            <div className="flex-shrink-0">
              {index === currentTrackIndex ? (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white ml-0.5" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{index + 1}</span>
                </div>
              )}
            </div>

            {/* 音频信息 */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">{track.name}</h4>
              <p className="text-blue-200 text-sm">
                {track.type === 'file' ? '本地文件' : '在线链接'}
              </p>
            </div>

            {/* 删除按钮 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveTrack(index);
              }}
              className="flex-shrink-0 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistManager;