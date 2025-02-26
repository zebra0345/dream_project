import { useRecoilValue } from "recoil";

import { challengeModalState } from "../../recoil/atoms/challenge/challengeDetailState";
import { isHideSideState } from "../../recoil/atoms/SidebarState";

import ChallengeListMyTagSorted from "../../components/challenge/challengeMainList/ChallengeListMyTagSorted";
import ChallengeListSearchSection from "../../components/challenge/challengeMainList/ChallengeListSearchSection";
import ChallengeListSearchResultSection from "../../components/challenge/challengeMainList/ChallengeListSearchResultSection";
import ChallengeListMoreMoreSection from "../../components/challenge/challengeMainList/ChallengeListMoreMoreSection";
import ChallengeDetailModal from "../../components/challenge/challengelist/ChallengeDetailModal";


export default function ChallengeListPage() {
  const isModalOpen = useRecoilValue(challengeModalState);
  const isHideSidebar = useRecoilValue(isHideSideState);
  return (
    <div className="flex justify-center bg-gray-100">
      <div className={`min-h-screen w-full bg-gray-100 py-12 ${isHideSidebar ? 'pl-6':'pl-20'}  pr-6 transition-[padding] ease-in-out duration-300 max-w-[1600px]`}>
        {/* 내 태그기반 챌린지리스트 */}
        <ChallengeListMyTagSorted/>
        {/* 챌린지 검색창+태그창 */}
        <ChallengeListSearchSection/>
        {/* 챌린지리스트 결과전부 */}
        <ChallengeListSearchResultSection/> 
        {/* 챌린지리스트 더보기 part */}
        <ChallengeListMoreMoreSection/>
        {/* 챌린지상세모달 */}
        {isModalOpen && <ChallengeDetailModal />}
      </div>
    </div>
  );
}