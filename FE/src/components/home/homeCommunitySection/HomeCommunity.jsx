import { useState, useEffect, useRef  } from 'react'; // useEffect 추가
import { motion, useInView  } from 'framer-motion';
import { communityItems } from './HomeCommunityItemDummyData';  
import HomeCommunityItem from './HomeCommunityItems';
import { homeApi } from '../../../services/api/homeApi';
import m1 from "/peaples/m1.png";
import m2 from "/peaples/m2.jpeg";
import m3 from "/peaples/m3.jpeg";
import m4 from "/peaples/m4.jpeg";
import m5 from "/peaples/m5.jpeg";
import m6 from "/peaples/m6.jpeg";
import m7 from "/peaples/m7.jpeg";
import m8 from "/peaples/m8.jpeg";
import m9 from "/peaples/m9.jpeg";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const CARD_STYLES = [
  {
    bg: "bg-stone-300",
    textSize: "text-sm",
    initialPosition: { x: 50, y: 60 },
    avatarUrl: m1
  },
  {
    bg: "bg-yellow-300",
    textSize: "text-sm",
    initialPosition: { x: -10, y: 15 },
    avatarUrl: m2
  },
  {
    bg: "bg-violet-300",
    textSize: "text-lg",
    initialPosition: { x: -60, y: 65 },
    avatarUrl: m3
  },
  {
    bg: "bg-rose-300",
    textSize: "text-sm",
    initialPosition: { x: -10, y: -10 },
    avatarUrl: m4
  },
  {
    bg: "bg-yellow-300",
    textSize: "text-sm",
    initialPosition: { x: 60, y: 0 },
    avatarUrl: m5
  },
  {
    bg: "bg-yellow-300",
    textSize: "text-sm",
    initialPosition: { x: 140, y: -30 },
    avatarUrl: m6
  },
  {
    bg: "bg-cyan-300",
    textSize: "text-lg",
    initialPosition: { x: 50, y: -60 },
    avatarUrl: m7
  },
  {
    bg: "bg-orange-300",
    textSize: "text-lg",
    initialPosition: { x: -105, y: -40 },
    avatarUrl: m8
  },
  {
    bg: "bg-green-300",
    textSize: "text-xl",
    initialPosition: { x: 120, y: 20 },
    avatarUrl: m9
  }
];

export default function HomeCommunity() {
  // 보여줄 아이템 배열 상태
  const [displayedItems, setDisplayedItems] = useState([]);
  const [maxZ, setMaxZ] = useState(0);
  const [myNumber, setCount] = useState(0);
  const targetNumber = 1000;
  // 30% 뷰포트 상태일때 모션 시작
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true, // 여러번 트리거 허용
    amount: 0.3  // 30% 이상 보일 때 트리거
  });
  
  useEffect(() => {
    if (isInView) {
      // 애니메이션 설정값
      const duration = 3000;      // 총 애니메이션 시간 (3초)
      const frameDuration = 1000 / 60;  // 60fps 기준 프레임당 시간
      const totalFrames = duration / frameDuration;  // 총 프레임 수 계산
      const increment = targetNumber / totalFrames;  // 프레임당 증가값
      
      let currentFrame = 0;
      
      // 숫자 증가 애니메이션 시작
      const timer = setInterval(() => {
        currentFrame++;
        setCount(prev => {
          // 마지막 프레임에서 타이머 정지
          if (currentFrame === totalFrames) {
            clearInterval(timer);
            return targetNumber;
          }
          // 현재 프레임에 해당하는 숫자 계산
          return Math.min(Math.round(increment * currentFrame), targetNumber);
        });
      }, frameDuration);
      // 컴포넌트 언마운트 시 타이머 정리
      return () => clearInterval(timer);
    } else {
      // 뷰포트 밖으로 나가면 카운트 초기화
      setCount(0);
    }
   }, [isInView]); // isInView 상태 변경 시 재실행

  // useEffect 수정
  useEffect(() => {
    const fetchCommunityData = async () => {
      if (isInView) {
        try {
          const response = await homeApi.getRandomCommunity();
          // 받아온 데이터 중 9개만 선택하고 스타일 정보 추가
          const processedData = response.slice(0, 9).map((item, index) => ({
            id: item.postId,
            content: item.content.replace(/<[^>]*>/g, ''), // HTML 태그 제거
            nickname: item.userNickname,
            ...CARD_STYLES[index] // 미리 정의된 스타일 적용
          }));

          // 각 아이템을 0.5초 간격으로 추가
          processedData.forEach((item, index) => {
            setTimeout(() => {
              setDisplayedItems(prev => [...prev, item]);
            }, 300 * index);
          });
        } catch (error) {
          console.error('Failed to fetch community data:', error);
        }
      } else {
        setDisplayedItems([]);
      }
    };

    fetchCommunityData();
  }, [isInView]);

  return (
    <div className="flex justify-center py-6">
      <div className="relative w-full max-w-[1380px] min-h-[600px] bg-my-blue-2 rounded-lg p-8 overflow-hidden">
        <h2 className="text-white   mb-8 cursor-default select-none">
          <span className="text-4xl" style={{fontFamily:"mbc"}}>
          {myNumber.toLocaleString()}
          </span>
          <span className='text-2xl' style={{fontFamily:"mbc"}}>
            + 명의 학습자들과 함께해보세요
            </span>
        </h2>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {displayedItems.map((item) => ( // items 대신 displayedItems 사용
            <HomeCommunityItem 
              key={item.id}
              item={item}
              initialPosition={item.initialPosition}
              maxZ={maxZ}
              setMaxZ={setMaxZ}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}