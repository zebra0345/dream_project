import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import TestChallengeList from "../challenge/challengelist/TestChallengeList";
import challengeApi from "../../services/api/challengeApi";
// 기본 이미지
import defaultChallengeImage from "/logo/dreammoa-bg.png";
import ChallengeDetailModal from "../challenge/challengelist/ChallengeDetailModal";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { challengeModalState, selectedChallengeState } from "../../recoil/atoms/challenge/challengeDetailState";


export default function ChallengeImages() {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isModalOpen = useRecoilValue(challengeModalState);
  const setModalOpen = useSetRecoilState(challengeModalState);
  const setSelectedChallenge = useSetRecoilState(selectedChallengeState);
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);



  useEffect(() => {
    fetchChallenges();
  }, []);

  // placeholder
  const placeholderVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  // 컴포넌트 마운트 시 챌린지 데이터 가져오기
  const fetchChallenges = async () => {
    try {
      const data = await challengeApi.getMyParticipatingChallenges();
      
      setChallenges(
        data.map((challenge) => ({
          ...challenge,
          id: challenge.challengeId,
          // 썸네일 url 사용
          src: challenge.thumbnail || defaultChallengeImage,
          isOn: challenge.isActive,
        }))
      );
    } catch (error) {
      console.error("챌린지 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = async (item) => {
    console.log(`Clicked challenge no.${item.id}`);
    try {
      // 챌린지 상세 정보 불러오기
      const response = await challengeApi.getChallengeDetailInfo(item.id);
      
      // 상세 정보를 Recoil 상태에 저장
      setSelectedChallenge(response.data);
      
      // 모달 열기
      console.log(response.data);
      
      setModalOpen(true);
      
    } catch (error) {
      console.error('챌린지 상세 정보 로딩 실패:', error);
    }
  };

  // 챌린지 탈퇴
  const handleLeaveChallenge = async (challengeId) => {
    if (
      window.confirm(
        "정말로 챌린지를 탈퇴하시겠습니까? 모든 기록이 삭제됩니다."
      )
    ) {
      try {
        await challengeApi.leaveChallenge(challengeId);
        // 챌린지 목록 새로고침
        fetchChallenges();
      } catch (error) {
        console.error("챌린지 탈퇴 실패:", error);
        alert("챌린지 탈퇴에 실패했습니다.");
      }
    }
  };

  // 로딩 중일 때 표시할 스켈레톤 UI
  if (isLoading) {
    return <div className="animate-pulse">로딩 중...</div>;
  }

  // 참여 중인 챌린지가 없는 경우
  if (challenges.length === 0) {
    return (
      <div className="relative">
        {/* Go 버튼 */}
        <div className="absolute right-0 -top-16">
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="px-8 py-2 rounded-full bg-my-blue-1 text-white font-bold tracking-wider text-xl"
            onClick={() => navigate("/challenge/list")}
          >
            go
          </motion.button>
        </div>

        <div className="w-full bg-white rounded-3xl border-2 border-gray-300 p-4">
          <motion.p className="text-gray-500 text-lg text-center py-8">
            관심 있는 챌린지를 찾아보세요
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute right-0 -top-16">
        <motion.button
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className={`relative z-10 px-8 py-2 rounded-full duration-300 font-bold tracking-wider text-xl
            ${
              isEditMode
                ? "bg-my-yellow bg-opacity-50 text-black hover:bg-opacity-80"
                : "bg-my-blue-1 text-white"
            }`}
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? "completed" : "leave"}
        </motion.button>
      </div>

      <div
        className="rounded-3xl bg-white border-2 border-gray-300 py-12 grid duration-500
                grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12
                px-6 sm:px-12 md:px-16 lg:px-24"
      >
        {challenges?.map((item) => (
          <div key={item.id} className="cursor-pointer relative">
            <h3 className="text-xl truncate">{item.title}</h3>
            <div
              className={`w-6 h-6 rounded-full ring-2 ring-white
                absolute top-5 -right-2 z-10 duration-300
                ${
                  item.isOn
                    ? "bg-green-400 hover:bg-green-500"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
            />

            {isEditMode && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 
                          bg-red-500 text-white px-4 py-1.5 rounded-full 
                          text-base font-light hover:bg-red-600 
                          transition-colors duration-300 shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLeaveChallenge(item.id);
                }}
              >
                leave
              </motion.button>
            )}

            <div className="aspect-video overflow-hidden rounded-xl">
              <img
                src={item.src}
                alt={item.title}
                onClick={() => !isEditMode && handleImageClick(item)}
                className="w-full h-full border rounded-xl object-cover
                          transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 챌린지 상세모달 */}
      {/* <TestChallengeList
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedChallenge={selectedChallenge}
      /> */}
      {isModalOpen && <ChallengeDetailModal />}
    </div>
  );
};