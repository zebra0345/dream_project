import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { useSetRecoilState } from "recoil";
import { aiFocusState } from "../../../recoil/atoms/ai/aiState";

const FocusAnalysis = ({ serverUrl }) => {
    const socketRef = useRef(null);
    const canvasRef = useRef(document.createElement("canvas"));
    const videoRef = useRef(null);
    const frameBuffer = useRef([]); // ✅ 프레임을 모아두는 버퍼
    const frameInterval = 100; // 🔥 100ms (1초에 10프레임 캡처)
    const batchSize = 10; // ✅ 10개의 프레임을 모아 한 번에 전송
    const mediaStreamRef = useRef(null); // ✅ WebRTC 스트림 추적용
    const intervalRef = useRef(null); // ✅ `setInterval` 추적용
    const detectionTimeout = useRef(false); // ✅ 탐지 일시 중지 상태 추적
    const setAiFocusValue = useSetRecoilState(aiFocusState);


    // ✅ 손바닥(✋) & 따봉(👍) 감지 상태 변수
    const [isThumbsUp, setIsThumbsUp] = useState(false);
    const [isPalmOpen, setIsPalmOpen] = useState(false);
    let studyTimer = 0;
    let studyAttitude = true;
    useEffect(() => {
        socketRef.current = new WebSocket(serverUrl);

        socketRef.current.onopen = () => {
            console.log("✅ WebSocket 연결 성공:", serverUrl);
            startWebRTCStream();
        };

        socketRef.current.onerror = (error) => console.error("❌ WebSocket 에러:", error);

        socketRef.current.onmessage = (event) => {
            try {
                if (studyAttitude === true) {
                    studyTimer += 1;
                }
                const data = JSON.parse(event.data);
                console.log("📡 집중도 분석 결과:", data.focus_prediction);
                setAiFocusValue(data.focus_prediction)
                if (data.focus_prediction == 1) {
                    studyAttitude = true;
                }
                else {
                    studyAttitude = false;
                }
                // console.log("📊 신뢰도:", data.confidence);
                // console.log("👀 시선 방향:", data.eye_direction);
                // console.log("🤖 머리 기울기:", data.head_tilt);
                // console.log(studyTimer)
                // console.log("----------------------------------------------------");
            } catch (error) {
                console.error("❌ WebSocket 데이터 오류:", error);
            }
        };

        startHandTracking(); // ✅ 손 동작 감지 시작

        return () => {
            stopWebRTCStream();
            closeWebSocket();
            if (intervalRef.current) {
                clearInterval(intervalRef.current); // 주기적인 감지 중지
            }
        };
    }, [serverUrl]);

    // ✅ WebRTC 스트림을 시작하는 함수
    const startWebRTCStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            mediaStreamRef.current = stream;
            videoRef.current.srcObject = stream;
            startFrameCapture();
        } catch (error) {
            console.error("❌ WebRTC 스트림 오류:", error);
        }
    };

    // ✅ WebRTC 스트림을 중지하는 함수
    const stopWebRTCStream = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            console.log("🔴 WebRTC 스트림이 중지됨");
        }
    };

    // ✅ WebSocket을 안전하게 종료하는 함수
    const closeWebSocket = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.close();
            console.log("🔴 WebSocket이 안전하게 종료됨");
        }
    };

    // ✅ 일정 간격으로 프레임을 캡처하여 버퍼에 저장
    const startFrameCapture = () => {
        intervalRef.current = setInterval(() => {
            captureFrame();
        }, frameInterval);
    };

    // ✅ 프레임을 캡처하여 버퍼에 저장
    const captureFrame = () => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.width = 640;
        canvas.height = 480;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // 캔버스를 Base64로 변환 후 버퍼에 저장
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        const base64Frame = reader.result.split(",")[1]; // Base64 인코딩
                        frameBuffer.current.push(base64Frame);

                        // ✅ 일정 개수(batchSize)만큼 모이면 한 번에 전송
                        if (frameBuffer.current.length >= batchSize) {
                            sendBufferedFrames();
                        }
                    };
                }
            },
            "image/jpeg",
            0.7
        );
    };

    // ✅ 모인 프레임을 한 번에 WebSocket으로 전송
    const sendBufferedFrames = () => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            console.warn("⚠️ WebSocket이 닫혀 있어 프레임을 전송할 수 없음.");
            return;
        }

        // console.log(`📤 ${batchSize}개 프레임 한 번에 전송 중...`);

        // 🔥 JSON으로 변환하여 한 번에 전송
        socketRef.current.send(JSON.stringify({ frames: frameBuffer.current }));

        // ✅ 전송 후 버퍼 비우기
        frameBuffer.current = [];
    };

    // ✅ MediaPipe Hands를 이용한 손 동작 감지
    const startHandTracking = () => {
        const hands = new Hands({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        hands.onResults((results) => {
            if (results.multiHandLandmarks.length === 0) {
                setIsThumbsUp(false);
                setIsPalmOpen(false);
                return;
            }

            results.multiHandLandmarks.forEach((landmarks) => {
                // ✅ 엄지 손가락이 다른 손가락보다 위에 있을 경우 -> 따봉
                const isThumbsUpDetected =
                    landmarks[4].y < landmarks[3].y &&
                    landmarks[4].y < landmarks[2].y &&
                    landmarks[4].y < landmarks[1].y &&
                    landmarks[8].y > landmarks[6].y &&
                    landmarks[12].y > landmarks[10].y;

                // ✅ 모든 손가락이 펴져 있으면 -> 손바닥 펼침
                const isPalmOpenDetected =
                    landmarks[8].y < landmarks[6].y &&
                    landmarks[12].y < landmarks[10].y &&
                    landmarks[16].y < landmarks[14].y &&
                    landmarks[20].y < landmarks[18].y;

                setIsThumbsUp(isThumbsUpDetected);
                setIsPalmOpen(isPalmOpenDetected);

                if (isThumbsUpDetected) {
                    console.log("👍 따봉!");
                    stopDetectionForSeconds(3); // 손 감지 후 3초간 비활성화
                } else if (isPalmOpenDetected) {
                    console.log("✋ 손바닥!");
                    stopDetectionForSeconds(3); // 손 감지 후 3초간 비활성화
                }
            });
        });

        // ✅ 카메라에서 프레임을 가져와 감지
        if (videoRef.current) {
            const camera = new Camera(videoRef.current, {
                onFrame: async () => {
                    if (!detectionTimeout.current) {
                        await hands.send({ image: videoRef.current });
                    }
                },
                width: 640,
                height: 480,
            });
            camera.start();
        }

        // ✅ 1초마다 손 감지 실행
        setInterval(() => {
            if (!detectionTimeout.current && videoRef.current) {
                hands.send({ image: videoRef.current });
            }
        }, 1000); // 1초에 한번씩 손 감지 시도
    };

    // ✅ 손 감지 후 일정 시간(3초) 동안 감지를 비활성화
    const stopDetectionForSeconds = (seconds) => {
        detectionTimeout.current = true;
        console.log(`⏸️ ${seconds}초 동안 손 감지 비활성화...`);
        setTimeout(() => {
            detectionTimeout.current = false;
            console.log("✅ 손 감지 다시 활성화!");
        }, seconds * 1000);
    };

    return <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />;
};

export default FocusAnalysis;
