import { motion } from "framer-motion";
import ReviewItems from "./ReviewItems";
import { reviewData } from "./ReviewDummyData";

export default function ReviewMain() {
  return (
    <div className="overflow-hidden w-[1100px] min-h-[700px] bg-my-yellow shadow-lg flex items-center rounded-3xl">
      <motion.div
        className="flex gap-2"
        animate={{
          x: [-1000, 0],
        }}
        transition={{
          duration: 50, // 속도조절 50초동안 한바퀴
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* 무한 스크롤인척 하기위해 데이터 세번 매핑 조져버려 */}
        {/* 키값, 리뷰정보, 랜덤삐뚤어지기 각도 */}
        {[...reviewData, ...reviewData, ...reviewData].map((review, index) => (
          <ReviewItems key={index} review={review} rotate={Math.random() * 10 - 5}/>
        ))}
      </motion.div>
    </div>
  );
};