import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { FaUser } from "react-icons/fa6";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { challengeModalState, selectedChallengeState } from '../../../recoil/atoms/challenge/challengeDetailState';
import { useEffect, useState } from 'react';
import challengeApi from '../../../services/api/challengeApi';
import { useNavigate } from "react-router-dom";


///////////////////////////// 이건 메인함수 아니고 성공률 모션 분리한거
const ProgressRing = ({ progress }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-20 h-20"
    >
      <svg className="transform -rotate-90 w-20 h-20">
        <circle
          className="text-gray-200"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
        <motion.circle
          className={`${progress > 70 ? 'text-rose-500' : 'text-blue-500'}`}
          strokeWidth="4"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2 }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{progress}%</span>
      </div>
    </motion.div>
  );
};

//////////////////////// 이게 메인 함수
export default function ChallengeDetailModal() {
  const [myChallenges, setMyChallenges] = useState([]);
  const isModalOpen = useRecoilValue(challengeModalState);
  const setModalOpen = useSetRecoilState(challengeModalState);
  const selectedChallenge  = useRecoilValue(selectedChallengeState);
  const navigate = useNavigate();

  // 매게변수 분리 
  const {
    challengeId, // +
    title,
    description,
    currentParticipants, //현재참가신청자 -> 어뜨카지? >>> 나중에 + 현재참가자
    maxParticipants, // 최대인원
    // isPrivate, // 이거 어뜨케 비밀방
    // createdAt, // 생성날 X X 사용안함
    startDate, // 시작일 "2025-02-06T00:00:00"
    expireDate, // 끝날짜
    isActive, // + on off
    standard, // 목표일수
    thumbnail, // 썸네일
    message, // + 버튼 눌렀을때 에러메세지 
    challengeTags, // 태그 ["a","b"]
    token, // + 입장버튼 눌렀을때 openVidu연결이 아니고 애초에 openvidu화면에서 어쩌지
    // activeParticipants, //현재active참가자 -> 어뜨카지? >>> 나중에 + 현재참가자
    // hostProfileImage, // 방장 프사 -> 제거
    // hostName, // 방장 이름 -> 제거
    // progressRate, // 몇퍼센트 성공 35 -> 다른 api
  } = selectedChallenge;
  // 삭제예정
  const activeParticipants = 2 
  // 계산 필요한 변수
  const formattedStartDate = startDate.split('T')[0];  // "2025-02-06"
  const formattedExpireDate = expireDate.split('T')[0];  // 마찬가지로 날짜만 추출
  const today = new Date();
  const start = new Date(startDate);
  const ending = new Date(expireDate);
  const dayDifference  = Math.floor((today - start) / (1000 * 60 * 60 * 24)) ; 
  const totalDate  = Math.floor((ending - start) / (1000 * 60 * 60 * 24)) ; 
  const currentDay = dayDifference < 0 ? -dayDifference : dayDifference+1; // 오늘몇일차
  const isSetup = dayDifference < 0 ? true : false; // 오늘몇일차
  const progressRate = isSetup ? Math.round(100 * currentParticipants/ maxParticipants) : Math.round(100 * currentDay/ totalDate)
  const isMyChallenge = myChallenges.includes(challengeId);

  const getButtonText = (isSetup, isMyChallenge) => {
    if (isSetup) {
      return isMyChallenge ? "챌린지 대기중" : "챌린지 신청하기";
    } else {
      return isMyChallenge ? "챌린지 입장하기" : "챌린지 참가하기";
    }
  };
  // 버튼 클릭 핸들러를 결정하는 함수
  const StartChallenge = (isSetup, isMyChallenge) => {
    console.log("챌린지디테일 버튼클릭" , isSetup,isMyChallenge);
    
  // 조건에 따른 함수를 직접 실행하는 방식으로 변경
  if (isSetup && isMyChallenge) {
    console.log('대기중입니다');
    return;
  }
  
  if (isSetup) {
    handleApplyChallenge();  // 신청하기
    return;
  }
  
  if (isMyChallenge) {
    handleEnterChallenge();  // 입장하기
    return;
  }
  
  handleJoinChallenge();     // 참가하기
  };

  const handleApplyChallenge = async () => {
    // 챌린지 신청 로직
    console.log('챌린지 신청하기 ');
    try {
      // 챌린지 상세 정보 불러오기
      const response = await challengeApi.joinChallenge(challengeId);
      console.log("메세지도착: ",response.message);
      
    } catch (error) {
      console.error('챌린지 신청하기 실패:', error);
    }
    setModalOpen(false)
  };

  const handleJoinChallenge = async () => {
    // 챌린지 참가 로직
    console.log('챌린지 참가하기');
    try {
      // 챌린지 상세 정보 불러오기
      const response = await challengeApi.joinChallenge(challengeId);
      console.log("메세지도착: ",response.message);
      navigate(`/video/${challengeId}`);
      // const response = await challengeApi.enterChallenge();
      // console.log("메세지도착: ",response.message);
      
    } catch (error) {
      console.error('챌린지 참가하기 실패:', error);
    }
    setModalOpen(false)
  };

  const handleEnterChallenge = async () => {
    // 챌린지 입장 로직
    console.log('챌린지 입장하기');
    try {
      // 챌린지 상세 정보 불러오기
      navigate(`/video/${challengeId}`);
      // const response = await challengeApi.enterChallenge();
      // console.log("메세지도착: ",response.message);
      
    } catch (error) {
      console.error('챌린지 입장하기 실패:', error);
    }
    setModalOpen(false)
  };

  // 컴포넌트 마운트 시 챌린지 데이터 가져오기
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await challengeApi.getMyParticipatingChallenges();
        // 최대 7개까지만 표시하고, challengeId만 추출하여 저장
        setMyChallenges(data.map(challenge => challenge.challengeId));
      } catch (error) {
        console.error('나의 챌린지 로딩 실패:', error);
      }
    };
    fetchChallenges();
  }, []);
  
  if (!isModalOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-white bg-opacity-70 backdrop-blur-sm"
      onClick={() => setModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden max-h-[90vh] "
        onClick={e => e.stopPropagation()}
      >
        {/* 상단 이미지 section */}
        <div className="relative h-[200px] w-full overflow-hidden ">
          {/* 이미지 */}
          <div className="w-full h-full bg-black">
            {thumbnail && (  // thumbnail 없으면 검은배경 
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
          
          {/* 종료버튼 */}
          <button 
            onClick={() => setModalOpen(false)}
            className="absolute right-4 top-4 text-white z-10 hover:rotate-90 transition-transform duration-300"
          >
            <X size={24} />
          </button>

          {/* 태그 */}
          <div className="absolute top-4 left-4 flex gap-2 ">
            {challengeTags?.map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ 
                  delay: index * 0.1,     // 초기 애니메이션에만 delay 적용
                  type: "spring",         // 초기 애니메이션 타입
                  hover: {
                    delay: 0,             // hover에는 delay 없음
                    duration: 0.2,        // hover 지속시간
                    type: "tween"         // hover 애니메이션 타입
                  }
                }}
                className="cursor-default select-none bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm border border-white/30 "
              >
                <span className=''>{tag}</span>
              </motion.span>
            ))}
          </div>
          

          {/* 이미지section좌하단 제목 및 방장프사 닉네임  */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex justify-between">
            <h2 className="text-2xl font-bold tracking-wider mb-2 cursor-default select-none">{title}</h2>
              {/* 방장프사 + 방장이름 제거 */}
              {/* <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                  <img
                    src={hostProfileImage}
                    alt={hostName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm">{hostName}</span>
              </div> */}
              {/* 이미지section우하단 참가중인원 */}
              <div className='cursor-default select-none hover:scale-105 duration-300 transition'>
                <motion.div 
                  className="text-center"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <span className="inline-block bg-rose-500 text-white px-4 py-2 rounded-full text-sm flex gap-1">
                    <FaUser /> {currentParticipants} / {maxParticipants} <span style={{fontFamily:"mbc"}}>참가중</span>
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        


        {/* 나머지 이미지 아랫부분 info section */}
        <div className="px-6 pt-6 space-y-4">
          {/* 상단 성공률 및 목표 등 */}
          <div className="flex items-center justify-between cursor-default select-none">
            {/* 성공률 */}
            <ProgressRing progress={progressRate} />
            {/* 목표일수 */}
            <div style={{fontFamily:"mbc"}} className="text-2xl font-bold text-my-blue-1">목표 {standard}일</div>
            {/* 오늘일수 총일수 */}
            <div className="text-right flex flex-col items-center">
              <div style={{fontFamily:"mbc"}} 
              className={`text-2xl font-bold  flex justify-center hover:scale-105 transition duration-300 
                ${isSetup? 'mb-1 bg-rose-500 px-3 rounded-full text-gray-100 ':'text-my-blue-1'}`}>
                {isSetup ? 'D-':'오늘 '}{currentDay}{isSetup ? '':'일차'}
              </div>
              <div className="text-sm text-gray-500">총 {totalDate}일</div>
            </div>
          </div>

          {/* 시작일 종료일 */}
          <div className="bg-gray-50 rounded-xl px-4 cursor-default select-none">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">시작일</div>
                <div className="font-medium">{formattedStartDate}</div>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">종료일</div>
                <div className="font-medium">{formattedExpireDate}</div>
              </div>
            </div>
          </div>

          {/* 설명 */}
          <div className="relative cursor-default select-none">
            <div className="absolute inset-0  rounded-xl opacity-10"></div>
            <div className="relative bg-white rounded-xl p-4 border border-gray-200">
              <h3 style={{fontFamily:"mbc"}} className="tracking-wider font-semibold mb-2 text-my-blue-2">챌린지 설명</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>

          {/* 버튼 */}
          {/* 
          시작전(isSetup : true) + 참가전(isMyChallenge : false) : 챌린지 신청하기
          시작전(isSetup : true) + 참가완료(isMyChallenge : true) : 챌린지 대기중
          시작후(isSetup : false) + 참가전(isMyChallenge : false) : 챌린지 참가하기
          시작후(isSetup : false) + 참가완료(isMyChallenge : true) : 챌린지 입장하기 
          */}
          <button 
          onClick={() => {StartChallenge(isSetup, isMyChallenge)}}
          className="w-full bg-gradient-to-b from-hmy-blue-1 to-hmy-blue-2 text-white  font-medium transform hover:scale-105 transition-transform duration-300 shadow-lg py-4 rounded-xl">
            {getButtonText(isSetup, isMyChallenge)}
          </button>
          <div id="아래 빈칸용"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};