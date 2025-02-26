import { useState, useEffect, useRef } from "react";

const useFocusSocket = (serverUrl) => {
    const [focusData, setFocusData] = useState(null);
    const socketRef = useRef(null);  // ✅ useRef 사용

    useEffect(() => {
        const ws = new WebSocket(serverUrl);
        socketRef.current = ws;  // ✅ useRef에 저장

        ws.onopen = () => {
            console.log("✅ WebSocket 연결 성공:", serverUrl);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("📡 받은 집중 예측 결과:", data);
            setFocusData(data.focus_prediction);  // 🔥 0 or 1 저장
        };

        ws.onerror = (error) => {
            console.error("❌ WebSocket 에러 발생:", error);
        };

        ws.onclose = () => {
            console.log("🔴 WebSocket 연결 종료");
        };

        return () => {
            ws.close();
        };
    }, [serverUrl]);

    return { focusData, socket: socketRef.current };
};

export default useFocusSocket;
