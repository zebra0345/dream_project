import { motion } from 'framer-motion';

export default function ReviewItems({ review, rotate }) {
  // review prop의 구조 분해 할당
  const { title, content, author, rating, date } = review;

  return (
    // 각 리뷰 카드의 기본 컨테이너
    // min-w-[300px]로 카드의 최소 너비 보장
    <motion.div 
      className="min-w-[300px] min-h-[400px] bg-white rounded-lg shadow-lg p-6 cursor-default flex flex-col"
      // 삐뚤어지자~
      initial={{ rotate: 0 }}
      animate={{ rotate }}
      // 호버 효과를 위한 whileHover 애니메이션
      whileHover={{ 
        translateY: -5, // 위로 5px 이동
        rotate : Math.random() * 10 - 5,
        scale : 1.02,
        transition: { duration: 0.2 }
      }}
    >
      {/* 리뷰 제목 영역 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        {/* 별점 표시 - 예시로 ★ 문자 사용 */}
        <div className="text-yellow-500">
          {'★'.repeat(rating)}
          {'☆'.repeat(5 - rating)}
        </div>
      </div>

      {/* 리뷰 내용 영역 */}
      <p className="text-gray-600 mb-4 line-clamp-3 tracking-wide">
        {content}
      </p>

      {/* 작성자 정보와 날짜 영역 */}
      <div className="flex justify-between items-center mt-auto">
        <span className="text-sm text-gray-500">{author}</span>
        <span className="text-sm text-gray-400">{date}</span>
      </div>
    </motion.div>
  );
};

