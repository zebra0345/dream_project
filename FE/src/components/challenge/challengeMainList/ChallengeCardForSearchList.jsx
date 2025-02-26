import { useSetRecoilState } from "recoil";
import challengeApi from "../../../services/api/challengeApi";
import { challengeModalState, selectedChallengeState } from "../../../recoil/atoms/challenge/challengeDetailState";
import { FaUser } from "react-icons/fa6";

// components/common/ChallengeCard.jsx
export default function ChallengeCard({ challenge }) {
  const setModalOpen = useSetRecoilState(challengeModalState);
  const setSelectedChallenge = useSetRecoilState(selectedChallengeState);

  const { title, thumbnail, tags , currentParticipants, maxParticipants,isActive,startDate,expireDate } = challenge;  

  const formattedStartDate = startDate.split('T')[0].substring(5).replace('-', '/');  // "2025-02-06"
  const formattedExpireDate = expireDate.split('T')[0].substring(5).replace('-', '/');  // 마찬가지로 날짜만 추출
  const today = new Date();
  const start = new Date(startDate);
  const dayDifference  = Math.floor((today - start) / (1000 * 60 * 60 * 24)) ; 
  const currentDay = dayDifference < 0 ? -dayDifference : dayDifference+1; // 오늘몇일차
  const isSetup = dayDifference < 0 ? true : false; // 오늘몇일차

  const cardDetail = async () => {
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

  return (
    <div className="w-full flex-shrink-0 "
    onClick={cardDetail}> {/* 카드 너비 고정 및 축소 방지 */}
      <div className="w-full h-[240px] rounded-lg overflow-hidden  group cursor-pointer"> {/* 고정 높이 설정 */}
        {/* 썸네일 이미지 */}
        <div className="h-[200px] flex  flex-col relative bg-cover bg-center bg-no-repeat rounded-xl "
          style={{ backgroundImage: `url(${thumbnail})` }}>
          {/* 좌상단 인원수 */}
          <div className="absolute top-1 left-2 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition duration-300 ease-in">
            <div className="px-4  text-sm gap-2 font-medium rounded-lg bg-black/65 text-gray-200 flex items-start pt-1">
            <FaUser /> {currentParticipants} / {maxParticipants}
            </div>
          </div>
          {/* 우상단 d-day */}
          <div className="absolute top-1 right-2 flex flex-wrap gap-1.5 opacity-100 group-hover:opacity-0 transition duration-300 ease-in">
            <div className={`px-4  text-md font-medium rounded-lg  ${isSetup? 'bg-rose-500/80 px-3 rounded-full text-gray-100 ':'bg-black/65 text-white '}`}>
              {isSetup ? 'D - ':''}{currentDay}{isSetup ? '':'일차'}
            </div>
          </div>
          <div className="absolute top-1 right-2 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition duration-300 ease-in">
            <div className={`px-4  text-md font-medium rounded-lg  ${isSetup? 'bg-black/65 px-3 rounded-full text-gray-100 ':'bg-black/65 text-white '}`}>
              {formattedStartDate} - {formattedExpireDate}
            </div>
          </div>
          {/* 우하단 태그 */}
          <div className="absolute bottom-1 right-2 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition duration-300 ease-in">
            {tags.slice(0, 3).map((tag, index) => (
              <span 
              key={index}
              className="px-4  text-md font-medium rounded-lg bg-black/65 text-white"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        {/* 제목 영역 - 맨 아래로 밀어내기 위해 margin-top: auto 사용 */}
        <div className="mt-auto pl-2  rounded-b-xl">
          <h3 className="text-gray-800 text-md font-medium line-clamp-2 ">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}