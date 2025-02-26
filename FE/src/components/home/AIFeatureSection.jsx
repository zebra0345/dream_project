const AIFeatureSection = () => {
  return (
    <div className="bg-[#DBF2FF] py-20 px-10 flex items-center">
      <div className="w-1/2 space-y-6">
        <h2 className="text-4xl font-bold text-[#003458]">
          학습자를 위한 모든 것
        </h2>
        <p className="text-xl text-[#3F628A]">
          AI 기술로 개인화된 학습 경험을 제공합니다.
        </p>
        <ul className="space-y-3 text-[#003458]">
          <li>• 실시간 챌린지 집중도 분석</li>
          <li>• 자동 강의 요약</li>
          <li>• 학습 동료와의 커뮤니티</li>
        </ul>
      </div>
      <div className="w-1/2">
        {/* AI 기능 시각화 */}
      </div>
    </div>
  );
};

export default AIFeatureSection;