import { useRecoilState } from 'recoil';
import { 
  popularChallengesState, 
  runningChallengesState, 
  recruitingChallengesState 
} from '../../../recoil/atoms/challenge/challengeListState';
import ChallengeCardForSearchList from "./ChallengeCardForSearchList";
import { useEffect, useState } from 'react';
import { SlArrowDownCircle } from "react-icons/sl";


export default function ChallengeListSearchResultSection() {
  // 챌린지 목록 상태 관리
  const [runningChallenges, setRunningChallenges] = useRecoilState(runningChallengesState);
  const [recruitingChallenges, setRecruitingChallenges] = useRecoilState(recruitingChallengesState);
  const [popularChallenges, setPopularChallenges] = useRecoilState(popularChallengesState);
  const [maxCards, setMaxCards] = useState(8);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMaxCards(8);      // lg
      else if (window.innerWidth >= 768) setMaxCards(6);  // md
      else if (window.innerWidth >= 640) setMaxCards(4);  // sm
      else setMaxCards(2);                                // default
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  return (
    <>
      <div className="relative flex  flex-col w-full cursor-default mt-5">
        {/* 진행중 */}
        {runningChallenges.length !== 0 ? (
          <div style={{fontFamily:"mbc"}}  className="w-40 text-white text-xl px-12 py-2 flex justify-center  hover:text-gray-100 transition-all duration-200 bg-my-blue-1 px-4 h-10 items-center rounded-lg transition-all duration-300 ">
            진행 중
          </div>
        ) : (
          <>
            {/* <div className="w-40 text-white text-xl px-12 py-2 flex justify-center  hover:text-gray-100 transition-all duration-200 bg-my-blue-1 px-4 h-10 items-center rounded-lg transition-all duration-300 ">
              running empty
            </div> */}
          </>
        )}
        {/* 오른쪽 카드 영역 (임시 검은색 배경) */}
        <div className="mb-5 flex-1   rounded-r-lg mr-1 text-black-800 pt-3 transition duration-800 "> {/* overflow-auto를 overflow-hidden으로 변경 */}
          {runningChallenges.length !== 0 ? (
            <div className="w-full  gap-4  h-full grid grid-template-rows-[repeat(2,1fr)] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  items-center justify-items-center">
              {runningChallenges  
                .slice(0, maxCards)
                .map((challenge) => (
                  <ChallengeCardForSearchList 
                    key={`${challenge.challengeId}`} 
                    challenge={challenge}
                  />
              ))}
            </div>
          ): (
            <>
              {/* <div className="bg-green-100 flex justify-center items-center w-full h-96 gap-4">
                content empty
              </div> */}
            </>
          )}
        </div>

        {/* 모집중 */}
        <div style={{fontFamily:"mbc"}} className="w-40 text-white   text-xl px-12 py-2 flex justify-center  hover:text-gray-100 transition-all duration-200 bg-my-blue-1 px-4 h-10 items-center rounded-lg transition-all duration-300 ">
          모집 중
        </div>
        {/* 오른쪽 카드 영역 (임시 검은색 배경) */}
        <div className="mb-5 flex-1   rounded-r-lg mr-1 text-black-800 pt-3 transition duration-800 "> {/* overflow-auto를 overflow-hidden으로 변경 */}
          {recruitingChallenges.length !== 0 ? (
            <div className="w-full  gap-4  h-full grid grid-template-rows-[repeat(2,1fr)] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  items-center justify-items-center">
              {recruitingChallenges  
                .slice(0, maxCards)
                .map((challenge) => (
                  <ChallengeCardForSearchList 
                    key={`${challenge.challengeId}`} 
                    challenge={challenge}
                  />
              ))}
            </div>
          ): (
            <div className="bg-white flex justify-center items-center w-full h-96 gap-4">
              content empty
            </div>
          )}
        </div>

        {/* 전체보기 (인기순) */}
        <div style={{fontFamily:"mbc"}} className="w-40 text-white text-xl px-12 py-2 flex justify-center  hover:text-gray-100 transition-all duration-200 bg-my-blue-1 px-4 h-10 items-center rounded-lg transition-all duration-300 ">
          전체 보기
        </div>
        {/* 오른쪽 카드 영역 (임시 검은색 배경) */}
        <div className="mb-5 flex-1   rounded-r-lg mr-1 text-black-800 pt-3 transition duration-800 "> {/* overflow-auto를 overflow-hidden으로 변경 */}
          {popularChallenges.length !== 0 ? (
            <div className="w-full  gap-4 h-full grid grid-template-rows-[repeat(2,1fr)] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  items-center justify-items-center">
              {popularChallenges  
                .slice(0, maxCards)
                .map((challenge) => (
                  <ChallengeCardForSearchList 
                    key={`${challenge.challengeId}`} 
                    challenge={challenge}
                  />
              ))}
            </div>
          ): (
            <div className="bg-white flex justify-center items-center w-full h-96 gap-4">
              content empty
            </div>
          )}
        </div>

      </div>
    </>
  );
};