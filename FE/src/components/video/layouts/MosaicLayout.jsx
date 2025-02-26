// components/video/layouts/MosaicLayout.jsx
import UserVideo from "../UserVideo";

const MosaicLayout = ({
  mainStreamManager,
  publisher,
  subscribers,
  onStreamClick,
}) => {
  // 모든 스트림을 하나의 배열로 결합
  const allStreams = publisher ? [publisher, ...subscribers] : subscribers;
  
  // 참가자 수에 따른 레이아웃 클래스 결정
  const getMosaicLayout = (index, total) => {
    // 1명: 전체 화면
    if (total === 1) {
      return 'col-span-4 row-span-3';
    }
    
    // 2명: 2개의 동일한 크기
    if (total === 2) {
      return 'col-span-2 row-span-3';
    }
    
    // 3-4명: 첫 번째 참가자는 크게, 나머지는 작게
    if (total <= 4) {
      return index === 0 ? 'col-span-2 row-span-3' : 'col-span-2 row-span-1';
    }
    
    // 5-6명: 첫 번째 참가자는 크게, 나머지는 중간 크기
    if (total <= 6) {
      return index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1';
    }
    
    // 7-9명: 처음 두 명은 크게, 나머지는 작게
    if (total <= 9) {
      return index <= 1 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1';
    }
    
    // 10-12명: 모두 동일한 크기
    return 'col-span-1 row-span-1';
  };

  return (
    <div className="h-full p-4 overflow-hidden">
      <div className="grid grid-cols-4 grid-rows-3 gap-4 h-full">
        {allStreams.map((stream, index) => (
          <div
            key={stream.stream?.connection?.connectionId || 'publisher'}
            onClick={() => onStreamClick(stream)}
            className={`
              ${getMosaicLayout(index, allStreams.length)}
              bg-gray-800 
              rounded-lg 
              overflow-hidden 
              cursor-pointer 
              hover:ring-2 
              hover:ring-my-blue-2 
              transition-all
              relative
            `}
          >
            <UserVideo streamManager={stream} />
            {/* 사용자 이름 오버레이 */}
            {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
              {stream.stream?.connection?.data
                ? JSON.parse(stream.stream.connection.data).clientData
                : '나'}
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MosaicLayout;