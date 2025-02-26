import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import OvVideo from "./OvVideo";
import { processedSubtitlesState, showSubtitlesState } from "../../recoil/atoms/challenge/ai/scriptState";

const UserVideo = ({ streamManager, isMyVideo, isMainStream }) => {
  const videoRef = useRef();

  // 현재 사용자 ID 가져오기
  const userId = streamManager?.stream?.connection?.data
    ? JSON.parse(streamManager.stream.connection.data).clientData.originalName
    : "unknown_user";

  // Recoil 상태 가져오기
  const processedSubtitles = useRecoilValue(processedSubtitlesState);
  const showSubtitles = useRecoilValue(showSubtitlesState);

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <div className="relative w-full h-full">
      {/* 기본 비디오 스트림 표시 */}
      <OvVideo streamManager={streamManager} isMainStream={isMainStream} />

      {/* 자막 표시 */}
      {showSubtitles[userId] && processedSubtitles[userId] && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-md text-sm max-w-sm">
          {processedSubtitles[userId] || "⏳ 자막 로딩 중..."}
        </div>
      )}
    </div>
  );
};

export default UserVideo;
