import UserVideoComponent from './UserVideo';

// mainStreamManager : 메인 스트림
// publisher         : 자신의 스트림
// subscribers       : 다른 참가자들의 스트림
// onStreamClick     : 스트림 클릭 핸들러
export default function VideoGrid({mainStreamManager, publisher, subscribers, onStreamClick,myUserName,mySessionRoomName}) {
  return (
    <div className="grid grid-cols-3 gap-4 h-[calc(100%-80px)]">
      {/* 메인 스트림 영역 */}
      {mainStreamManager && (
        <div className="col-span-2 bg-gray-800 rounded">
          <UserVideoComponent streamManager={mainStreamManager} />
        </div>
      )}
      
      {/* 참가자 목록 영역 */}
      <div className="space-y-4">
        {/* 자신의 스트림 */}
        {publisher && (
          <div
            onClick={() => onStreamClick(publisher)}
            className="bg-gray-800 rounded cursor-pointer"
          >
            <UserVideoComponent streamManager={publisher} isMyVideo={true} myUserName={myUserName} mySessionRoomName={mySessionRoomName}/>
          </div>
        )}
        
        {/* 다른 참가자들의 스트림 */}
        {subscribers.map((sub) => (
          <div
            key={sub.stream.connection.connectionId}
            onClick={() => onStreamClick(sub)}
            className="bg-gray-800 rounded cursor-pointer"
          >
            <UserVideoComponent streamManager={sub} isMyVideo={false} myUserName={null} mySessionRoomName={null}/>
          </div>
        ))}
      </div>
    </div>
  );
};