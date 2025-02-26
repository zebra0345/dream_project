import { motion } from 'framer-motion';
import { useState } from 'react';

const itemVariants = {
  initial: { 
    opacity: 0,
    x: 0,
    y: 0,
    scale: 0.3  // 시작할 때 작은 크기로
  },
  animate: (initialPosition) => ({
    opacity: 1,
    scale: 1,   // 원래 크기로 돌아옴
    x: initialPosition.x + '%',
    y: initialPosition.y + '%',
    transition: {
      duration: 0.8,     // 전체 애니메이션 지속 시간
      opacity: {         // opacity만 따로 설정
        duration: 0.4    // opacity는 좀 더 빠르게
      },
      scale: {          // scale만 따로 설정
        type: "spring",  // 스프링 효과 적용
        stiffness: 100,  // 탄성 강도 (높을수록 빠르게 안정화)
        damping: 20,     // 감쇠 (높을수록 덜 튕김)
        mass: 1         // 무게감 (영향력 조절)
      },
      x: {              // x축 이동에 대한 설정
        type: "spring",
        stiffness: 100,
        damping: 30
      },
      y: {              // y축 이동에 대한 설정
        type: "spring",
        stiffness: 100,
        damping: 30
      }
    }
  })
};

export default function HomeCommunityItem({ item, initialPosition, maxZ, setMaxZ }) {
  const [zIndex, setZIndex] = useState(1);
  const handleDragStart = () => {
    const newZ = maxZ + 1;
    setMaxZ(newZ);
    setZIndex(newZ);
  };
  // console.log(item);
  
  return (
    <motion.div
      className={`absolute w-60 p-4 rounded-lg shadow-lg cursor-move ${item.bg} h-[200px]`}
      style={{ 
        left: '35%',
        top: '35%',
        transform: 'translate(-50%, -50%)',  // 이 부분 추가
        zIndex: zIndex,

      }}
      variants={itemVariants}
      initial="initial"
      animate="animate"
      custom={initialPosition}
      drag
      dragConstraints={{
        left: -400,
        right: 600,
        top: -140,
        bottom: 100,
      }}
      dragTransition={{     
        power: 0.2,        // 관성의 힘 (기본값 0.8)
        timeConstant: 100   // 관성이 유지되는 시간 (밀리초)
      }}
      onDragStart={handleDragStart}
      dragElastic={0.1}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`flex flex-col gap-3  h-full justify-between`}>
        <p className={`${item.textsize} text-gray-600 line-clamp-5 overflow-hidden`}>{item.content}</p>
        <div className='flex  space-x-3 items-center'>
          <img 
            src={item.avatarUrl} 
            alt={item.userNickname}
            className="w-8 h-8 rounded-full"
          />
          {/* <p>{item.avatarUrl}</p> */}
          <p className="font-medium text-sm " style={{fontFamily:"mbc"}}>{item.nickname}</p>
        </div>
      </div>
    </motion.div>
  );
}