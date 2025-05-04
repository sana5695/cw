"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

export const AnimatedTitle = ({ 
  children, 
  animationKey 
}: { 
  children: ReactNode;
  animationKey: string;
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.h2 
        key={animationKey}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-bold text-[var(--color-bg-primary)] mb-1"
      >
        {children}
      </motion.h2>
    </AnimatePresence>
  );
};

export const AnimatedContent = ({ 
  children, 
  animationKey 
}: { 
  children: ReactNode;
  animationKey: string;
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const AnimatedButton = ({
  children,
  onClick,
  isDisabled,
  hoverEffect = true,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  isDisabled?: boolean;
  hoverEffect?: boolean;
  className: string;
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      whileHover={hoverEffect && !isDisabled ? { scale: 1.05 } : {}}
      whileTap={hoverEffect && !isDisabled ? { scale: 0.95 } : {}}
      className={className}
    >
      {children}
    </motion.button>
  );
}; 