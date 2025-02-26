import React, { useState } from 'react';
import { FaCopy } from "react-icons/fa6";

const InviteModal = ({ isOpen, onClose, inviteUrl }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // 모달이 닫혀있을 때는 렌더링하지 않음
  if (!isOpen) return null;

  // URL 복사 핸들러
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopySuccess(true);
      // 복사 성공 메시지를 2초 후에 리셋
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('URL 복사 실패:', err);
    }
  };

  return (
    // 모달 백그라운드 오버레이
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* 모달 컨테이너 */}
      <div className="bg-white rounded-lg p-1 w-full max-w-md">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl  text-gray-800">초대 링크</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 mr-3"
          >
            ✕
          </button>
        </div>

        {/* URL 표시 영역 */}
        <div className="mb-2">
          <div className="flex gap-2 text-gray-800">
            <input
              type="text"
              value={inviteUrl}
              readOnly
              className="w-full p-1 border rounded-lg bg-gray-50 text-gray-800" 
            />
            <button
              onClick={handleCopy}
              className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaCopy />
            </button>
          </div>
          
          {/* 복사 성공 메시지 */}
          {copySuccess && (
            <p className="text-green-500 mt-2 text-sm">
              링크가 클립보드에 복사되었습니다!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteModal;