import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { homeApi } from "../../services/api/homeApi";
import dreammoaLogo from "/logo/dreammoa.png";

// 랜덤한 별 생성 함수
const generateStars = (count) => {
  return Array.from({ length: count }, () => ({
    width: Math.random() * 3 + 1, // 1-4px 크기의 별
    left: Math.random() * 100, // 0-100% 위치
    top: Math.random() * 100, // 0-100% 위치
    delay: Math.random() * 3, // 0-3초 딜레이
  }));
};

// 밤하늘 별 생성 (200개의 별)
const stars = generateStars(200);

// 별 빛나는 배경 컴포넌트
const StarryBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {stars.map((star, i) => (
      <div
        key={i}
        className="absolute bg-white/70 rounded-full animate-twinkle"
        style={{
          width: `${star.width}px`,
          height: `${star.width}px`,
          left: `${star.left}%`,
          top: `${star.top}%`,
          animationDelay: `${star.delay}s`,
        }}
      />
    ))}
  </div>
);

const SplashScreen = ({ onComplete, setFinalHours, forceComplete }) => {
  const [count, setCount] = useState(0);
  const [animationStep, setAnimationStep] = useState(1); // 1: 숫자, 2: 텍스트, 3: 로고
  const [isCountingDone, setIsCountingDone] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // 전체 컴포넌트의 표시 여부
  const animationDuration = 4;

  // body scroll 제어
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (forceComplete && !isCountingDone) {
      setIsCountingDone(true);
    }
  }, [forceComplete, isCountingDone]);

  // 메인 애니메이션 로직
  useEffect(() => {
    const fetchAndSetupAnimation = async () => {
      try {
        const totalMinutes = await homeApi.getTotalScreenTime();
        const hours = Math.round(totalMinutes / 3600);
        setFinalHours(hours);

        // 카운터 애니메이션
        const step = hours / (animationDuration * 60);
        const interval = setInterval(() => {
          setCount((prev) => {
            if (prev >= hours || forceComplete) {
              clearInterval(interval);
              setIsCountingDone(true);
              return hours;
            }
            return prev + step;
          });
        }, 1000 / 60);
        return () => clearInterval(interval);
      } catch (error) {
        console.error("Failed to setup animation:", error);
        onComplete();
      }
    };

    fetchAndSetupAnimation();
  }, [onComplete, setFinalHours, forceComplete]);

  // 단계별 애니메이션 전환
  useEffect(() => {
    if (isCountingDone) {
      // 숫자 -> 텍스트 전환
      const textTimer = setTimeout(() => {
        setAnimationStep(2);
      }, 700);

      // 텍스트 -> 로고 전환
      const logoTimer = setTimeout(() => {
        setAnimationStep(3);
      }, 3500);

      // 로고 깜빡임 후 페이드아웃 시작
      const startExitTimer = setTimeout(() => {
        setIsVisible(false); // 페이드아웃 시작
      }, 5000);

      // 페이드아웃이 완료된 후 컴포넌트 제거
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 6500); // 페이드아웃 시간 고려하여 지연

      return () => {
        clearTimeout(textTimer);
        clearTimeout(logoTimer);
        clearTimeout(startExitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isCountingDone, onComplete]);

  // 로고 깜빡임 효과
  const logoAnimation = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 1, 0.3, 1, 0.3, 1],
    },
    exit: { opacity: 0 },
    transition: {
      duration: 1.2,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      ease: "easeInOut",
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-my-blue-1 flex items-center justify-center z-[1000] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <StarryBackground />

          <AnimatePresence mode="wait">
            {animationStep === 1 && (
              <motion.div
                key="counter"
                className="text-white text-[12rem] font-bold z-10 flex items-center justify-center whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="w-[28rem] text-right " >
                  {Math.floor(count).toLocaleString()}
                </div>
                <div className="ml-4 text-[7rem]" style={{fontFamily:"mbc"}}>시간</div>
              </motion.div>
            )}

            {animationStep === 2 && (
              <motion.div
                key="text"
                className="text-center z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-white text-6xl mb-4 font-medium" style={{fontFamily:"mbc"}}>
                  꿈을 모으다
                </div>
                <div className="text-white text-8xl font-extrabold tracking-wider" style={{fontFamily:"mbc"}}>
                  DreamMoA
                </div>
              </motion.div>
            )}

            {animationStep === 3 && (
              <motion.img
                key="logo"
                src={dreammoaLogo}
                alt="DreamMoa Logo"
                className="w-[32rem] h-auto z-10"
                {...logoAnimation}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
