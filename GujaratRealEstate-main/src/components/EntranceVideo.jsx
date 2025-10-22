import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EntranceVideo = ({ onComplete }) => {
    const [showFallback, setShowFallback] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);

    useEffect(() => {
        // With compressed video (700KB), reduce timeout to 3 seconds
        const fallbackTimer = setTimeout(() => {
            if (!videoReady) {
                console.log('Video not ready after 3 seconds, showing fallback');
                setShowFallback(true);
                // Auto-proceed to main site after showing fallback
                setTimeout(() => {
                    onComplete();
                }, 2000);
            }
        }, 3000);

        return () => clearTimeout(fallbackTimer);
    }, [onComplete, videoReady]);

    const handleSkip = () => {
        onComplete();
    };

    if (showFallback) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center"
            >
                <div className="text-white text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-4">
                            Gujarat Estate Agency
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Your Trusted Real Estate Partner in Mumbai
                        </p>
                        <div className="flex justify-center space-x-2 mb-8">
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
                                    className="w-3 h-3 rounded-full bg-white"
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

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
                    className="w-full h-full object-contain"
                    muted
                    playsInline
                    preload="auto"
                    poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiBmaWxsPSIjMDAwMDAwIi8+Cjx0ZXh0IHg9Ijk2MCIgeT0iNTQwIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0OCIgZm9udC1mYW1pbHk9IkFyaWFsIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkd1amFyYXQgRXN0YXRlIEFnZW5jeTwvdGV4dD4KPHN2Zz4="
                    onEnded={() => {
                        setTimeout(() => onComplete(), 500);
                    }}
                    onError={(e) => {
                        console.error('Video failed to load:', e.target.error);
                        setShowFallback(true);
                    }}
                    onLoadStart={() => {
                        console.log('Video loading started');
                        setVideoReady(false);
                    }}
                    onCanPlay={(e) => {
                        console.log('Video can play');
                        setVideoReady(true);
                        // Try to play the video once it's ready
                        if (!userInteracted) {
                            const video = e.target;
                            video.play().catch((error) => {
                                console.warn('Autoplay failed:', error);
                                setUserInteracted(true); // Show play button
                            });
                        }
                    }}
                    onLoadedData={() => {
                        console.log('Video data loaded');
                    }}
                    onPlay={() => {
                        console.log('Video started playing');
                    }}
                    ref={(video) => {
                        if (video && videoReady && !userInteracted) {
                            video.play().catch(() => {
                                setUserInteracted(true);
                            });
                        }
                    }}
                >
                    <source src="/videos/entrance.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Play Button (when autoplay fails) */}
                {userInteracted && videoReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center text-white">
                            <button
                                onClick={() => {
                                    const video = document.querySelector('video');
                                    if (video) {
                                        video.play();
                                        setUserInteracted(false);
                                    }
                                }}
                                className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors mb-4"
                            >
                                ▶ Play Video
                            </button>
                            <div>
                                <button
                                    onClick={handleSkip}
                                    className="text-white/70 hover:text-white transition-colors text-sm underline"
                                >
                                    Skip to Website
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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

                {/* Loading indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ delay: 2, duration: 0.5 }}
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