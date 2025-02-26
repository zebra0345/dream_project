import { useState } from "react";

export default function SortButtons({ sortOption, setSortOption }) {
  const sortOptions = ["최신순", "조회순", "좋아요순", "댓글순"];

  return (
    <div className="flex items-center space-x-4 text-gray-600 text-sm mb-4">
      {sortOptions.map(option => (
        <button
          key={option}
          onClick={() => setSortOption(option)}
          className={`hover:text-black ${sortOption === option ? "font-bold text-black" : ""}`}
        >
          {sortOption === option ? "●" : "○"} {option}
        </button>
      ))}
    </div>
  );
}
