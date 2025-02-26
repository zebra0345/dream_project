import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { useTopLineBanner } from "../../../hooks/useTopLineBanner";

export default function TopLine() {
  const { showBanner, hideBanner } = useTopLineBanner();
  // 배너 콘텐츠의 실제 너비를 저장하는 상태
  const [contentWidth, setContentWidth] = useState(0);
  // 배너 콘텐츠의 실제 너비를 저장하는 상태
  const contentRef = useRef(null);
  
  // 배너에 표시될 내용
  const BannerContent = () => (
    <div className="flex items-center ">
      <span className="font-user-input text-sm">삼성청년 SW 아카데미 14기 모집 |</span>
      <span className="mx-4 font-user-input text-sm">모집기간 | 4월24일 ~5월8일</span>
      <span className="mx-4 font-user-input text-sm">장소 | 서울, 대전, 광주, 구미, 부울경(부산)</span>
    </div>
  );

  // 컴포넌트 마운트 시 콘텐츠의 실제 너비를 측정
  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.offsetWidth);
    }
  }, []);
  
  // 닫기버튼 누르면 안보이도록
  if (!showBanner) return null;

  return (
    <>
      <div className="w-full h-5 bg-my-blue-1 border-t flex items-center overflow-hidden whitespace-nowrap relative">
        <motion.div
          className="flex gap-4"
          animate={{
            x: [0, -contentWidth] // 너비많큼 왼쪽으로 이동
          }}
          transition={{
            duration: 80, // 80초동안 (text길이에 따라 변화줘야함 -> 나중에 너비를 이용한 값으로 변경하면 좋을듯)
            repeat: Infinity, // 무한 반복
            ease: "linear" // 속도일정
          }}
        >
          {/* 하나만하면 끊킴현상발생..... 이유모름 */}
          <span ref={contentRef} className="text-white px-4   tracking-wider flex cursor-default">
            <BannerContent />
            <BannerContent />
          </span>
          <span className="text-white px-4 flex cursor-default">
            <BannerContent />
            <BannerContent />
          </span>
          <span className="text-white px-4 flex cursor-default">
            <BannerContent />
            <BannerContent />
          </span>
        </motion.div>
        {/* 닫기 X 버튼 */}
        <button 
        onClick={hideBanner}
        className="absolute h-full right-0 text-white pl-3 pr-3 bg-my-blue-1">
        <HiMiniXMark />
      </button>
      </div>
    </>
  );
}