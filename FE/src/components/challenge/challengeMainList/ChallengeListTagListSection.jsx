import { motion, AnimatePresence } from "framer-motion";
import ChallengeListTagSelector from "./ChallengeListTagSelector";
import { challengeSelectedTagsState } from "/src/recoil/atoms/tags/selectedTagsState";
import { useRecoilState } from "recoil";

// import { PencilIcon } from "@heroicons/react/24/outline";

export default function ChallengeListTagListSection({isEdittag}) {
  const [selectedTags, setSelectedTags] = useRecoilState(challengeSelectedTagsState);

  // 태그 삭제 핸들러
  const handleTagDelete = (tagToDelete) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToDelete));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const tagVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      // y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      // y: -5,
      transition: {
        duration: 0.1,
        ease: "easeIn",
      },
    },
  };

  // 태그 버튼 렌더링 함수
  const renderTagContent = () => {
    // 태그가 없고 edit 모드가 아닐 때
    if (!isEdittag && selectedTags.length === 0) {
      return (
        <motion.p variants={tagVariants} className="text-gray-500 text-lg">
          관심있는 태그를 설정해보세요.
        </motion.p>
      );
    }

    // 태그 버튼들 렌더링
    const tags = [];
    for (let i = 0; i < 3; i++) {
      const tag = selectedTags[i];
      if (isEdittag || tag) {
        tags.push(
          <motion.button
            key={i}
            style={{fontFamily:"mbc"}}
            variants={tagVariants}
            onClick={() => isEdittag && tag && handleTagDelete(tag)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                tag
                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  : isEdittag
                  ? "bg-gray-100 text-gray-400"
                  : "hidden"
              }
            `}
          >
            {tag ? `#${tag}` : "태그 추가"}
          </motion.button>
        );
      }
    }
    return <div className="flex gap-2">{tags}</div>;
  };

  return (
    <>    
      <div className="w-full bg-white rounded-3xl border-2 border-gray-300 p-4" >
        <div className="mb-4">{renderTagContent()}</div>

          {isEdittag && (
            <motion.div
              key="editor"
              variants={tagVariants}
              className="space-y-4"
            >
              <ChallengeListTagSelector />
              {selectedTags.length > 3 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-red-500 text-sm"
                >
                  최대 3개의 태그만 선택할 수 있습니다.
                </motion.p>
              )}
            </motion.div>
          )}
        {/* <AnimatePresence mode="wait">
        </AnimatePresence> */}
      </div>
      {/* <motion.div
        key="container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
      </motion.div> */}
      {/* <AnimatePresence mode="wait">
      </AnimatePresence> */}
    </>
  );
}
