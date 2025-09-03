import React, { useState } from 'react';
import { Link, Plus } from 'lucide-react';
import { AudioTrack } from '../types/audio';

interface UrlInputProps {
  onUrlAdd: (track: AudioTrack) => void;
  onClose: () => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ onUrlAdd, onClose }) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);

    try {
      // 验证URL是否为有效的音频链接
      const audio = new Audio();
      
      await new Promise((resolve, reject) => {
        audio.onloadedmetadata = resolve;
        audio.onerror = reject;
        audio.src = url;
      });

      // 创建音频轨道对象
      const track: AudioTrack = {
        id: Date.now().toString(),
        name: name.trim() || extractNameFromUrl(url),
        url: url.trim(),
        type: 'url'
      };

      onUrlAdd(track);
      onClose();
    } catch (error) {
      alert('无法加载该音频链接，请检查URL是否正确');
    } finally {
      setIsLoading(false);
    }
  };

  const extractNameFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop() || 'Unknown Track';
      return filename.replace(/\.[^/.]+$/, ''); // 移除扩展名
    } catch {
      return 'Unknown Track';
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    // 自动提取文件名作为默认名称
    if (newUrl && !name) {
      setName(extractNameFromUrl(newUrl));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
          音频链接
        </label>
        <div className="relative">
          <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="url"
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://example.com/audio.mp3"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          显示名称 (可选)
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="自定义音频名称"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={!url.trim() || isLoading}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>添加</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default UrlInput;