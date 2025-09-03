import React from 'react';
import AudioPlayer from './components/AudioPlayer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎵 音频播放器
          </h1>
          <p className="text-blue-200">
            支持本地文件上传和在线链接播放
          </p>
        </div>
        <AudioPlayer />
      </div>
    </div>
  );
}

export default App;