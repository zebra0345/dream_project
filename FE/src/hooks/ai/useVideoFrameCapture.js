import { useEffect, useRef } from "react";
import { WS_FASTAPI_BASE_URL } from "../../services/api/axios";

const useVideoFrameCapture = (streamManager, isMyVideo) => {
    const socketRef = useRef(null);
    const canvasRef = useRef(document.createElement("canvas")); // ✅ 캔버스 생성

    useEffect(() => {
        if (!isMyVideo || !streamManager) return;

        // ✅ WebSocket 연결
        
        // socketRef.current = new WebSocket("ws://localhost:8000/focus");
        socketRef.current = new WebSocket(WS_FASTAPI_BASE_URL);

        socketRef.current.onopen = () => console.log("✅ WebSocket 연결 성공");
        socketRef.current.onerror = (error) => console.error("❌ WebSocket 에러:", error);
        socketRef.current.onclose = () => console.log("🔴 WebSocket 연결 종료");

        // ✅ WebSocket 메시지 확인
        socketRef.current.onmessage = (event) => {
            console.log("📡 서버에서 받은 메시지:", event.data);
        };

        const sendFrame = () => {
            const videoElement = document.createElement("video");
            streamManager.addVideoElement(videoElement);
            
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            canvas.width = 640;
            canvas.height = 480;
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            // ✅ 캔버스를 Blob(JPEG)로 변환 후 Base64 인코딩하여 서버로 전송
            canvas.toBlob((blob) => {
                if (blob && socketRef.current.readyState === WebSocket.OPEN) {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        const base64Frame = reader.result.split(",")[1];
                        console.log("📤 WebSocket으로 프레임 전송 중...");
                        socketRef.current.send(JSON.stringify({ frame: base64Frame }));
                    };
                } else {
                    console.error("❌ WebSocket이 닫혀 있음!");
                }
            }, "image/jpeg");
        };

        // ✅ 1초마다 프레임 캡처 및 전송
        const intervalId = setInterval(sendFrame, 1000);

        return () => {
            clearInterval(intervalId);
            socketRef.current.close();
        };
    }, [streamManager, isMyVideo]);

    return null;
};

export default useVideoFrameCapture;
