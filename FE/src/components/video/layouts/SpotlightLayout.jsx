import { useState } from 'react';
import UserVideo from '../UserVideo';
import { CiCircleChevUp,CiCircleChevDown  } from "react-icons/ci";

const SpotlightLayout = ({ mainStreamManager, publisher, subscribers, onStreamClick }) => {
  // 스포트라이트에 표시될 참가자들 (자신 + 다른 참가자들)
  const [isClosedBottom,setIsClosedBottom ] = useState(false)
  const allParticipants = publisher 
    ? [publisher, ...subscribers]
    : subscribers;

  return (
    <div className="h-full w-full flex flex-col gap-4">
      {/* 메인 스포트라이트 영역 */}
      <div className="flex-grow bg-gray-800 rounded-lg overflow-hidden">
        {mainStreamManager && (
          <div className="w-full h-full">
            <UserVideo streamManager={mainStreamManager} />
          </div>
        )}
      </div>

      {/* 하단 참가자 목록 */}
      <button className="flex justify-center ">
        {isClosedBottom ?<CiCircleChevUp onClick={()=> setIsClosedBottom(!isClosedBottom)} className='text-2xl'/> : 
        <CiCircleChevDown onClick={()=> setIsClosedBottom(!isClosedBottom)} className='text-2xl'/>}
      </button>
      <div className={`h-60 flex gap-2 overflow-x-auto ${isClosedBottom? 'hidden': ''}`}>
        {allParticipants.map((participant) => (
          <div
            key={participant.stream?.connection?.connectionId || 'publisher'}
            className="flex-none w-44 bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-my-blue-2 transition-all"
            onClick={() => onStreamClick?.(participant)}
          >
            <UserVideo streamManager={participant} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpotlightLayout;