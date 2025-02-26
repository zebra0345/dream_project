import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [titleQuery, setTitleQuery] = useState("");
  const [tagQuery, setTagQuery] = useState("");

  return (
    <div className="flex justify-between items-center mb-4">
      {/* 🔍 제목 검색 */}
      <div className="flex items-center w-[45%] h-10 border rounded bg-gray-100 px-2">
        <span className="text-blue-500 mr-2">🔍</span>
        <input
          type="text"
          placeholder="키워드 검색"
          className="bg-transparent outline-none flex-1 text-sm"
          value={titleQuery}
          onChange={(e) => setTitleQuery(e.target.value)}
        />
        <button
          onClick={() => onSearch(titleQuery, "")}
          style={{ fontFamily: "mbc" }}
          className="px-3 py-1 bg-my-blue-1 text-white text-sm rounded ml-2"
        >
          검색
        </button>
      </div>

      {/* # 태그 검색 */}
      <div className="flex items-center w-[45%] h-10 border rounded bg-gray-100 px-2">
        <span className="text-gray-500 italic mr-2">#</span>
        <input
          type="text"
          placeholder="태그 검색"
          className="bg-transparent outline-none flex-1 text-sm italic text-gray-500"
          value={tagQuery}
          onChange={(e) => setTagQuery(e.target.value)}
        />
        <button
          onClick={() => onSearch("", tagQuery)}
          style={{ fontFamily: "mbc" }}
          className="px-3 py-1 bg-my-blue-1 text-white text-sm rounded ml-2"
        >
          검색
        </button>
      </div>
    </div>
  );
}
