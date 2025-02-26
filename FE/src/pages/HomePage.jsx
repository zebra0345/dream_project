import { useState } from "react";
import MainHero from "../components/home/MainHero";
import ServiceHighlight from "../components/home/ServiceHighlight";
import ChallengeCarousel from "../components/home/challengeSection/ChallengeCarousel";
import { useSocialLogin } from "../hooks/useSocialLogin";
import HomeCommunity from "../components/home/homeCommunitySection/HomeCommunity";
import SplashScreen from "../components/home/SplashScreen";
import ReviewGradation from "../components/home/ReviewSection/ReviewGradation";
// import AIFeatureSection from "../components/home/AIFeatureSection";
// import TopLine from "../components/home/topLineSection/TopLine";
// import VideoSection from "../components/home/videoSection/VideoSection";


// 하루 중 한 번만 띄우고 싶다면
export default function HomePage() {
  const [showSplash, setShowSplash] = useState(() => {
    // 오늘 날짜를 'YYYY-MM-DD' 형식으로 가져옴
    const today = new Date().toISOString().split('T')[0];
    // localStorage에서 마지막으로 스플래시 스크린을 본 날짜를 가져옴
    const lastSplashDate = localStorage.getItem('lastSplashDate');
    
    // 오늘 처음 방문했다면 스플래시 스크린을 보여줌
    return lastSplashDate !== today;
  });
  
  const [totalHours, setTotalHours] = useState(0);
  useSocialLogin();

  const handleSplashComplete = () => {
    // 스플래시 스크린이 끝나면 오늘 날짜를 저장
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastSplashDate', today);
    setShowSplash(false);
  };

// 계속 메인화면 뜰 때마다 보이게 하고 싶다면
  // export default function HomePage() {
  //   const [showSplash, setShowSplash] = useState(true); // 항상 true로 초기화
  //   const [totalHours, setTotalHours] = useState(0);
  
  //   useSocialLogin();
  
  //   const handleSplashComplete = () => {
  //     setShowSplash(false); // localStorage 저장 로직 제거
  //   };

  return (
    <>
      {showSplash && (
        <SplashScreen
          onComplete={handleSplashComplete}
          setFinalHours={setTotalHours}
        />
      )}
      <div>
        <MainHero totalHours={totalHours} />
        <div className="snap-start">
          <ServiceHighlight />
        </div>
        <section className="w-full py-16 snap-start bg-my-blue-3 overflow-visible">
          <div className="container mx-auto px-4 bg-my-blue-3 overflow-visible">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold font-main-title text-gray-900 "  >
                시작일이 다가오는 챌린지에 참여해보세요!
              </h2>
            </div>
            <ChallengeCarousel />
          </div>
        </section>
        <div className="snap-start">
          <HomeCommunity />
        </div>
        <div>
          <ReviewGradation/>
        </div>
      </div>
    </>
  );
}
