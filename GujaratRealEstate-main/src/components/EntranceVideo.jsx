import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';
import Logo from './Logo';

const EntranceVideo = ({ onComplete, autoPlay = true }) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    if (videoEnded) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [videoEnded, onComplete]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const skipIntro = () => {
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video Background */}
        <video
          autoPlay={autoPlay}
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
          onEnded={handleVideoEnd}
          poster="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop&q=80"
        >
          {/* Local entrance video - replace with your actual video */}
          <source src="/videos/entrance.mp4" type="video/mp4" />
          
          {/* Fallback video sources */}
          <source
            src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"
            type="video/mp4"
          />
        </video>

        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Logo 
                className="scale-200 mb-8" 
                variant="white"
                iconClassName="h-16 w-16"
                textClassName="text-4xl"
                showText={true}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-white text-center"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Welcome to Gujarat Estate Agency
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Your trusted partner in Mumbai real estate
              </p>
              
              {/* Loading Animation */}
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -10, 0],
                      backgroundColor: ["#3b82f6", "#f59e0b", "#3b82f6"]
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                    className="w-3 h-3 rounded-full bg-primary"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Video Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4"
            >
              <button
                onClick={togglePlay}
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
              >
                <Play className={`h-5 w-5 ${isPlaying ? 'opacity-50' : 'opacity-100'}`} />
              </button>
              
              <button
                onClick={toggleMute}
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              
              <button
                onClick={skipIntro}
                className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors font-medium"
              >
                Skip Intro
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip Button (Always Visible) */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={skipIntro}
          className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors text-sm"
        >
          Skip →
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

export default EntranceVideo;