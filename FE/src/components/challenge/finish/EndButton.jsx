import { useState,useEffect  } from 'react';
import { IoCall } from "react-icons/io5";
// import StarFalling from './StarFalling';
import { useRecoilState } from 'recoil';
import {starState} from  '../../../recoil/atoms/challenge/starState';
import { useNavigate } from "react-router-dom";
import { isMyChallengeSuccessedState } from '../../../recoil/atoms/ai/aiState';


export default function EndButton({onLeaveSession,sessionId}) {
  const [areYouDone, setAreYouDone] = useState(false);
  const [areYouSetDone, setAreYouSetDone] = useState(false);
  const [isRunStar, setIsRunStar] = useRecoilState(starState)
  const [isMyChallengeSuccessed, setIsMyChallengeSuccessed] = useRecoilState(isMyChallengeSuccessedState)
  const [profileUrl, setProfileUrl] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.profilePictureUrl) {
      setProfileUrl(userInfo.profilePictureUrl);
    }
  }, []);
  const exitButtonYes = async () => {
    setIsRunStar(true); 
    setAreYouDone(false);
    setIsMyChallengeSuccessed(true)
    localStorage.setItem('isMyChallengeSuccessedInLocal' , true)
    
    navigate(`/video/${sessionId}/ending`);
    try {
      await onLeaveSession();
    } catch (error) {
      console.error("Exit error:", error);
      // 에러 발생 시에도 navigate 실행
      navigate(`/video/${sessionId}/ending`);
    }
  };
  const exitButtonNope = async () => {
    setIsRunStar(true); 
    setAreYouDone(false);
    setIsMyChallengeSuccessed(false)
    localStorage.setItem('isMyChallengeSuccessedInLocal' , false)

    
    try {
      await new Promise((resolve, reject) => {
        onLeaveSession()
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
      
      navigate(`/video/${sessionId}/ending`);
    } catch (error) {
      console.error("Exit error:", error);
      navigate(`/video/${sessionId}/ending`);
    }
  };
  return (
    <>
      <div id="homebutton" className="">
        <button 
          className=" rounded-lg  border-4 border-gray-700 bg-gray-700"
          onClick={() => setAreYouSetDone(!areYouSetDone)}
          >
          <div className="bg-my-red rounded-md p-2 hover:bg-hmy-red text-gray-700">
            <IoCall />
          </div>
        </button>
      </div>
      {/* 1 */}
      <div id="homemodal" className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-white rounded-3xl p-6 w-80 shadow-lg z-50
        ${areYouSetDone ? '': 'hidden'}
      `}>
        <div className="flex justify-center text-gray-900">
          <p className="text-lg mb-8 ">정말 챌린지를 종료 하실건가요?</p>
        </div>
        <div className="flex justify-between gap-3">
          <button id="CancelButton"
            className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-900"
            onClick={() => setAreYouSetDone(false)}
            >Cancel
          </button>
          <button id="ContinueButton"
            className="flex-1 py-2 rounded-lg bg-black text-white"
            onClick={() => {setAreYouDone(true); setAreYouSetDone(false);}}
            >Continue
          </button>
        </div>
      </div>
      {/* 21 */}
      <div id="homemodal" className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-white rounded-3xl p-6 w-80 shadow-lg z-50
        ${areYouDone ? '': 'hidden'}
      `}>
        <div className="flex flex-col items-center ">
          <p className="text-xl mb-4 text-gray-900">오늘의 챌린지를 성공하셨나요?</p>
          <p className="text-md  text-my-blue-4">Yes 선택 시 성공 여부가 기록됩니다.</p>
          <p className="text-md mb-2 text-my-blue-4">신중히 눌러주세요!</p>
        </div>
        <div className="flex justify-between gap-3">
          <button id="ContinueButton"
            className="flex-1 py-2 rounded-lg bg-black text-white"
            onClick={exitButtonYes}
            >Yes!
          </button>
          <button id="CancelButton"
            className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-900"
            onClick={exitButtonNope}
            >Nope!
          </button>
        </div>
      </div>
      {/* 22 */}
      <div id="smallModal" className={`
        fixed top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2
        bg-white rounded-xl p-4 w-60 shadow-lg z-50     
        ${areYouDone ? '': 'hidden'}
      `}>
        <div className="flex flex-col items-center">
          {/* 프로필 이미지 추가 */}
          <div className="w-48 h-48 mb-3">  {/* 이미지 컨테이너 */}
            {profileUrl ? (
              <img
                src={profileUrl}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.target.src = '/path/to/default/image.png'; // 기본 이미지 경로 지정 필요
                }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">?</span>
              </div>
            )}
          </div>
          <p className="text-sm mb-2 text-gray-900">추가 안내사항</p>
          <p className="text-xs text-gray-500">챌린지를 향한 진심을 담아주세요</p>
        </div>
      </div>

      {/* {isRunStar && <StarFalling />} */}
    </>
  );
};
