import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const maxPageNumbers = 5; // 한 번에 표시할 페이지 개수
  const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  return (
    <div className="flex justify-center items-center mt-4 space-x-2 text-gray-600">
      {/* 첫 페이지 이동 버튼 */}
      <button className="px-2" onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        &laquo;
      </button>

      {/* 이전 페이지 이동 버튼 */}
      <button className="px-2" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        &lt;
      </button>

      {/* 페이지 번호 */}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-full transition-all ${
            page === currentPage ? "bg-gray-300 font-bold" : "hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      {/* 다음 페이지 이동 버튼 */}
      <button className="px-2" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        &gt;
      </button>

      {/* 마지막 페이지 이동 버튼 */}
      <button className="px-2" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
        &raquo;
      </button>
    </div>
  );
}
