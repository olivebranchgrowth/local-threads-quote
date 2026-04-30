import { AnimatePresence, motion } from 'motion/react';

const SlideTransition = ({ children, keyProp, direction = 'left' }) => {
  const isBack = direction === 'right';

  return (
    <div className='absolute inset-0 w-full h-full overflow-hidden'>
      <AnimatePresence mode="wait">
        <motion.div
          key={keyProp}
          initial={{ x: isBack ? '-100%' : '100%', opacity: 0 }}
          animate={{ x: '0%', opacity: 1 }}
          exit={{ x: isBack ? '100%' : '-100%', opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
          className='relative z-10 w-full h-full'
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SlideTransition;
