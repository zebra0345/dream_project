import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import ChallengeCard from "./ChallengeCard";
import "../../../styles/scrollbar-hide.css";
import { homeApi } from "../../../services/api/homeApi";
import ChallengeDetailModal from "../../challenge/challengelist/ChallengeDetailModal";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { challengeModalState, selectedChallengeState } from "../../../recoil/atoms/challenge/challengeDetailState";
import challengeApi from "../../../services/api/challengeApi";
// import { mockApiResponse } from '../../../utils/mockData';

const ChallengeCarousel = () => {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const carouselRef = useRef(null);
  const controls = useAnimation();
  const isModalOpen = useRecoilValue(challengeModalState);
  const setModalOpen = useSetRecoilState(challengeModalState);
  const setSelectedChallenge = useSetRecoilState(selectedChallengeState);



  const clickChallengeDetail = async (challenge) => {
    try {
      // 챌린지 상세 정보 불러오기
      const response = await challengeApi.getChallengeDetailInfo(challenge.challengeId);
      
      // 상세 정보를 Recoil 상태에 저장
      setSelectedChallenge(response.data);
      
      // 모달 열기
      setModalOpen(true);
    } catch (error) {
      console.error('챌린지 상세 정보 로딩 실패:', error);
    }
  }

  // 애니메이션 로직
  const startCarouselAnimation = useCallback(() => {
    if (!carouselRef.current) return;

    // 카드 하나의 너비 계산 (마진 포함)
    const cardWidth = carouselRef.current.children[0].offsetWidth - 20; // gap-3 = 12px
    // 전체 이동 거리 계산 (카드 개수 * 카드 너비)
    const totalWidth = cardWidth * challenges.length;

    controls.start({
      x: [0, -totalWidth],
      transition: {
        duration: 30, // 고정된 duration 값 (초 단위)
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
        type: "tween",
        restSpeed: 0.5,
        repeatDelay: 0,
      },
    });
  }, [controls, challenges.length]);

  // 챌린지 데이터가 로드되거나 화면 크기가 변경될 때 애니메이션 재시작
  useEffect(() => {
    if (challenges.length > 0) {
      startCarouselAnimation();
    }

    // 화면 크기 변경 시 애니메이션 재시작
    const handleResize = () => {
      startCarouselAnimation();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [startCarouselAnimation, challenges]);

  // fetchChallenges 함수는 동일
  const fetchChallenges = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await homeApi.getEndingSoonChallenges();
      if (Array.isArray(response)) {
        setChallenges(response);
      } else {
        console.error("Expected array of challenges, got:", response);
        setChallenges([]);
      }
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
      setChallenges([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (challenges.length === 0) {
    return <div>No challenges available</div>;
  }

  return (
    <div className="w-full h-[400px]  flex items-center overflow-hidden">
      <motion.div
        ref={carouselRef}
        className="flex -ml-5"
        animate={controls}
        style={{
          willChange: "transform",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          WebkitPerspective: 1000,
          perspective: 1000,
          WebkitTransform: "translateZ(0)",
          transform: "translateZ(0)",
          pointerEvents: "none",
        }}
      >
        {/* 더 부드러운 움직임을 위해 카드 개수 3배로 증가 */}
        {[...Array(3)].map((_, arrayIndex) =>
          challenges.map((challenge, index) => (
            <motion.div
              key={`${challenge.challengeId}-${index}-${arrayIndex}`}
              className="flex-none w-56 sm:w-60 md:w-64 -mr-3"
              initial={{ rotate: Math.random() * 6 - 3 }}
              whileHover={{
                y: -10,
                scale: 1.01,
                rotate: 0,
                zIndex: 10,
                transition: {
                  y: { type: "spring", stiffness: 300, damping: 20 },
                  scale: { type: "spring", stiffness: 300, damping: 20 },
                  rotate: { type: "spring", stiffness: 300, damping: 20 },
                },
              }}
              style={{
                WebkitBackfaceVisibility: "hidden",
                backfaceVisibility: "hidden",
                pointerEvents: "auto",
              }}
            >
              <div onClick={() => clickChallengeDetail(challenge)}>
              <ChallengeCard challenge={challenge} index={index} />
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
      {isModalOpen && <ChallengeDetailModal />}
    </div>
  );
};

export default ChallengeCarousel;
