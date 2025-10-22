import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EntranceVideo = ({ onComplete }) => {
  const videoRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Auto-play the video
      video.play().catch(console.error);
      
      // Set up event listener for when video ends
      const handleVideoEnd = () => {
        setVideoEnded(true);
        // Wait a moment then complete
        setTimeout(() => {
          onComplete();
        }, 500);
      };

      video.addEventListener('ended', handleVideoEnd);
      
      // Cleanup
      return () => {
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [onComplete]);

  const handleSkip = () => {
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      >
        {/* Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          muted
          playsInline
          preload="auto"
        >
          <source src="/videos/entrance.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Skip Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleSkip}
          className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors text-sm bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm"
        >
          Skip →
        </motion.button>

        {/* Loading fallback */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-white text-center"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading...</p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EntranceVideo;