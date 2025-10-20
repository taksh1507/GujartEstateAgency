import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoEnded(true);
      setTimeout(() => {
        onComplete();
      }, 1000); // Additional delay for fade out
    }, 4000); // 4 second video duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: videoEnded ? 0 : 1 }}
      transition={{ duration: 1 }}
    >
      {/* Video Background */}
      <video
        autoPlay
        muted
        className="absolute inset-0 w-full h-full object-cover"
        onEnded={() => setVideoEnded(true)}
      >
        <source src="/src/assets/videos/loader.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
      </video>

      {/* Overlay Content */}
      <motion.div
        className="relative z-10 text-center text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Gujarat Estate Agency
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-xl text-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          Your Trusted Real Estate Partner in Kandivali
        </motion.p>
      </motion.div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
    </motion.div>
  );
};

export default LoadingScreen;