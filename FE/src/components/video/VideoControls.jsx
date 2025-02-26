import { IoIosSquareOutline } from "react-icons/io";
import { CiGrid41, CiGrid2H, CiGrid42 } from "react-icons/ci";
import { BsGrid1X2 } from "react-icons/bs";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { GoScreenFull } from "react-icons/go";
import { MdSubtitles, MdOutlineAutoAwesome } from "react-icons/md";
import { HiUserAdd } from "react-icons/hi";
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import useOpenViduSetting from "../../hooks/useOpenViduSetting";
import { useRecoilState } from "recoil";
import {
  scriptOnOffState,
  allSubtitlesState,
  processedSubtitlesState,
  showSubtitlesState,
  showSummaryState,
  memoListState,
} from "../../recoil/atoms/challenge/ai/scriptState";
import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InviteModal from "./inviteModal/InviteModal";
import EndButton from "/src/components/challenge/finish/EndButton";
import api, { API_BASE_URL } from "../../services/api/axios";

export default function VideoControls({
  publisher,
  subscribers,
  onLeaveSession,
  currentLayout,
  session,
  sessionId,
  onLayoutChange,
  isScreenSharing,
  onToggleScreenShare,
  isFullscreen,
  onToggleFullscreen,
  setIsChatOpen,
}) {
  const layouts = [
    { id: "default", icon: BsGrid1X2, label: "기본" },
    { id: "Dynamic", icon: CiGrid41, label: "Dynamic" },
    { id: "spotlight", icon: IoIosSquareOutline, label: "스포트라이트" },
    { id: "teaching", icon: CiGrid2H, label: "티칭" },
    { id: "mosaic", icon: CiGrid42, label: "모자이크" },
  ];

  const {
    micVolume,
    speakerVolume,
    isMicMuted,
    isCameraOff,
    adjustMicVolume,
    adjustSpeakerVolume,
    toggleMicMute,
    toggleCamera,
  } = useOpenViduSetting(publisher, subscribers);

  const [scriptOnOff, setScriptOnOff] = useRecoilState(scriptOnOffState);
  const [allSubtitles, setAllSubtitles] = useRecoilState(allSubtitlesState);
  const [processedSubtitles, setProcessedSubtitles] = useRecoilState(processedSubtitlesState);
  const [showSubtitles, setShowSubtitles] = useRecoilState(showSubtitlesState);
  const [isRecording, setIsRecording] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");
  const [showSummary, setShowSummary] = useRecoilState(showSummaryState);
  const [memoList, setMemoList] = useRecoilState(memoListState);
  const navigate = useNavigate();

  // 누적된 전체 STT 데이터를 저장 (요약 및 자막 처리용)
  const totalDataRef = useRef("");
  // MediaRecorder 관련 ref
  const mediaRecorderRef = useRef(null);
  // 최신 녹음 상태 확인을 위한 ref
  const isRecordingRef = useRef(isRecording);
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const userId = publisher?.stream?.connection?.data
    ? JSON.parse(publisher.stream.connection.data).clientData.originalName
    : "unknown_user";

  // 자막 표시 토글 (Recoil의 showSubtitles 상태 업데이트)
  const handleSubtitleToggle = useCallback(() => {
    setShowSubtitles((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  }, [setShowSubtitles, userId]);

  // 최근 몇 단어만 보여주기 위한 헬퍼 함수
  const getDisplayedText = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.slice(-5).join(" ");
  };

  // STT 토글: 녹음 시작/종료 및 스크립트 관련 상태 업데이트
  const handleSTTToggle = () => {
    if (!isRecording) {
      setScriptOnOff((prev) => ({
        ...prev,
        [userId]: true,
      }));
      // 자막 표시 토글 (UserVideo에서 자막을 표시하므로 여기서는 상태만 변경)
      handleSubtitleToggle();
      setIsRecording(true);
      startAudioRecording();
    } else {
      setIsRecording(false);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
      console.log("Audio recording stopped manually.");
    }
  };

  // MediaRecorder 시작 – 5초마다 자동 중지 후 Blob 처리
  const startAudioRecording = () => {
    if (!publisher?.stream?.getMediaStream) {
      console.error("MediaStream not available from publisher");
      return;
    }
    const mediaStream = publisher.stream.getMediaStream();
    const audioStream = new MediaStream(mediaStream.getAudioTracks());
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";
    const options = { mimeType };
    try {
      const recorder = new MediaRecorder(audioStream, options);
      mediaRecorderRef.current = recorder;
      let chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: options.mimeType });
        chunks = [];
        try {
          await sendAudioBlob(blob);
        } catch (error) {
          console.error("Failed to send audio blob:", error);
        }
        if (isRecordingRef.current) {
          startAudioRecording();
        }
      };
      recorder.start();
      console.log("Audio recording started with options:", options);
      setTimeout(() => {
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      }, 5000);
    } catch (error) {
      console.error("Error starting audio recording:", error);
    }
  };

  // 녹음된 Blob을 WAV로 변환 후, STT API 호출 및 자막(Recoil 상태) 업데이트
  const sendAudioBlob = async (blob) => {
    try {
      const wavBlob = await convertBlobToWav(blob);
      const formData = new FormData();
      const file = new File([wavBlob], "audio.wav", { type: "audio/wav" });
      formData.append("audioFile", file);
      const response = await axios.post("http://localhost:8080/stt/speech-to-text", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Audio processed:", response.data);
      const newText = response.data.trim();
      setAllSubtitles((prev) => {
        const updated = ((prev[userId] || "") + " " + newText).trim();
        totalDataRef.current = updated;
        return { ...prev, [userId]: updated };
      });
      setProcessedSubtitles((prev) => {
        const updatedRaw = totalDataRef.current;
        const processed = getDisplayedText(updatedRaw);
        return { ...prev, [userId]: processed };
      });
    } catch (error) {
      console.error("Failed to send audio blob:", error);
    }
  };

  // STT 요약 기능: 누적 스크립트를 요약하여 memoListState에 저장
  const summarizeScript = async () => {
    try {
      console.log("📩 STT 데이터 요약 요청 중...");
      setShowSummary(true);
      setIsChatOpen(true);
      const response = await api.post("http://localhost:8080/gpt-summary", {
        script: totalDataRef.current,
      });
      setMemoList((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: (() => {
            const content =
              typeof response.data === "object" ? response.data.summary : response.data;
            const strContent = String(content);
            return strContent.startsWith("## 요약본")
              ? strContent.replace("## 요약본", "").trim()
              : strContent.trim();
          })(),
        },
      ]);
      console.log("📜 STT 요약 결과:", response.data);
    } catch (error) {
      console.error("❌ STT 요약 요청 실패:", error);
    }
  };

  // 초대 코드 요청
  const inviteButton = async () => {
    try {
      const response = await api.get(`http://localhost:8080/challenges/invite/${sessionId}`);
      setInviteUrl(response.data);
      console.log("초대코드 성공:", response.data);
      setIsInviteModalOpen(true);
    } catch (e) {
      console.error("초대코드 에러:", e);
    }
  };

  // 컴포넌트 언마운트 시 MediaRecorder 정리
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className="flex flex-row gap-4 items-start justify-between w-full px-4 pt-1">
        {/* 마이크 & 스피커 컨트롤 */}
        <div className="flex gap-4 items-center">
          <button onClick={toggleMicMute} className={`p-2 rounded ${isMicMuted ? "bg-red-500" : "bg-gray-800"} text-white`}>
            {isMicMuted ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={micVolume}
            onChange={(e) => adjustMicVolume(parseFloat(e.target.value))}
            className="w-24"
          />
          <button onClick={toggleCamera} className={`p-2 rounded ${isCameraOff ? "bg-red-500" : "bg-gray-800"} text-white`}>
            {isCameraOff ? <FaVideo /> : <FaVideoSlash />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={speakerVolume}
            onChange={(e) => adjustSpeakerVolume(parseFloat(e.target.value))}
            className="w-24"
          />
        </div>

        {/* STT & 자막 버튼 */}
        <div className="flex gap-4">
          <div className="flex gap-2">
            <button onClick={handleSTTToggle} className="p-2 rounded bg-gray-800 text-2xl text-white">
              <MdSubtitles className={`${isRecording ? "border-b-2 border-my-red pb-0.5" : ""}`} />
            </button>
            <button
              onClick={handleSubtitleToggle}
              className={`py-1 px-2 rounded bg-gray-800 text-xl ${showSubtitles[userId] ? "text-my-red" : "text-gray-200"}`}
            >
              {showSubtitles[userId] ? "on" : "off"}
            </button>
          </div>
          <button onClick={summarizeScript} className="bg-gray-800 text-white p-2 rounded flex items-center gap-2">
            <MdOutlineAutoAwesome className="text-xl" />
            <div>AI 요약</div>
          </button>
        </div>

        <div className="flex gap-4">
          {/* 나가기 버튼 */}
          <div>
            <EndButton onLeaveSession={onLeaveSession} sessionId={sessionId} />
          </div>
          {/* 전체화면 버튼 */}
          <button onClick={onToggleFullscreen} className="p-2 bg-gray-800 rounded text-xl hover:bg-gray-700 transition-colors">
            <GoScreenFull />
          </button>
          {/* 화면 공유 버튼 */}
          <div className="flex gap-4 items-center">
            <button onClick={onToggleScreenShare} className="p-2 rounded bg-gray-800 text-gray-200 text-xl">
              {isScreenSharing ? <LuScreenShareOff className="w-6 h-6" /> : <LuScreenShare className="w-6 h-6" />}
            </button>
          </div>
          {/* 초대하기 버튼 */}
          <div>
            <button onClick={inviteButton} className="p-2 bg-gray-800 rounded text-gray-200 text-xl hover:bg-gray-700 transition-colors">
              <HiUserAdd />
            </button>
          </div>
          <InviteModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} inviteUrl={inviteUrl} />
        </div>

        {/* 그리드 스타일 조정 버튼 */}
        <div className="flex gap-2 items-center">
          {layouts.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onLayoutChange(id)}
              className={`p-2 rounded ${currentLayout === id ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}
            >
              <Icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>
      {/* 자막 표시 영역은 이제 UserVideo 컴포넌트에서 처리됩니다 */}
    </div>
  );
}

/* WAV 변환 헬퍼 함수들 (convertBlobToWav, encodeWAV, writeString, interleave) 그대로 유지 */
async function convertBlobToWav(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const audioContext = new AudioContext();
  let audioBuffer;
  try {
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error("Error decoding audio data:", error);
    throw error;
  }
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    Math.floor(audioBuffer.duration * 16000),
    16000
  );
  const bufferSource = offlineContext.createBufferSource();
  bufferSource.buffer = audioBuffer;
  bufferSource.connect(offlineContext.destination);
  bufferSource.start(0);
  const resampledBuffer = await offlineContext.startRendering();
  return encodeWAV(resampledBuffer);
}

function encodeWAV(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const bitsPerSample = 16;
  let interleaved;
  if (numChannels === 2) {
    interleaved = interleave(audioBuffer.getChannelData(0), audioBuffer.getChannelData(1));
  } else {
    interleaved = audioBuffer.getChannelData(0);
  }
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = interleaved.length * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);
  let offset = 44;
  for (let i = 0; i < interleaved.length; i++) {
    let sample = Math.max(-1, Math.min(1, interleaved[i]));
    sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    view.setInt16(offset, sample, true);
    offset += 2;
  }
  return new Blob([view], { type: "audio/wav" });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function interleave(leftChannel, rightChannel) {
  const length = leftChannel.length + rightChannel.length;
  const result = new Float32Array(length);
  let index = 0;
  for (let i = 0; i < leftChannel.length; i++) {
    result[index++] = leftChannel[i];
    result[index++] = rightChannel[i];
  }
  return result;
}
