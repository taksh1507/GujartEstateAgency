import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Mail, X, Plus } from 'lucide-react';

const FloatingActionButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const contactOptions = [
        {
            icon: Phone,
            label: 'Call Us',
            action: () => window.open('tel:+919876543210'),
            color: 'bg-green-500 hover:bg-green-600',
            delay: 0.1
        },
        {
            icon: MessageCircle,
            label: 'WhatsApp',
            action: () => window.open('https://wa.me/919876543210?text=Hi, I am interested in your properties'),
            color: 'bg-green-600 hover:bg-green-700',
            delay: 0.2
        },
        {
            icon: Mail,
            label: 'Email',
            action: () => window.open('mailto:info@gujaratestate.com'),
            color: 'bg-blue-500 hover:bg-blue-600',
            delay: 0.3
        }
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-16 right-0 space-y-3"
                    >
                        {contactOptions.map((option, index) => (
                            <motion.button
                                key={option.label}
                                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                                transition={{ delay: option.delay, duration: 0.2 }}
                                onClick={option.action}
                                className={`flex items-center gap-3 ${option.color} text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 group`}
                                whileHover={{ scale: 1.05, x: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <option.icon className="h-5 w-5" />
                                <span className="text-sm font-medium whitespace-nowrap">
                                    {option.label}
                                </span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main FAB Button */}
            <motion.button
                onClick={toggleMenu}
                className="bg-primary hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {isOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Plus className="h-6 w-6" />
                    )}
                </motion.div>
            </motion.button>

            {/* Pulsing ring animation when closed */}
            {!isOpen && (
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            )}
        </div>
    );
};

export default FloatingActionButton;