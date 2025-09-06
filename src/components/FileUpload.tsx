import React, { useRef } from 'react';
import { Upload, FileAudio } from 'lucide-react';
import { AudioTrack } from '../types/audio';

interface FileUploadProps {
  onFileSelect: (track: AudioTrack) => void;
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* 统一校验函数 */
  const isAudioFile = (file: File): boolean => {
    const allowedExt = ['mp3', 'm4a', 'wav', 'flac', 'aac', 'ogg'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ext ? allowedExt.includes(ext) : false;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isAudioFile(file)) {
      alert('请选择音频文件（mp3/m4a/wav/flac/aac/ogg）');
      return;
    }

    const url = URL.createObjectURL(file);
    const track: AudioTrack = {
      id: Date.now().toString(),
      name: file.name.replace(/\.[^/.]+$/, ''),
      url,
      type: 'file',
      file
    };

    onFileSelect(track);
    onClose();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file && isAudioFile(file)) {
      const url = URL.createObjectURL(file);
      const track: AudioTrack = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        url,
        type: 'file',
        file
      };
      onFileSelect(track);
      onClose();
    } else {
      alert('请拖拽音频文件（mp3/m4a/wav/flac/aac/ogg）');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-4">
      {/* 拖拽区域 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <FileAudio className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">拖拽音频文件到这里</p>
        <p className="text-sm text-gray-500">或点击选择文件</p>
        <p className="text-xs text-gray-400 mt-2">
          支持 MP3, M4A, WAV, FLAC, AAC, OGG
        </p>
      </div>

      {/* 隐藏的文件输入：accept 放宽 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/mp4,.mp3,.m4a,.wav,.flac,.aac,.ogg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 选择文件按钮 */}
      <div className="text-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors mx-auto"
        >
          <Upload className="w-5 h-5" />
          <span>选择文件</span>
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
