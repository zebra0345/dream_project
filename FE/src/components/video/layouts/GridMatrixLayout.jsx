// conponents/video/layouts/GridMatrixLayout.jsx
import UserVideo from "../UserVideo";

// mainStreamManager : 메인 스트림
// publisher         : 자신의 스트림
// subscribers       : 다른 참가자들의 스트림
// onStreamClick     : 스트림 클릭 핸들러

const GridMatrixLayout = ({
  mainStreamManager, // 메인 화면에 표시될 스트림
  publisher, // 자신의 비디오 스트림
  subscribers, // 다른 참가자들의 스트림 배열
  onStreamClick, // 스트림 클릭 시 메인 화면 전환 핸들러
}) => {
  return (
    <div className="w-full flex h-full justify-center">
      {/* 컨테이너로 감싸기 */}
      <div className="w-full max-w-7xl flex  lg:flex-row gap-10 h-full justify-center">
        {/* 메인 스트림 영역 */}
        <div className="w-full md:w-4/5 bg-black rounded-lg overflow-hidden h-full min-w-[640px] flex justify-center ">
          {mainStreamManager && <UserVideo streamManager={mainStreamManager} isMainStream={true}/>}
        </div>

        {/* 참가자 목록 영역 */}
        <div className="hidden lg:block lg:w-1/5 bg-gray-800 rounded-xl p-1 space-y-4 overflow-y-auto h-full">
          {/* 자신의 스트림 */}
          {publisher && (
            <div
              onClick={() => onStreamClick(publisher)}
              className="h-48 bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            >
              <UserVideo streamManager={publisher} />
            </div>
          )}

          {/* 다른 참가자들의 스트림 */}
          {subscribers.map((subscriber) => (
            <div
              key={subscriber.stream.connection.connectionId}
              onClick={() => onStreamClick(subscriber)}
              className="h-48 bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            >
              <UserVideo streamManager={subscriber} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridMatrixLayout;
