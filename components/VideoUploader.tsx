import React, { useCallback, useState } from 'react';
import { UploadCloud, Film, AlertCircle } from 'lucide-react';

interface VideoUploaderProps {
  onFileSelect: (file: File) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndPassFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  const validateAndPassFile = (file: File) => {
    // Check type
    if (!file.type.startsWith('video/')) {
      setError("Please upload a valid video file.");
      return;
    }
    // Check size (Increased to 200MB as requested)
    if (file.size > 200 * 1024 * 1024) {
      setError("File is too large for this demo (Max 200MB).");
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div 
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragging 
            ? 'border-brand-500 bg-brand-500/10 scale-[1.02]' 
            : 'border-brand-300/30 bg-dark-800/50 hover:border-brand-400 hover:bg-dark-800'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-brand-500/20 text-brand-400 mb-2">
            <UploadCloud size={48} />
          </div>
          <h3 className="text-2xl font-bold text-white">Upload your video</h3>
          <p className="text-gray-400 max-w-md">
            Drag and drop your MP4, MOV, or WEBM file here. 
            We'll use AI to find the best viral moments.
          </p>
          
          <label className="mt-4 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg cursor-pointer transition-colors shadow-lg shadow-brand-900/50">
            Browse Files
            <input 
              type="file" 
              className="hidden" 
              accept="video/*"
              onChange={handleFileInput}
            />
          </label>
          
          <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
            <Film size={14} />
            <span>Supported formats: MP4, MOV, WEBM (Max 200MB)</span>
          </div>

          {error && (
            <div className="absolute -bottom-16 left-0 right-0 p-3 bg-red-500/10 border border-red-500/50 text-red-200 rounded-lg flex items-center justify-center gap-2 text-sm animate-fade-in">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoUploader;