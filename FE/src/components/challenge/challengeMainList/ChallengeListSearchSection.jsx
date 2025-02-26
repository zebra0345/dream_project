import { useEffect, useState } from "react";
import challengeApi from "../../../services/api/challengeApi";
import { tagApi } from "../../../services/api/tagApi";
import { IoSearch } from "react-icons/io5";
import { X } from 'lucide-react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { 
  searchForChallengeInputState,
  popularChallengesState, 
  runningChallengesState, 
  recruitingChallengesState,
  searchForChallengeTagState, 
} from '../../../recoil/atoms/challenge/challengeListState';
import ChallengeListTagListSection from "./ChallengeListTagListSection";
import { challengeSelectedTagsState } from "../../../recoil/atoms/tags/selectedTagsState";


export default function ChallengeListSearchSection() {
  // 챌린지 목록 상태 관리
  const [inputValue, setInputValue] = useRecoilState(searchForChallengeInputState);
  const setPopularChallenges = useSetRecoilState(popularChallengesState);
  const setRunningChallenges = useSetRecoilState(runningChallengesState);
  const setRecruitingChallenges = useSetRecoilState(recruitingChallengesState);
  const [selectedTags, setSelectedTags] = useRecoilState(challengeSelectedTagsState);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myTags, setMyTags] = useRecoilState(searchForChallengeTagState);

  // 챌린지 데이터 가져오기
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await challengeApi.getSearchedChallenges(
        );
        setPopularChallenges(response.data.popularChallenges);
        setRunningChallenges(response.data.runningChallenges);
        setRecruitingChallenges(response.data.recruitingChallenges);
      } catch (err) {
        setError('챌린지 목록을 불러오는데 실패했습니다.');
        console.log("챌린지목록 불러오기실패:",err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen w-full bg-blue-300 flex items-center justify-center">
  //       <p className="text-lg">로딩 중...</p>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="relative flex  flex-col w-full h-60 cursor-default mt-5 justify-center items-center">
  //       <p className="text-lg text-red-600">{error}</p>
  //     </div>
  //   );
  // }

  // 검색 버튼 클릭 핸들러
  const handleSearchClick = async () => {
    try {
      setLoading(true); // 로딩 상태 시작
      
      const response = await challengeApi.getSearchedChallenges(
        inputValue || '',           // keyword parameter
        selectedTags.length > 0 ? selectedTags.join(',') : undefined  // tags parameter 태그가 없으면 undefined
      );
      setPopularChallenges(response.data.popularChallenges);
      setRunningChallenges(response.data.runningChallenges);
      setRecruitingChallenges(response.data.recruitingChallenges);
      
    } catch (err) {
      setError('챌린지 검색에 실패했습니다.');
      console.log("챌린지 검색 실패:", err);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const ClickSearchClearButton = () => {
    setInputValue('')
  }

  useEffect(() => {
    if(inputValue === '') {
      handleSearchClick()
    }
  }, [inputValue])

  return (
    <>
      <div className="relative flex  flex-col w-full  cursor-default mt-5">
        {/* 왼쪽 Start Your Challenge 섹션 */}
        <div className="flex">
          <div className="flex bg-my-blue-1 px-4 h-10 justify-between items-center w-full  rounded-lg transition-all duration-300 ">
            <div className=" w-full mr-1 flex gap-1 items-center text-white">
              <IoSearch className="text-xl"/>
              <input type="text"   
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-my-blue-1 focus:outline-none min-w-0 text-white border rounded-sm border-gray-600 py-0.5 flex-shrink w-full" 
              />
            </div>
            <button onClick={ClickSearchClearButton} className=" hover:rotate-90 transition-transform duration-300 text-white "><X size={24} /></button>
          </div>
          <div className="w-80 md:w-60 transition-all duration-300">

          </div>
        </div>

        {/* 태그영역 */}
        <div className="flex-1  mt-4 rounded-xl mr-1 text-white 
          opacity-0 sm:opacity-100 invisible sm:visible transition duration-800 "> 
          <div className="w-full h-full flex items-center">
            <ChallengeListTagListSection isEdittag={true}/>
          </div>
        </div>

        {/* Create 버튼 */}
        <div className="absolute -top-0 right-0 flex justify-center items-center bg-white rounded-t-lg rounded-bl-lg pr-1 transition duration-300">
          <button
            onClick={handleSearchClick}
            className=" bg-gradient-to-b from-hmy-blue-1 to-hmy-blue-2 text-white text-2xl px-12 h-12 rounded-lg hover:bg-hmy-blue-1 transition-colors "
          >
            search
            {/* {loading ? 'loadin':'search'}
            {!loading && error ? error:''} */}
          </button>
        </div>
      </div>
    </>
  );
};