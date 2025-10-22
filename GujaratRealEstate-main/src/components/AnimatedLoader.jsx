import { motion } from 'framer-motion';
import Logo from './Logo';

const AnimatedLoader = ({ message = "Loading...", size = "default" }) => {
    const sizeClasses = {
        small: "h-8 w-8",
        default: "h-12 w-12", 
        large: "h-16 w-16"
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            {/* Animated Logo */}
            <motion.div
                animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                }}
                transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                }}
                className="mb-4"
            >
                <Logo 
                    iconClassName={sizeClasses[size]}
                    showText={false}
                />
            </motion.div>

            {/* Loading Dots */}
            <div className="flex space-x-2 mb-4">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-3 h-3 bg-primary rounded-full"
                        animate={{
                            y: [0, -10, 0],
                            backgroundColor: ["#3b82f6", "#f59e0b", "#3b82f6"]
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Loading Text */}
            <motion.p
                className="text-gray-600 text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                {message}
            </motion.p>

            {/* Progress Bar */}
            <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden mt-4">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                />
            </div>
        </div>
    );
};

export default AnimatedLoader;