import { useRecoilState } from 'recoil';
import { searchForChallengeInputState, searchForChallengeTagState, searchedChallengesState } from '../../../recoil/atoms/challenge/challengeListState';
import ChallengeCardForSearchList from "./ChallengeCardForSearchList";
import { useEffect, useState, useRef, useCallback } from 'react';
import { SlArrowDownCircle } from "react-icons/sl";
import challengeApi from "../../../services/api/challengeApi";
import { debounce } from 'lodash';

export default function ChallengeListMoreMoreSection() {
 // 기존 상태 관리
 const [inputkeyword, setInputkeyword] = useRecoilState(searchForChallengeInputState);
 const [myTags, setMyTags] = useRecoilState(searchForChallengeTagState);
 const [searchedChallenges, setSearchedChallenges] = useRecoilState(searchedChallengesState);
 const [maxCards, setMaxCards] = useState(8);
 const [currentPage, setCurrentPage] = useState(-1);

 // 새로운 상태 추가: 화면에 보여줄 데이터와 미리 로드된 데이터 분리
 const [displayedContent, setDisplayedContent] = useState([]);
 const [preloadedData, setPreloadedData] = useState(null);
 const [isLoading, setIsLoading] = useState(false);
 const observerRef = useRef();
 const loadingRef = useRef();

 // 초기 데이터 설정
 useEffect(() => {
   if (searchedChallenges.content) {
     setDisplayedContent(searchedChallenges.content);
   }
 }, []);

 // 데이터 미리 불러오기 함수
 const preloadNextData = useCallback(
   debounce(async () => {
     if (isLoading || searchedChallenges.lastPage || preloadedData) return;

     try {
       setIsLoading(true);
       const nextPage = currentPage + 1;
       const result = await challengeApi.getMoreSearchedChallenges(
         inputkeyword,
         myTags,
         nextPage
       );
       console.log("결과 " ,result);
       

       // 미리 받은 데이터를 preloadedData에 저장
       setPreloadedData(result);
     } catch (error) {
       console.error("챌린지 프리로드 중 오류:", error);
     } finally {
       setIsLoading(false);
     }
   }, 500),
   [currentPage, inputkeyword, myTags, isLoading, searchedChallenges.lastPage, preloadedData]
 );

 // 버튼 클릭 시 미리 받은 데이터를 화면에 표시
 const getMoreChallenges = () => {
   if (!preloadedData) return;

   // 미리 받은 데이터를 화면에 추가
   setDisplayedContent(prev => [...prev, ...preloadedData.content]);
   setSearchedChallenges(prev => ({
     ...preloadedData,
     content: [...prev.content, ...preloadedData.content]
   }));
   
   // 상태 업데이트
   setCurrentPage(prev => prev + 1);
   setPreloadedData(null); // 미리 받은 데이터 초기화
 };

 // IntersectionObserver 설정 - 스크롤 감지 시 다음 데이터 미리 로드
 useEffect(() => {
   const observer = new IntersectionObserver(
     entries => {
       if (entries[0].isIntersecting && !preloadedData) {
         preloadNextData();
       }
     },
     { 
       threshold: 1.0,
       rootMargin: "100px"
     }
   );

   if (loadingRef.current) {
     observer.observe(loadingRef.current);
   }

   observerRef.current = observer;

   return () => {
     if (observerRef.current) {
       observerRef.current.disconnect();
     }
   };
 }, [preloadNextData]);

 // 반응형 설정 (기존 코드)
 useEffect(() => {
   const handleResize = () => {
     if (window.innerWidth >= 1024) setMaxCards(8);
     else if (window.innerWidth >= 768) setMaxCards(6);
     else if (window.innerWidth >= 640) setMaxCards(4);
     else setMaxCards(2);
   };

   handleResize();
   window.addEventListener('resize', handleResize);
   return () => window.removeEventListener('resize', handleResize);
 }, []);

 return (
   <>
     <div className="relative flex flex-col w-full cursor-default ">
       {/* 카드 영역 */}
       <div className="mb-2 flex-1  rounded-r-lg mr-1 text-black-800  transition duration-800  ">
         {searchedChallenges.totalElements !== 0 ? (
          <div className="w-full  gap-4  h-full grid grid-template-rows-[repeat(2,1fr)] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  items-center justify-items-center">
            {displayedContent.map((challenge) => (
                <ChallengeCardForSearchList 
                key={`${challenge.challengeId}`}
                  challenge={challenge}
                />
            ))}
          </div>
         ) : (
           <div className="w-full  flex justify-center  items-center">
             {/* <div className='mr-16'>natto</div> */}
           </div>
         )}
       </div>
       {/* 더보기 버튼 & 로딩 인디케이터 */}
       <div className="w-full flex flex-col items-center">
         {!searchedChallenges.lastPage && (
           <button 
             onClick={getMoreChallenges} 
             className={`mr-16 text-2xl mb-4 ${!preloadedData ? 'text-gray-400' : 'text-gray-700'}`}
             disabled={!preloadedData}
           >
             <SlArrowDownCircle className={isLoading ? 'animate-spin' : ''} />
           </button>
         )}
         {/* 무한 스크롤을 위한 로딩 감지 요소 */}
         <div ref={loadingRef} className="h-10">
           {isLoading && <div className="text-center"></div>}
         </div>
       </div>
     </div>
   </>
 );
}