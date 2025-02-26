import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { successModalState } from '/src/recoil/atoms/modalState';

const MODAL_DURATION = 2000; // 3초 후 자동으로 닫힘

const SuccessModal = () => {
  const [SuccessModal, setSuccessModal] = useRecoilState(successModalState);
  const { isOpen, message, onCancel, isCancellable } = SuccessModal;

  // 모달 초기화 함수
  const resetModal = () => {
    setSuccessModal({
      isOpen: false,
      message: '',
      onCancel: null,
      isCancellable: false,
    });
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    resetModal();
  };

  // 자동 닫힘 타이머 설정
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        resetModal();
      }, MODAL_DURATION);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-x-0 bottom-8 flex justify-center items-center z-50">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 25, duration: 1.2 }}
            
          >
            <div className="bg-my-blue-1 rounded-2xl py-2 px-4 flex items-center gap-4 text-white tracking-wider shadow-lg shadow-black/10">
              <span>{message}</span>
              {isCancellable && (
                <button
                  onClick={handleCancel}
                  className="text-black bg-white rounded-full py-1 px-3  hover:text-my-blue-1 duration-300 "
                >
                  실행 취소
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;