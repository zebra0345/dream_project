import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


// 별 하나를 표현하는 컴포넌트
const FallingStar = ({ delay }) => (
  <motion.div
    className="absolute text-yellow-100 text-sm opacity-50"
    initial={{ // 초기 위치와 스타일
      top: -20,
      left: `${Math.random() * 100}%`, // 랜덤한 X축 시작점
      opacity: 0,
      rotate: 0
    }}
    animate={{ // 애니메이션 종료 상태 
      top: "100vh",
      translateX: -500,  // 왼쪽아래방향으로 떨어지도록
      opacity: [0, 1, 1, 0], // 투명도 변화
      rotate: 360 // 회전
    }}
    transition={{ // 애니메이션 설정
      duration: 5,  
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    ⭐
  </motion.div>
 );
 
 export default function NotFound() {
  const navigate = useNavigate();
  const [stars, setStars] = useState([]); // 별들의 상태 관리
 
  // 1초마다 새로운 별 생성
  useEffect(() => {
    const interval = setInterval(() => {
      setStars(prev => [...prev, {
        id: Date.now(),
        delay: 0
      }]);
    }, 1000);
  
    return () => clearInterval(interval); // 컴포넌트 언마운트시 인터벌 제거
  }, []);
 
  return (
    // 전체 화면 컨테이너
    <div className="min-h-screen w-full bg-gradient-to-b from-hmy-blue-1 to-hmy-blue-2 flex items-center justify-center overflow-hidden relative">
      {/* 생성된 별들 렌더링 */}
      {stars.map(star => (
        <FallingStar key={star.id} delay={star.delay} />
      ))}
      
      <div className="text-center space-y-8 z-10">
        {/* 404 텍스트 애니메이션 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-9xl font-bold text-white opacity-80"
        >
          404
        </motion.div>
        
        {/* 에러 메시지 애니메이션 */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold text-white">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-gray-300">
            요청하신 페이지가 삭제되었거나 잘못된 경로입니다
          </p>
        </motion.div>
 
        {/* 홈으로 돌아가기 버튼 애니메이션 */}
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }} // 호버시 크기 증가
          whileTap={{ scale: 0.95 }} // 클릭시 크기 감소
          onClick={() => navigate("/")}
          className="px-8 py-3 bg-white rounded-lg text-hmy-blue-1 font-medium 
                     hover:bg-opacity-90 transition-colors"
        >
          홈으로 돌아가기
        </motion.button>
      </div>
    </div>
  );
 }