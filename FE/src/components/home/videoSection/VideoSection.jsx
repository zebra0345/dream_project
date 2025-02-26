import VideoItem from "./VideoItem";
import defaultImage from "/gifs/testvideo1.gif";

import defaultImageA from "/gifs/main_1.gif";
import defaultImageB from "/gifs/main_2.gif";
import defaultImageC from "/gifs/main_3.gif";


export default function VideoSection() {
  return (
    <>
      <VideoItem
        title="학습 패턴을 한눈에 확인하세요!"
        // content="Join 120,000+ other creatives and get our newsletter, filled with lots of fresh jobs, design inspiration, cool links, free events, industry updates, and more! Join 120,000+ other creatives and get our newsletter, filled with lots of fresh jobs, design inspiration, cool links, free events, industry updates, and more!"
        content={`목표를 얼마나 달성했는지 궁금하지 않으신가요? 대시보드에서 학습 패턴을 한눈에 확인하고, 더욱 효율적으로 공부할 수 있습니다!

        📅 월별 학습 기록을 확인해보세요!
        🏆 챌린지별 통계를 통해 목표 달성률을 체크해보세요!
        📈 일일 학습량 변화를 확인해보세요!`}
//         content={`대시보드에서 여러분의 학습 현황을 쉽게 파악하세요!
// 🔹 📅 월별 학습 기록 조회 
// 공부 시간과 화면 사용 시간을 비교하여 학습 효율을 높여보세요.
// 🔹 🏆 챌린지별 통계 제공
// 일간/월간 학습 시간을 확인하고 목표 달성률을 체크해보세요.
// 🔹 📈 일일 학습량 변화 추적
// 매일의 공부 시간을 그래프로 확인하고 꾸준한 학습 습관을 유지하세요!
// 학습 목표를 달성하면 성취감이 두 배!🚀`}
        videogif={defaultImageA}
        bgcolor="bg-green-300"
        location="left"
      />
      <VideoItem
        title="함께 공부하고, 함께 성장해요!"
        // content="encounters a strange young person, neither man nor really boy, who, it emerges over time, has travelled from his solitary home on a distanta steroid, encounters a strange young person, neither man nor really boy, who, it emerges over time, has travelled from his solitary home on a distanta steroid, encounters a strange young person, neither man nor really boy, who, it emerges over time, has travelled from his solitary home on a distanta steroid"
        content="공부를 혼자 하기 어렵다면, 함께 해보세요! 같은 목표를 가진 사람들과 학습하다 보면 꿈을 이룰 수 있을 거예요. 당신의 시간으로 채워보세요.

        ✏️ 모르는 것이 있으면 질문하세요!  
        📚 유용한 정보를 공유하고 배움을 나누세요!  
        🎯 목표를 설정하고 꾸준히 도전하세요!"
        videogif={defaultImageC}
        bgcolor="bg-rose-300"
        location="right"
      />
      <VideoItem
        title="실시간 챌린지 지원!"
        // content="The rose has made him so miserable that, in torment, he has taken advantage of a flock of birds to convey him to other planets. He is instructed by a wise if cautious fox, and by a sinister angel of death, the snake. The rose has made him so miserable that, in torment, he has taken advantage of a flock of birds to convey him to other planets. He is instructed by a wise if cautious fox, and by a sinister angel of death, the snake."
        content="AI가 당신의 학습을 더욱 스마트하게 만들어줄 거예요! 실시간 분석으로 학습 효율을 높여보세요.
        
        🎥 실시간 화상 스터디로 함께 공부해요!
        🔒 AI가 분석해주는 나의 공부시간을 확인해보세요!
        💬 AI가 강의 내용을 요약해줘요!"
        videogif={defaultImageB}
        bgcolor="bg-violet-300"
        location="left"
      />
    </>
  )
}