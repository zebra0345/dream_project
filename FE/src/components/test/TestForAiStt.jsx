// import { useEffect, useState } from "react";
// import api from "../../services/api/axios";

export default function TestForAiStt() {
  //   const [transcript, setTranscript] = useState(""); // 자막 상태

  //   useEffect(() => {
  //       let mediaRecorder;
  //       let audioChunks = [];

  //       // ✅ 1️⃣ 마이크 권한 요청 및 오디오 녹음 시작
  //       navigator.mediaDevices.getUserMedia({ audio: true })
  //           .then((stream) => {
  //               mediaRecorder = new MediaRecorder(stream);
  //               mediaRecorder.start();

  //               // 녹음된 데이터 저장
  //               mediaRecorder.ondataavailable = (event) => {
  //                   audioChunks.push(event.data);
  //               };

  //               // 일정 시간(1초)마다 서버로 전송
  //               setInterval(() => {
  //                   if (audioChunks.length > 0) {
  //                       sendAudioToServer(new Blob(audioChunks, { type: "audio/wav" }));
  //                       audioChunks = [];
  //                   }
  //               }, 1000);
  //           })
  //           .catch((error) => console.error("🎤 마이크 접근 실패:", error));

  //       // ✅ 2️⃣ SSE(Server-Sent Events) 연결
  //       const eventSource = new EventSource("http://localhost:8080/stt/stt-start");
  //       eventSource.onmessage = (event) => {
  //           console.log("📡 STT 결과:", event.data);
  //           setTranscript((prev) => prev + " " + event.data); // 실시간 자막 업데이트
  //       };

  //       return () => {
  //           mediaRecorder?.stop();
  //           eventSource.close();
  //       };
  //   }, []);

  //   const sendAudioToServer = async (audioBlob) => {
  //     try {
  //         const response = await api.post("/stt/stt-stream", 
  //             audioBlob,
  //             {
  //                 headers: { 
  //                     "Content-Type": "audio/wav",  // audio/wav로 변경
  //                     "Accept": "application/json"   // Accept 헤더 추가
  //                 }
  //             }
  //         );
  
  //         console.log("✅ 음성 데이터 서버 전송 완료");
  //     } catch (error) {
  //         console.error("❌ 서버 전송 중 오류 발생:", error);
  //     }
  // };

  //   return (
  //       <div className="p-4">
  //           <h1 className="text-xl font-bold">🎤 실시간 자막</h1>
  //           <p className="mt-4 bg-gray-100 p-3 rounded-md shadow-md">{transcript}</p>
  //       </div>
  //   );
}
