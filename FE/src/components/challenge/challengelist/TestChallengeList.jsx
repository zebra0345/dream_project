import ChallengeDetailModal from "./ChallengeDetailModal";
import defaultImage from "/logo/dreammoa-bg.png";


// 더미 데이터 예시
const dummyChallenge = {
  imageUrl: defaultImage, // 챌린지 썸네일
  tags: ["#SSAFY", "#미라클모닝","#취업"], //태그 
  currentParticipants: 24, // 성공 일수
  maxParticipants: 30, // 총 일수
  goalParticipants: 28, // 목표일수
  title: "새벽 챌린지 5시까지", //제목 
  hostProfileImage: defaultImage, //프사 
  hostName: "김싸피", //이름 
  currentDay: 26, // 오늘 일차
  startDate: "2024-02-01", // 시작일자
  endDate: "2024-02-28", // 종료일자
  progressRate: 35, // 성공률인데, 성공일수/목표일수 로 계산하면될듯
  description: "매일 아침 5시까지 기상 인증하는 챌린지입니다. 사진으로 인증해주세요!",
};

// 사용 예시
export default function TestChallengeList({isModalOpen,setIsModalOpen,selectedChallenge}) {
  return (
    <>
      <ChallengeDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        challenge={dummyChallenge} // 이걸이제 api연결되면 selectedChallenge 로 변경하면됨
      />
    </>
  );
}