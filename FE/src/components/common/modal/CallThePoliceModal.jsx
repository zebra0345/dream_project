import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { PiSirenFill } from "react-icons/pi";
import api from '../../../services/api/axios';
import { successModalState } from '/src/recoil/atoms/modalState';
import { useSetRecoilState } from 'recoil';

export default function ReportModal({ isOpen, onClose, reportType, targetId }) {
  const [selectedReasons, setSelectedReasons] = useState([]); // 선택한 옵션
  const [comment, setComment] = useState(''); // 작성한 글
  const setSuccessModalState = useSetRecoilState(successModalState); // 성공모달

  //선택지
  const reportReasons = [
    { id: 1, label: '스팸 홍보/도배' },
    { id: 2, label: '욕설/협오/차별적 표현' },
    { id: 3, label: '개인정보 노출' },
    { id: 4, label: '불법 정보 공유' },
    { id: 5, label: '음란물/성적인 콘텐츠' },
  ];

  // 선택지 바뀔때마다 업데이트
  const handleReasonToggle = (reasonId) => {
    setSelectedReasons(prev =>
      prev.includes(reasonId)
        ? prev.filter(id => id !== reasonId)
        : [...prev, reasonId]
    );
  };
  
  // 신고버튼 눌렀을때 로직
  const handleSubmit = async  (e) => {
    e.preventDefault();
    // 선택된 신고 사유들의 label을 모아서 문자열로 만듦
    const selectedLabels = reportReasons
      .filter(reason => selectedReasons.includes(reason.id))
      .map(reason => reason.label)
      .join(', ');

    // 신고 사유와 코멘트 합치기
    const finalReason = comment 
      ? `${selectedLabels} - ${comment}`
      : selectedLabels;

    try {
      const mydata = {
        reportType: reportType.toUpperCase(), // "post" -> "POST"
        targetId: Number(targetId),  // 문자열인 경우를 대비해 숫자로 변환
        reason: finalReason
      };

    await api.post("/reports", mydata);

    console.log("신고성공");
    setSuccessModalState({
      isOpen: true,
      message: "신고가 접수되었습니다.",
      onCancel: () => {
        // 실행 취소 시 수행할 작업
        console.log('작업 취소됨');
      },
      isCancellable: false, // 실행 취소 버튼 표시 여부
    });
    
    setSelectedReasons([]);
    setComment('');
    onClose();
    } catch (error) {
      console.error('신고 처리 중 오류가 발생했습니다:', error);
      setSuccessModalState({
        isOpen: true,
        message: "신고 접수가 완료되지 못했습니다.",
        onCancel: () => {
          // 실행 취소 시 수행할 작업
          console.log('작업 취소됨');
        },
        isCancellable: false, // 실행 취소 버튼 표시 여부
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-white rounded-lg shadow-lg w-80"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <span className="text-my-red text-2xl"><PiSirenFill /></span>
                <h2 className="text-lg font-medium">게시글 신고하기</h2>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-2 mb-4 ">
                {reportReasons.map((reason) => (
                  <label key={reason.id} className="flex items-center gap-2 cursor-pointer ">
                    <input
                      type="checkbox"
                      checked={selectedReasons.includes(reason.id)}
                      onChange={() => handleReasonToggle(reason.id)}
                      className={`w-4 h-4 rounded `}
                    />
                    <span className="text-sm">{reason.label}</span>
                  </label>
                ))}
              </div>
              
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-24 p-2 text-sm border rounded-lg resize-none mb-4"
                placeholder="신고 내용을 입력해주세요."
              />
              
              <button
                type="submit"
                className={`w-full py-2 rounded-lg text-sm ${
                  selectedReasons.length === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 hover:bg-gray-300'
                }`}
                disabled={selectedReasons.length === 0}
              >
                신고
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}