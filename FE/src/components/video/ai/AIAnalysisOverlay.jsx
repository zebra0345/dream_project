const AIAnalysisOverlay = ({ aiResult }) => {
  if (!aiResult) return null;

  return (
    <div className="absolute top-0 left-0 p-4 bg-black bg-opacity-50 text-white">
      {/* 자세 분석 결과 */}
      {aiResult.posture && (
        <div className="mb-2">
          <h3 className="text-lg font-bold">자세 분석</h3>
          <p>정확도: {aiResult.posture.accuracy}%</p>
          <p>상태: {aiResult.posture.status}</p>
          {/* ★★자세 분석 결과에 따른 추가 정보 표시★★ */}
        </div>
      )}

      {/* 얼굴 인식 결과 */}
      {aiResult.face && (
        <div>
          <h3 className="text-lg font-bold">얼굴 분석</h3>
          <p>감정: {aiResult.face.emotion}</p>
          <p>집중도: {aiResult.face.attention}%</p>
          {/* ★★얼굴 인식 결과에 따른 추가 정보 표시★★ */}
        </div>
      )}
    </div>
  );
};

export default AIAnalysisOverlay;