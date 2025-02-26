import { motion } from "framer-motion";
import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { HiOutlineChevronDoubleRight, HiOutlineChevronDoubleLeft } from "react-icons/hi";
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import useOpenViduChat from '../../../hooks/useOpenViduChat';
import { useRecoilState } from "recoil";
import { memoListState, showSummaryState } from "../../../recoil/atoms/challenge/ai/scriptState";
import { FaCopy } from "react-icons/fa6";

  // ☆★☆★☆★ 채팅창main ☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★

const ChatPanel = ({ session, sessionTitle, isChatOpen, setIsChatOpen }) => {
  const { messages, sendMessage } = useOpenViduChat(session);
  const messagesEndRef = useRef(null);
  const memoEndRef = useRef(null);
  const [showSummary, setShowSummary] = useRecoilState(showSummaryState); // 요약창 on off
  const [memoList, setMemoList] = useRecoilState(memoListState); // 채팅 기록저장용

  // 새 메시지가 올 때마다 스크롤을 맨 아래로
  const scrollToBottom = () => {
    if (!showSummary) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      memoEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // 기본 스크롤 아래 유지
  useEffect(() => {
    scrollToBottom();
  }, [messages,memoList, showSummary]);

  return (
    <>
      {/* 채팅창 닫음상태 */}
      <motion.div id="innerSideNavbar" className="fixed right-0 top-1/2 z-40"
        animate={{ x: !isChatOpen ? 0 : 100 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <button className=' px-1 text-my-blue-4 text-4xl mt-2' onClick={() => setIsChatOpen(true)}>
          <HiOutlineChevronDoubleLeft/>
        </button>
      </motion.div>
      {/* 채팅창 열림상태 */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isChatOpen ? 0 : "120%" }}
        transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
        className="fixed top-0 right-0 h-screen w-96 bg-white rounded-l-3xl z-50 flex flex-col "
      >
        {/* 열림상태 : OnOff 채팅창버튼 */}
        <button onClick={() => setIsChatOpen(false)}>
          <div className="rounded-full bg-white text-my-blue-4 text-3xl 
              p-2 top-1/2 fixed -translate-x-6">
          <HiOutlineChevronDoubleRight/>
          </div>
        </button>
        {/* 열림상태 : 헤더 */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-medium text-lg truncate text-gray-800">
            {sessionTitle || '채팅(session name : none)'}
          </h2>
          <button
            onClick={() => setIsChatOpen(false)}
            className=" text-gray-500  hover:bg-gray-100 rounded-full"
          >
            <X size={20} className='font-bold'/>
          </button>
        </div>
        {/* 열림상태 : 메시지 목록 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
          {!showSummary ? (
            // 채팅 메시지 목록
            <>
              {messages.map((message, index) => (
                <ChatMessage 
                  key={`${message.timestamp}-${index}`} 
                  message={message} 
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            // 메모장 컴포넌트
            <div className="relative h-full bg-white rounded-lg  shadow-inner flex flex-col">
              {/* 복사 버튼 추가 */}
              <div className="absolute bottom-0 right-0 mb-4 flex justify-end">
                <button
                  onClick={() => {
                    const allMemos = memoList.map(memo => memo.content).join('\n\n');
                    navigator.clipboard.writeText(allMemos)
                      .then(() => {
                        alert('모든 메모가 클립보드에 복사되었습니다.');
                      })
                      .catch(err => {
                        console.error('클립보드 복사 실패:', err);
                        alert('클립보드 복사에 실패했습니다.');
                      });
                  }}
                  className="bg-my-blue-3 p-1 rounded-md text-xl text-my-blue-1 hover:bg-my-yellow hover:text-gray-400 transition-colors duration-300 ease-in"
                >
                  <FaCopy />
                </button>
              </div>
              {/* 메모 내용 표시 영역 */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-2 ">
                {memoList.map((memo) => (
                  <div 
                    key={memo.id} 
                    className={`rounded text-gray-800 font-user-input text-sm ${
                      memo.content.startsWith('Memo : ') ? 'bg-my-yellow py-2 px-1' : 'bg-gray-50'
                    }`}
                  >
                    {/* content가 userinput으로 시작하면 해당 부분을 제거하고, 아니면 원본 그대로 표시 */}
                    {memo.content.startsWith('Memo : ') 
                      ? memo.content.replace('Memo : ', '').trim()
                      : memo.content
                    }
                  </div>
                ))}
                <div ref={memoEndRef} />
              </div>
            </div>
          )}
        </div>
        {/* 열림상태 : 입력창 */}
        <div className="relative bottom-0 w-full pt-4 pl-4 pr-4 border-t ">
          <ChatInput onSendMessage={sendMessage} />
        </div>
      </motion.div>
    </>
  );
};

export default ChatPanel;