import React, { useState } from 'react';
import VideoUploader from './components/VideoUploader';
import Editor from './components/Editor';
import { VideoClip, ProcessingState } from './types';
import { analyzeVideoContent } from './services/geminiService';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [processingState, setProcessingState] = useState<ProcessingState>({ status: 'IDLE' });

  const handleFileSelect = async (file: File) => {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    
    setProcessingState({ status: 'ANALYZING' });

    try {
      // Call AI Service
      const detectedClips = await analyzeVideoContent(file);
      
      if (detectedClips.length === 0) {
        setProcessingState({ status: 'ERROR', message: "No suitable clips found. Try a different video." });
      } else {
        setClips(detectedClips as VideoClip[]); // Ensure ID is present
        setProcessingState({ status: 'COMPLETE' });
      }
    } catch (err) {
      console.error(err);
      setProcessingState({ status: 'ERROR', message: "Failed to analyze video." });
    }
  };

  const handleReset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoFile(null);
    setVideoUrl(null);
    setClips([]);
    setProcessingState({ status: 'IDLE' });
  };

  // Render Logic
  return (
    <div className="h-screen w-screen bg-dark-900 text-white flex flex-col font-sans">
      
      {processingState.status === 'IDLE' && (
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
             <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px]"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="z-10 text-center mb-12 max-w-2xl px-4">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
              Turn Long Videos into <br/>
              <span className="text-brand-400">Viral Shorts</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              AI-powered clipper that finds the best moments, adds vertical formatting, 
              and generates beautiful captions instantly.
            </p>
          </div>

          <div className="z-10 w-full px-4">
            <VideoUploader onFileSelect={handleFileSelect} />
          </div>
        </div>
      )}

      {processingState.status === 'ANALYZING' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full"></div>
            <Loader2 size={64} className="text-brand-500 animate-spin relative z-10" />
          </div>
          <h2 className="text-2xl font-bold mt-8">Analyzing Content...</h2>
          <p className="text-gray-400 mt-2 max-w-md text-center">
            Gemini is watching your video, identifying viral moments, <br/>and generating captions.
          </p>
          <div className="mt-8 flex gap-2 items-center text-sm text-brand-300 bg-brand-900/30 px-4 py-2 rounded-full border border-brand-500/30">
            <Sparkles size={16} />
            <span>Detecting "Aha!" moments</span>
          </div>
        </div>
      )}

      {processingState.status === 'ERROR' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="p-4 bg-red-500/20 rounded-full mb-6 text-red-400">
            <AlertTriangle size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
          <p className="text-gray-400 mb-8">{processingState.message}</p>
          <button 
            onClick={handleReset}
            className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {processingState.status === 'COMPLETE' && videoUrl && (
        <Editor 
          videoUrl={videoUrl} 
          clips={clips} 
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default App;