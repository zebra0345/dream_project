import { useEffect, useRef, useState } from 'react';
// import ReviewMain from './ReviewMain';
import VideoSection from '../videoSection/VideoSection';

export default function ReviewGradation() {
  // opacity 상태값 (0: 완전 투명, 1: 완전 불투명)
  const [opacity, setOpacity] = useState(0);
  // 컴포넌트의 중간 지점을 지났는지 여부를 추적하는 상태값
  const [isScrolledPast, setIsScrolledPast] = useState(false);
  // DOM 요소를 참조하기 위한 ref 생성
  const componentGradationRef = useRef(null);
  const c1 = [0, 52, 88];    // 그라데이션 시작 색상
  const c2 = [15, 15, 20];   // 그라데이션 끝 색상

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
      const componentMiddle = componentTop + componentHeight / 2;
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

  return (
    <div ref={componentGradationRef} className="h-[1000px] relative">
      {/* 그라데이션 배경 div */}
      <div 
        className="absolute inset-0 w-full h-full" // 절대위치 tblr-0설정 즉 전체화면
        style={{
          // footer 참고함
          background: `radial-gradient(ellipse at center, 
            rgb(${c1[0]}, ${c1[1]}, ${c1[2]}) 0%, 
            rgba(${c2[0]}, ${c2[1]}, ${c2[2]}, 1) 100%)`,
          opacity: opacity,         // 상태값에 따른 투명도 설정
          transition: 'opacity 1s ease', // 1초 동안 변경
        }}
      >
      </div>
      {/* 실제내용div (배경보다 위에 z-10) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10" >
        {/* <ReviewMain/> */}
        <VideoSection/>
      </div>
    </div>
  );
}