// 입장 폼 컴포넌트
export default function VideoJoinForm({ myUserName, mySessionRoomName, onUserNameChange, onSessionNameChange, onJoin, isLoading }) {
  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    onJoin();
  };  

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl mb-8">화상 채팅 참가하기</h1>
      <div className="w-96 p-6 bg-gray-800 rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">이름:</label>
            <input
              type="text"
              className="w-full p-2 bg-gray-700 rounded"
              value={myUserName}
              onChange={(e) => onUserNameChange(e.target.value)}
              disabled={isLoading}  // 로딩 중일 때 입력 비활성화
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2">세션(방이름):</label>
            <input
              type="text"
              className="w-full p-2 bg-gray-700 rounded"
              value={mySessionRoomName}
              onChange={(e) => onSessionNameChange(e.target.value)}
              disabled={isLoading}  // 로딩 중일 때 입력 비활성화
            />
          </div>
          <button
            type="submit"
            className={`w-full p-2 rounded ${
              isLoading 
                ? 'bg-blue-400 cursor-not-allowed' // 로딩 중일 때 스타일
                : 'bg-blue-600 hover:bg-blue-700'  // 기본 스타일
            }`}
            disabled={isLoading}  // 로딩 중일 때 버튼 비활성화
          >
            {isLoading ? '연결 중...' : '참가하기'}  {/* 로딩 상태에 따른 텍스트 변경 */}
          </button>
        </form>
      </div>
    </div>
  );
};