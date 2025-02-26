import { useRef, useEffect, useState, useCallback } from "react"; // useState 추가
import { useRecoilState } from "recoil";
import { selectedTagsState } from "/src/recoil/atoms/tags/selectedTagsState";

export default function TagSelector() {
  const [selectedTags, setSelectedTags] = useRecoilState(selectedTagsState);
  const containerRef = useRef(null);
  // 직접 입력을 위한 상태 추가
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [customTag, setCustomTag] = useState("");
  const inputRef = useRef(null);

  const tags = [
    { id: 1, name: "공무원" },
    { id: 2, name: "토익" },
    { id: 3, name: "자격증" },
    { id: 4, name: "공시생" },
    { id: 5, name: "NCS" },
    { id: 6, name: "9to6" },
    { id: 7, name: "직장인" },
    { id: 8, name: "학생" },
    { id: 9, name: "30일챌린지" },
    { id: 10, name: "면접준비" },
    { id: 11, name: "독서모임" },
    { id: 12, name: "습관" },
    { id: 13, name: "개발자" },
    { id: 14, name: "미라클모닝" },
    { id: 15, name: "취준생" },
    { id: 16, name: "직접 입력" }, // 마지막 태그는 직접 입력 필드
  ];

  // 가로 스크롤
  const handleWheel = useCallback((e) => {
    if (!containerRef.current) return;

    const scrollableElement = containerRef.current.querySelector(
      '[class*="flex flex-nowrap"]'
    );
    if (!scrollableElement) return;

    const isScrollable =
      scrollableElement.scrollWidth > scrollableElement.clientWidth;

    if (isScrollable && e.deltaY !== 0) {
      const scrollAmount = e.deltaY;
      const currentScroll = scrollableElement.scrollLeft;
      const maxScroll =
        scrollableElement.scrollWidth - scrollableElement.clientWidth;

      if (
        (currentScroll <= 0 && scrollAmount < 0) ||
        (currentScroll >= maxScroll && scrollAmount > 0)
      ) {
        return;
      }

      scrollableElement.scrollLeft += scrollAmount;
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventScroll = (e) => {
      if (e.target === container || container.contains(e.target)) {
        e.preventDefault();
      }
    };

    container.addEventListener("wheel", preventScroll, { passive: false });

    return () => {
      container.removeEventListener("wheel", preventScroll);
    };
  }, []);

  // 직접 입력 모드 시작
  const startCustomInput = () => {
    setIsCustomInput(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // 태그 직접 입력 처리
  const handleCustomTagSubmit = (e) => {
    if (e.key === "Enter" && customTag.trim()) {
      // 띄어쓰기 제거
      const formattedTag = customTag.trim().replace(/\s+/g, "");

      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, formattedTag]);
        setCustomTag("");
        setIsCustomInput(false);
      }
    } else if (e.key === "Escape") {
      setIsCustomInput(false);
      setCustomTag("");
    }
  };

  // 태그 클릭시!!!!
  const handleTagClick = (tag) => {
    if (tag.name === "직접 입력") {
      startCustomInput();
      return;
    }

    if (selectedTags.includes(tag.name)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag.name));
    } else {
      // 3개 이상 선택 방지
      if (selectedTags.length >= 3) return;
      setSelectedTags([...selectedTags, tag.name]);
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className="w-full bg-yellow-50 rounded-lg p-8"
    >
      {/* 태그 목록을 map으로 순회하며 버튼 생성 */}
      <div
        className={`
          flex flex-nowrap overflow-x-auto overflow-y-hidden gap-2 py-4
          lg:grid lg:grid-cols-8 lg:auto-rows-auto lg:gap-2 lg:overflow-x-auto lg:overflow-y-hidden lg:gap-y-4
          scroll-smooth touch-pan-x
        `}
      >
        {tags.map((tag) => {
          if (tag.name === "직접 입력" && isCustomInput) {
            return (
              <div
                key={tag.id}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm bg-yellow-50"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={handleCustomTagSubmit}
                  placeholder="# 직접 입력"
                  className="w-full bg-transparent outline-none text-my-blue-1 placeholder-gray-400"
                  maxLength={10}
                />
              </div>
            );
          }

          return (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag)}
              className={`
                flex-shrink-0
                px-3 py-1.5 rounded-full text-sm
                transition-all duration-200 ease-in-out
                hover:scale-105 whitespace-nowrap
                ${
                  selectedTags.includes(tag.name)
                    ? "bg-my-blue-4 text-white"
                    : "bg-yellow-50 text-my-blue-1 hover:bg-blue-200"
                }
              `}
            >
              # {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
