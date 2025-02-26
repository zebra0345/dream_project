import { useEffect, useState } from "react";
import challengeApi from "../../../services/api/challengeApi";
import ChallengeCard from "./ChallengeCard";
import { motion } from "framer-motion";
import { tagApi } from "../../../services/api/tagApi";
import { useNavigate } from "react-router-dom";

const getRepeatCount = (length) => {
  switch (length) {
    case 8: return 4;
    case 7: return 5;
    case 6: return 5;
    case 5: return 6;
    case 4: return 8;
    case 3: return 10;
    case 2: return 16;
    case 1: return 32;
    default: return 4;
  }
};

export default function ChallengeListMyTagSorted() {
  // 챌린지 목록 상태 관리
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myTags, setMyTags] = useState(null);
  const navigate = useNavigate();

  // 챌린지 데이터 가져오기
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        tagApi.getUserTags()
        const storedTags = localStorage.getItem('selectedTags');
        if (storedTags) {
          const parsedTags = JSON.parse(storedTags);
          setMyTags(parsedTags);
          // parsedTags를 직접 사용하여 API 호출
          const response = await challengeApi.getTagChallenges(parsedTags.join(','));
          setChallenges(response.data);
        }
      } catch (err) {
        setError('챌린지 목록을 불러오는데 실패했습니다.');
        console.log("챌린지목록 불러오기실패:",err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-lg"></p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full  flex items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  // Create 버튼 클릭 핸들러
  const handleCreateClick = () => {
    console.log('Create button clicked!');
    navigate('/challenge/create')
  };

  return (
    <>
      <div className="relative flex w-full h-60 cursor-default mt-5">
        {/* 왼쪽 Start Your Challenge 섹션 */}
        <div className="flex flex-col bg-my-blue-1 px-4 py-8 h-full justify-between items-center w-full sm:w-80 rounded-xl transition-all duration-300 sm:rounded-none sm:rounded-l-xl">
          <h1 className="text-5xl  font-bold text-[#FEFDD5] mb-2 select-none whitespace-nowrap tracking-wider">
            Start Your
          </h1>
          {/* 태그 리스트 */}
          <div className="flex gap-6 w-full justify-center">
            {myTags?.map((tag, index) => (
              <span
                key={index}
                style={{fontFamily:"mbc"}}
                className="px-3 py-0.5 text-gray-800 bg-hmy-blue-3 rounded-lg whitespace-nowrap text-lg font-medium select-none hover:scale-105 transition duration-300"
              >
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-5xl font-bold text-[#FEFDD5] select-none whitespace-nowrap tracking-wider">
            Challenge
          </h1>
          
        </div>

        {/* 오른쪽 카드 영역 (임시 검은색 배경) */}
        <div className="flex-1 bg-[#FEFDD5] rounded-r-lg mr-1 text-white 
          opacity-0 sm:opacity-100 invisible sm:visible transition duration-800 overflow-hidden"> {/* overflow-auto를 overflow-hidden으로 변경 */}
            <div className="w-full h-full flex items-center">
              <motion.div 
                className="flex gap-6"
                animate={{
                  x: [0, -((challenges.length) * 260*4)], // 각 카드의 너비(200) + gap(60)를 고려한 거리
                }}
                transition={{
                  duration: 660, // 애니메이션 지속 시간
                  repeat: Infinity, // 무한 반복
                  ease: "linear" // 일정한 속도로 이동
                }}
              >
                {[...Array(getRepeatCount(challenges.length))].map((_, index) => (
                  challenges.slice(0, 8).map((challenge) => (
                    <ChallengeCard 
                      key={`${challenge.challengeId}-${index}`} 
                      challenge={challenge}
                    />
                  ))
                ))}
              </motion.div>
            </div>
          </div>

        {/* Create 버튼 */}
        <div className="absolute -top-0 right-0 flex justify-center items-center bg-white rounded-t-lg rounded-bl-lg pr-1 
        opacity-0 md:opacity-100 invisible md:visible transition duration-300">
          <button
            onClick={handleCreateClick}
            className=" bg-gradient-to-b from-hmy-blue-1 to-hmy-blue-2 text-white text-2xl px-12 py-2 rounded-lg hover:bg-hmy-blue-1 transition-colors "
          >
            create
          </button>
        </div>
      </div>
    </>
  );
};