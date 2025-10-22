import { motion } from 'framer-motion';
import Logo from './Logo';

const LoadingLogo = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Logo 
          className="scale-125" 
          iconClassName="text-primary h-12 w-12" 
          textClassName="text-gray-800 text-2xl" 
          showText={true}
        />
      </motion.div>
      
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-gray-600 text-lg"
      >
        {message}
      </motion.div>
      
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
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
            className="w-2 h-2 rounded-full bg-primary"
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingLogo;