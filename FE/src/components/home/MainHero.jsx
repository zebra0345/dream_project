import { useEffect, useRef, useState } from "react";
import { homeApi } from "../../services/api/homeApi";

// 랜덤한 별 생성
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

const MainHero = () => {
  // 총 스크린 타임 관리할 상태
  const [totalHours, setTotalHours] = useState(0);

  //★☆★☆★☆★☆★☆★☆그라데이션☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆
  const [opacity, setOpacity] = useState(0);
  const [isScrolledPast, setIsScrolledPast] = useState(false);
  const componentGradationRef = useRef(null);
  useEffect(() => {
    // 스크롤 이벤트 핸들러 함수
    const handleScroll = () => {
      // 컴포넌트의 현재 뷰포트 상대 위치 계산
      const componentTop = componentGradationRef.current.getBoundingClientRect().top;
      // 브라우저 창의 높이 가져오기
      const windowHeight = window.innerHeight;
      // 컴포넌트의 실제 높이 가져오기
      const componentHeight = componentGradationRef.current.clientHeight;
      // 컴포넌트의 중간 지점 위치 계산
      const componentMiddle = componentTop + (componentHeight*2) / 2;
      // 컴포넌트 중간 지점이 뷰포트 내에 있고, 아직 지나지 않았을 때
      if (componentMiddle < windowHeight && !isScrolledPast) {
        setIsScrolledPast(true);  // 지난 상태로 표시
        setOpacity(1);            // 배경을 불투명하게 설정
      } 
      // 컴포넌트 중간 지점이 뷰포트 위로 올라가고, 이미 지난 상태일 때
      else if (componentMiddle >= windowHeight && isScrolledPast) {
        setIsScrolledPast(false); // 지나지 않은 상태로 표시
        setOpacity(0);            // 배경을 투명하게 설정
      }
    };
    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);
    // 컴포넌트 언마운트 시 이벤트 리스너 제거 (메모리 누수 방지)
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolledPast]); // isScrolledPast가 변경될 때마다 effect 재실행
  //★☆★☆★☆★☆★☆★☆그라데이션☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆

  useEffect(() => {
    // 초기 데이터 로딩
    const fetchTotalScreenTime = async () => {
      try {
        const totalMinutes = await homeApi.getTotalScreenTime();
        // 분 단위를 시간 단위로 변환 (소수점 첫째자리까지 표시)
        const hoursValue = Number((totalMinutes / 3600).toFixed(0));
        setTotalHours(hoursValue);
      } catch (error) {
        console.error("Error fetching total screen time:", error);
        // 에러 시 기본값도 시간 단위로 변환 (150000분 → 2500시간)
        setTotalHours(2500);
      }
    };
    fetchTotalScreenTime();
    const interval = setInterval(fetchTotalScreenTime, 30000);

    return () => clearInterval(interval);
  }, []);




  return (
    <section className="relative h-screen bg-gradient-to-b from-hmy-blue-1 to-my-blue-1 text-white overflow-hidden" ref={componentGradationRef}>
      <StarryBackground />
      <div 
        className="absolute inset-0 w-full h-full bg-white" // 절대위치 tblr-0설정 즉 전체화면
        style={{
          opacity: opacity,         // 상태값에 따른 투명도 설정
          transition: 'opacity 1s ease', // 1초 동안 변경
        }}
      >
      </div>
      <div className="container mx-auto h-full px-10 flex items-center justify-center ">
        <div className="text-center space-y-8 z-10">
          <h1 className="font-bold text-my-yellow">
            <span className="text-[66px] block mb-0 tracking-wider select-none" style={{fontFamily:"mbc"}}>
              우리의 꿈이 모인지
            </span>
            <div className="whitespace-nowrap block -mt-5">
              <span className="text-[135px] tracking-wider inline-block animate-sparkle select-none">
                {totalHours.toLocaleString()}
              </span>
              <span className="text-[98px] font-thin tracking-wider inline-block select-none " style={{fontFamily:"mbc"}}>
                시간째
              </span>
            </div>
          </h1>
          <div className="flex items-center justify-center whitespace-nowrap mt-12">
            <span className="text-[32px] text-my-blue-3 font-bold tracking-wider select-none">
              DreamMoA
            </span>
            <span className="text-[26px] text-my-blue-3 ml-2 tracking-wider select-none" style={{fontFamily:"mbc"}}>
              에서 당신의 꿈을 이뤄보세요
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
export default MainHero;
