import { motion } from 'framer-motion';

const LoadingModal = () => {
  return (
    <div >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-0 left-0 w-full h-full min-h-screen bg-white bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-[99]"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center"
        >
          <div className="mb-4">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-my-blue-1 border-t-transparent rounded-full"
            />
          </div>
          <p className="text-gray-700 text-lg font-medium">인증번호 발송 중...</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingModal;