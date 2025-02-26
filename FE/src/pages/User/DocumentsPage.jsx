// import SideChatbar from "../../components/challenge/chatbar/SideChatbar";
// import EndButton from "../../components/challenge/finish/EndButton";
import { Link } from "react-router-dom";
import testlogo from "/logo/testlogo.png";
import testlogochallengecreate from "/logo/dreammoa-bg.png";

import testlogoforopenvidu from "/logo/testlogoforopenvidu.png";
import testlogochallengelist from "/stars/star7.png";
import CallThePoliceModal from "../../components/common/modal/CallThePoliceModal";
import { useState } from "react";
import { useRecoilValue } from 'recoil';
import { selectedTagsState } from '/src/recoil/atoms/tags/selectedTagsState';
import TagSelector from "../../components/common/tags/TagSelector";
// import TestForAiStt from "../../components/test/TestForAiStt";

export default function DocumentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedTags = useRecoilValue(selectedTagsState);
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-10 p-4 flex justify-start">
        <Link to="/">
          <img src={testlogo} alt="로고" className="h-10 w-auto" />
        </Link>
        <Link to="/challenge/create">
          <img src={testlogochallengecreate} alt="챌린지 만들기 바로가기" className="h-10 w-auto" />
        </Link>
        <Link to="/challenge/list">
          <img src={testlogochallengelist} alt="챌린지 리스트 바로가기" className="h-10 w-auto" />
        </Link>
        <Link to="/video">
          <img src={testlogoforopenvidu} alt="openvidu바로가기" className="h-10 w-auto" />
        </Link>
      </div>
      {/* <EndButton/>
      <SideChatbar/> */}
      <div className="min-h-screen w-full bg-gray-200 flex flex-col gap-10 items-center justify-center">
        <p>documents</p>

        {/* 신고테스트 */}
        <CallThePoliceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportType="USER" // "POST", "USER", "COMMENT", "CHALLENGE"
        targetId="1" // 여기 api연동 (게시글id,댓글id,챌린지id) 꼭! 게시글먼저쓴뒤에 신고테스트
        />
        <button onClick={() => setIsModalOpen(true)}>
          신고하기테스트버튼
        </button>

        {/* 테그테스트 */}
        <div>
          <h2>선택된 태그:</h2>
          <div className="flex gap-2">
            {selectedTags.map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-blue-500 text-white rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <TagSelector/>
        {/* <TestForAiStt/> */}
        

      </div>
    </>
  );
}