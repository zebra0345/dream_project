import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { scriptOnOffState, processedSubtitlesState, showSubtitlesState } from "../../recoil/atoms/challenge/ai/scriptState";

const OvVideo = ({ streamManager, isMainStream }) => {
  const videoRef = useRef(null);

  // ✅ 상태 가져오기 (displayedSubtitlesState → processedSubtitlesState로 변경)
  const scriptOnOff = useRecoilValue(scriptOnOffState);
  const processedSubtitles = useRecoilValue(processedSubtitlesState);
  const showSubtitles = useRecoilValue(showSubtitlesState);

  // ✅ 현재 스트림의 사용자 ID 가져오기
  const userId = streamManager?.stream?.connection?.data
    ? JSON.parse(streamManager.stream.connection.data).clientData.originalName
    : "unknown_user";

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <div className="relative w-full h-full ">
      <video autoPlay ref={videoRef} className="w-full h-full rounded-xl" />
      
      {/* ✅ 자막 표시 (displayedSubtitlesState → processedSubtitlesState로 변경) */}
      {scriptOnOff[userId] && showSubtitles[userId] && processedSubtitles[userId] && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 px-4 py-2 rounded-lg text-white text-sm max-w-sm">
          {processedSubtitles[userId] || "⏳ 음성 인식 중..."}
        </div>
      )}
    </div>
  );
};

export default OvVideo;
