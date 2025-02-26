import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { HiOutlineChevronDoubleRight, HiOutlineChevronDoubleLeft } from "react-icons/hi";
import { WiDirectionUp } from "react-icons/wi";
import SideChatbarContentSection from "./SideChatbarContentSection";
import Filter from "badwords-ko";

export default function SideChatbar() {
  const [isOpen, setIsOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const filter = new Filter({ placeHolder: "😂" });

  const ChatRequest = (e) => {
    e.preventDefault(); // 새로고침 방지
    console.log(filter.clean(chatInput));
    setChatInput(""); // 입력값 초기화
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ChatRequest(e);
    }
  };
  useEffect(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [chatInput]);

  return (
    <>
              {/* 채팅창 닫음상태 */}
      <motion.div id="innerSideNavbar" className="fixed right-0 top-1/2 z-40"
        animate={{ x: !isOpen ? 0 : 100 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        // 고정 오른쪽중앙 zindex40(채팅창보단 뒤) 
        // padding왼쪽으로 살짝 4xl크기 margin top 해서 살짝 아래로 이동시킴
      >
        <button className=' px-1 text-my-blue-4 text-4xl mt-2'
        onClick={() => setIsOpen(true)}>
          <HiOutlineChevronDoubleLeft/>
        </button>
      </motion.div>

              {/* 채팅창 열림상태 */}
      <motion.div
        initial={{ x: "100%" }} // 기본 100% 길이
        animate={{ x: isOpen ? 0 : "120%" }} // 오픈이면 전부보여줌 닫으면 오른쪽으로 120퍼 이동 
        transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }} //1.2초동안 0.1초딜레이 빠르게나오고늦게들어가기
        className="fixed top-0 right-0 h-screen w-96 bg-gray-100 rounded-l-3xl z-50 
          flex flex-col "
        // 고정 오른쪽 상단부터 너비96 높이100% 왼쪽라운드많이 zindex50
      >
                  {/* OnOff 채팅창버튼 */}
        <button onClick={() => setIsOpen(false)}>
          <div className="rounded-full bg-gray-100 text-my-blue-4 text-3xl 
              p-2 top-1/2 fixed -translate-x-6">
          <HiOutlineChevronDoubleRight/>
          </div>
        </button>
                  {/* 채팅창 헤더 */}
        <button onClick={() => setIsOpen(false)}>
          <X className="fixed top-0 right-0 -translate-x-2 translate-y-3 
            text-gray-500 hover:text-gray-700 " />
        </button>
        <div className="flex justify-center items-center w-11/12
          pb-3 mt-3 ">
          <h2 className="text-lg font-semibold ">SSAFY 알고리즘 스터디 방</h2>
        </div>

        {/* 채팅창 메인구역 */}
        <SideChatbarContentSection />

                  {/* 채팅창 입력구역 */}
        <div className="absolute bottom-0 w-full pt-4 pl-4 pr-4 border-t ">
          <div className="flex flex-col items-center  ">
            <form onSubmit={ChatRequest}
            className="w-full p-1 rounded-2xl border border-my-blue-2 border-2 
            focus:outline-none focus:border-blue-500 flex ">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="input"
                style={{ height: 'auto', minHeight: '24px', maxHeight: '150px' }}
                className="bg-gray-100 w-full focus:outline-none ml-3 font-user-input resize-none overflow-hidden"
              />
              {/* 입력 버튼 */}
              <button  type="submit"
              className={`text-3xl  text-white rounded-xl hover:bg-my-blue-2 self-end h-7 flex items-center ${chatInput ? 'bg-my-blue-4' : 'bg-gray-300'}`}>
                <WiDirectionUp/>
              </button>
            </form>
            {/* 최하단 버튼들 */}
            <div className="flex gap-1 w-full">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                📎
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                😊
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                🔔
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};