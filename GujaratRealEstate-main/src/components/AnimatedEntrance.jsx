import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const AnimatedEntrance = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const steps = [
            { delay: 0, duration: 1000 },      // Logo fade in
            { delay: 1200, duration: 800 },   // Company name
            { delay: 2200, duration: 800 },   // Tagline
            { delay: 3200, duration: 600 }    // Final animation
        ];

        const timers = steps.map((step, index) => 
            setTimeout(() => setCurrentStep(index + 1), step.delay)
        );

        // Auto complete after all animations
        const completeTimer = setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => onComplete(), 500);
        }, 4000);

        return () => {
            timers.forEach(timer => clearTimeout(timer));
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    const handleSkip = () => {
        setIsComplete(true);
        setTimeout(() => onComplete(), 300);
    };

    if (isComplete) {
        return (
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-50 bg-gradient-to-br from-primary to-blue-800"
            />
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center overflow-hidden"
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    {/* Floating Circles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-white/10"
                            style={{
                                width: Math.random() * 100 + 50,
                                height: Math.random() * 100 + 50,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                x: [0, Math.random() * 20 - 10, 0],
                                opacity: [0.1, 0.3, 0.1],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                                ease: "easeInOut"
                            }}
                        />
                    ))}

                    {/* Gradient Waves */}
                    <motion.div
                        className="absolute inset-0 opacity-20"
                        animate={{
                            background: [
                                "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
                                "linear-gradient(135deg, transparent, rgba(255,255,255,0.1), transparent)",
                                "linear-gradient(225deg, transparent, rgba(255,255,255,0.1), transparent)",
                                "linear-gradient(315deg, transparent, rgba(255,255,255,0.1), transparent)"
                            ]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>

                {/* Main Content */}
                <div className="relative text-white text-center z-10">
                    {/* Logo Animation */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={currentStep >= 1 ? { 
                            scale: 1, 
                            rotate: 0, 
                            opacity: 1 
                        } : {}}
                        transition={{ 
                            duration: 0.8, 
                            type: "spring", 
                            stiffness: 100,
                            damping: 15
                        }}
                        className="mb-8"
                    >
                        <div className="relative">
                            <Logo 
                                className="scale-150" 
                                variant="white"
                                iconClassName="h-16 w-16"
                                textClassName="text-3xl"
                                showText={false}
                            />
                            
                            {/* Pulsing Ring Around Logo */}
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-white/30"
                                animate={currentStep >= 1 ? {
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 0, 0.3]
                                } : {}}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </div>
                    </motion.div>

                    {/* Company Name */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={currentStep >= 2 ? { y: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            <motion.span
                                animate={currentStep >= 2 ? {
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                                } : {}}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent"
                                style={{ backgroundSize: "200% 100%" }}
                            >
                                Gujarat Estate Agency
                            </motion.span>
                        </h1>
                    </motion.div>

                    {/* Tagline */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={currentStep >= 3 ? { y: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    >
                        <p className="text-xl md:text-2xl text-blue-100 mb-8">
                            Your Trusted Real Estate Partner in Mumbai
                        </p>
                    </motion.div>

                    {/* Loading Animation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={currentStep >= 4 ? { opacity: 1 } : {}}
                        transition={{ duration: 0.4 }}
                        className="flex justify-center space-x-2"
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-3 h-3 rounded-full bg-white"
                                animate={currentStep >= 4 ? {
                                    y: [0, -15, 0],
                                    backgroundColor: ["#ffffff", "#fbbf24", "#ffffff"]
                                } : {}}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </motion.div>
                </div>

                {/* Skip Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    onClick={handleSkip}
                    className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors text-sm bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-black/30"
                >
                    Skip →
                </motion.button>

                {/* Progress Bar */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-white rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(currentStep / 4) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AnimatedEntrance;