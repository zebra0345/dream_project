import { useSetRecoilState } from "recoil";
import challengeApi from "../../../services/api/challengeApi";
import { challengeModalState, selectedChallengeState } from "../../../recoil/atoms/challenge/challengeDetailState";

// components/common/ChallengeCard.jsx
export default function ChallengeCard({ challenge }) {
  const { title, thumbnail, tags } = challenge;
  const setModalOpen = useSetRecoilState(challengeModalState);
  const setSelectedChallenge = useSetRecoilState(selectedChallengeState);


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
    <div className="w-[300px] flex-shrink-0 "
    onClick={cardDetail}> {/* 카드 너비 고정 및 축소 방지 */}
      <div className="w-full h-[200px] rounded-lg overflow-hidden hover:scale-105 transition duration-200 ease-in"> {/* 고정 높이 설정 */}
        {/* 태그 영역 */}
        <div className="pb-1 pl-2 flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag, index) => (
            <span 
            key={index}
            className="px-4 py-0.5 text-md font-medium rounded-full bg-my-blue-1 text-white"
            >
              #{tag}
            </span>
          ))}
        </div>
        {/* 썸네일 이미지 */}
        <div className="h-[150px] flex  flex-col bg-cover bg-center bg-no-repeat rounded-xl "
          style={{ backgroundImage: `url(${thumbnail})` }}>
          {/* 제목 영역 - 맨 아래로 밀어내기 위해 margin-top: auto 사용 */}
          <div className="mt-auto pl-2 py-1 bg-white bg-white/70 rounded-b-xl">
            <h3 className="text-gray-800 text-xl font-medium line-clamp-2 ">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}