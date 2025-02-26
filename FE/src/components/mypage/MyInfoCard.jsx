import { useRecoilState, useSetRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/authState";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import getUserApi from "../../services/api/getUserApi";
import { successModalState } from "/src/recoil/atoms/modalState";
import { validateNickname, validateName } from "../../utils/validation";

// 프로필 기본 이미지
import defaultUserImageOrange from "/logo/dreammoa-bg.png";

import authChangeApi from "../../services/api/authChangeApi";
import { authApi } from "../../services/api/authApi";

// 중복되는 CSS 변수분리
const totalBackGroundColor = "bg-white";
const tagBodyStyles = "flex items-center gap-12";
const tagTitleStyles = `bg-blue-200 bg-opacity-30 px-4 py-2 rounded-xl cursor-default transition-all duration-300
                        text-xl w-32 text-center hover:bg-my-yellow text-gray-900 hover:bg-opacity-30`;
const tagContentStyles = "text-gray-800 cursor-default text-xl";

export default function MyInfoCard({
  isEditMode,
  setIsEditModeState,
  setIsVerified,
}) {
  // 상태 관리
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [inputNameValue, setInputNameValue] = useState(userInfo.name);
  const [inputNicknameValue, setInputNicknameValue] = useState(
    userInfo.nickname
  );
  const [inputPasswordValue1, setInputPasswordValue1] = useState(null);
  const [inputPasswordValue2, setInputPasswordValue2] = useState(null);
  const [inputPasswordValue3, setInputPasswordValue3] = useState(null);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState("");
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);
  const [wasNicknameChanged, setWasNicknameChanged] = useState(false);
  const [isNameVerified, setIsNameVerified] = useState(false);
  
  const fileInputRef = useRef(null);
  const setSuccessModalState = useSetRecoilState(successModalState);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nickname") {
      if (isNicknameVerified) {
        setIsNicknameVerified(false);
        setWasNicknameChanged(true);
      }

      // 빈 값일 경우 현재 닉네임으로 설정
      setInputNicknameValue(value || userInfo.nickname);
    } else if (name === "name") {
      if (isNameVerified) {
        setIsNameVerified(false);
      }
      // 빈 값일 경우 현재 이름으로 설정
      setInputNameValue(value || userInfo.name);
    }
  };

  // 이름 검증
  const handleCheckName = () => {
    const errorMessage = validateName(inputNameValue);
    if (errorMessage) {
      setSuccessModalState({
        isOpen: true,
        message: errorMessage,
        onCancel: () => console.log("작업 취소됨"),
        isCancellable: false,
      });
    } else {
      setSuccessModalState({
        isOpen: true,
        message: "사용 가능한 이름입니다.",
        onCancel: () => console.log("작업 취소됨"),
        isCancellable: false,
      });
      setIsNameVerified(true);
    }
  };

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    try {
      // 현재 사용자의 닉네임과 동일한 경우 즉시 승인
      if (inputNicknameValue === userInfo.nickname) {
        setSuccessModalState({
          isOpen: true,
          message: "현재 사용중인 닉네임입니다.",
          onCancel: () => console.log("작업 취소됨"),
          isCancellable: false,
        });
        setIsNicknameVerified(true);
        setWasNicknameChanged(false);
        return;
      }

      // 다른 닉네임인 경우 중복 체크
      const isAvailable = await authApi.checkNickname(inputNicknameValue);
      if (isAvailable) {
        setSuccessModalState({
          isOpen: true,
          message: "사용 가능한 닉네임입니다.",
          onCancel: () => console.log("작업 취소됨"),
          isCancellable: false,
        });
        setIsNicknameVerified(true);
        setWasNicknameChanged(false);
      } else {
        setSuccessModalState({
          isOpen: true,
          message: "이미 사용 중인 닉네임입니다.",
          onCancel: () => console.log("작업 취소됨"),
          isCancellable: false,
        });
        setIsNicknameVerified(false);
      }
    } catch (error) {
      console.error("닉네임 중복 확인 실패:", error);
    }
  };

  // 사진변경 클릭버튼 로직
  const handleImageClick = () => {
    if (isEditMode && !isPasswordMode) {
      fileInputRef.current.click();
    }
  };

  // 사진변경 실제 로직
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    console.log("Selected File:", file); // 선택된 파일 확인
    console.log("Current userInfo:", userInfo); // 현재 userInfo 상태 확인

    if (file) {
      try {
        // 서버에 이미지 업로드
        const response = await getUserApi.uploadProfileImage(file, userInfo);
        console.log("성공응답1! : ", response);
        console.log("성공응답2! : ", response.data.message);
        console.log("성공응답3! : ", response.data.imageUrl);

        // 서버에서 받은 이미지 URL로 프로필 업데이트
        if (
          response.data.message === "회원 정보가 성공적으로 수정되었습니다."
        ) {
          console.log("수정하자!");

          // 프로필 정보를 새로 불러오기
          try {
            const userResponse = await getUserApi.getUserInfo();
            console.log("한번더 확인 :", userResponse);
            setSuccessModalState({
              isOpen: true,
              message: "프로필사진 변경 완료",
              onCancel: () => {
                // 실행 취소 시 수행할 작업
                console.log("작업 취소됨");
              },
              isCancellable: false, // 실행 취소 버튼 표시 여부
            });

            if (userResponse.data) {
              setUserInfo(userResponse.data);
            }
          } catch (error) {
            console.error("프로필 정보 갱신 실패:", error);
          }
        }
      } catch (error) {
        console.error("프론트에서 이미지 변경 실패:", error);
      }
    }
  };

  // 프로필 정보 저장 핸들러
  const handleSaveProfile = async () => {
    try {
      setIsVerified(1);
      // 현재 값과 다른 경우에만 해당 필드 업데이트
      const updatedName = inputNameValue !== userInfo.name ? inputNameValue : undefined;
      const updatedNickname = inputNicknameValue !== userInfo.nickname ? inputNicknameValue : undefined;

      // 변경된 필드가 있는 경우에만 API 호출
      if (updatedName || updatedNickname) {
        const response = await getUserApi.uploadProfileInfo(
          updatedName || userInfo.name,
          updatedNickname || userInfo.nickname
        );

        if (response.data.message === "회원 정보가 성공적으로 수정되었습니다.") {
          try {
            const userResponse = await getUserApi.getUserInfo();
            setSuccessModalState({
              isOpen: true,
              message: "변경 완료",
              onCancel: () => console.log("작업 취소됨"),
              isCancellable: false,
            });

            if (userResponse.data) {
              setUserInfo(userResponse.data);
            }
            setIsEditModeState(false);
          } catch (error) {
            console.error("프로필 정보 갱신 실패:", error);
          }
        }
      } else {
        // 변경사항이 없는 경우
        setSuccessModalState({
          isOpen: true,
          message: "변경사항이 없습니다.",
          onCancel: () => console.log("작업 취소됨"),
          isCancellable: false,
        });
        setIsEditModeState(false);
      }
    } catch (error) {
      console.error("프로필 정보 변경 실패:", error);
    }
  };

  // 비밀번호 일치여부검사
  useEffect(() => {
    if (inputPasswordValue3) {
      setIsPasswordCorrect(inputPasswordValue2 === inputPasswordValue3);
    } else {
      setIsPasswordCorrect(null);
    }
  }, [inputPasswordValue2, inputPasswordValue3]);

  // 비밀번호 변경 상태에서 "저장","취소버튼" 로직
  const passwordChangeButton = async (type) => {
    if (type === "save") {
      console.log("저장");
      console.log(inputPasswordValue1); // 현재비밀번호
      console.log(inputPasswordValue2); // 새 비밀번호
      console.log(inputPasswordValue3); // 비밀번호 확인
      try {
        const response = await authChangeApi.changePassword(
          inputPasswordValue1,
          inputPasswordValue2,
          inputPasswordValue3
        );
        console.log("비밀번호 변경 결과:", response);
        setSuccessModalState({
          isOpen: true,
          message: "비밀번호 변경 완료",
          onCancel: () => {
            // 실행 취소 시 수행할 작업
            console.log("작업 취소됨");
          },
          isCancellable: false, // 실행 취소 버튼 표시 여부
        });
      } catch (error) {
        console.log("비밀번호 변경 에러: ", error);
        setSuccessModalState({
          isOpen: true,
          message: "비밀번호 변경 에러",
          onCancel: () => {
            // 실행 취소 시 수행할 작업
            console.log("작업 취소됨");
          },
          isCancellable: false, // 실행 취소 버튼 표시 여부
        });
      } finally {
        console.log("ok");
      }
    } else if (type === "cancel") {
      console.log("취소");
    } else {
      console.log("뭘 누른거야");
    }
    setInputNicknameValue(null);
    setInputPasswordValue1(null);
    setInputPasswordValue2(null);
    setInputPasswordValue3(null);
    setIsPasswordMode(false);
  };

  // 화면 렌더링시 초기상태
  useEffect(() => {
    setInputNameValue(userInfo.name);
    setInputNicknameValue(userInfo.nickname);
    setInputPasswordValue1(null);
    setInputPasswordValue2(null);
    setInputPasswordValue3(null);
    setIsPasswordMode(false);
    // 초기에는 검증 완료 상태로 설정 (현재 값 사용 중)
    setIsNicknameVerified(true);
    setWasNicknameChanged(false);
    setIsNameVerified(true);
  }, [isEditMode, userInfo]);

  // 기본화면 or 수정화면 or 비밀번호변경화면 전환 로직
  const renderContent = () => {
    // 기본화면
    if (!isEditMode) {
      return (
        <motion.div
          key="edit"
          className="flex-1 py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <div className="flex flex-col h-full justify-between py-8 gap-8 lg:gap-0 ml-8 lg:ml-16">
            {/* 이름 */}
            <div className={`${tagBodyStyles}`}>
              <span className={`${tagTitleStyles}`}>name</span>
              <span className={`${tagContentStyles}`}>{userInfo.name}</span>
            </div>

            {/* 닉네임 */}
            <div className={`${tagBodyStyles}`}>
              <span className={`${tagTitleStyles}`}>nickname</span>
              <span className={`${tagContentStyles}`}>{userInfo.nickname}</span>
            </div>

            {/* 이메일 */}
            <div className={`${tagBodyStyles}`}>
              <span className={`${tagTitleStyles}`}>email</span>
              <span className={`${tagContentStyles}`}>{userInfo.email}</span>
            </div>
          </div>
        </motion.div>
      );
    }

    // 비밀번호 변경화면
    if (isPasswordMode) {
      return (
        <div>
          <motion.div
            key="passwordchange"
            className="flex-1 h-full pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <>
              <h1 className="text-2xl ml-4 mb-2 cursor-default">보안 설정</h1>
              <div className="border mx-4 rounded-xl border-2 border-gray-200">
                <div className="flex flex-col h-full justify-between py-3 gap-8 lg:gap-4 ml-4 lg:ml-12">
                  <div className={`flex items-center gap-2`}>
                    <span
                      className={`pl-3 py-2 rounded-xl cursor-pointer transition-all duration-300
                          text-xl w-80 text-start text-gray-900`}
                    >
                      현재 비밀번호
                    </span>
                    <input
                      type="password"
                      placeholder="remember"
                      className={`pl-2 border border-2 focus:border-my-blue-4 mr-2 py-1 rounded-md w-full focus:outline-none`}
                      onChange={(e) => setInputPasswordValue1(e.target.value)}
                    />
                  </div>
                  <div className={`flex items-center gap-2`}>
                    <span
                      className={`pl-3 py-2 rounded-xl cursor-pointer transition-all duration-300
                          text-xl w-80 text-start text-gray-900`}
                    >
                      새 패스워드
                    </span>
                    <input
                      type="password"
                      placeholder="your"
                      className={`pl-2 border border-2 focus:border-my-blue-4 mr-2 py-1 rounded-md w-full focus:outline-none`}
                      onChange={(e) => setInputPasswordValue2(e.target.value)}
                    />
                  </div>
                  <div className={`flex items-center gap-2`}>
                    <span
                      className={`pl-3 py-2 rounded-xl cursor-pointer transition-all duration-300
                          text-xl w-80 text-start text-gray-900`}
                    >
                      새로운 패스워드 확인
                    </span>
                    <input
                      type="password"
                      placeholder="password"
                      className={`pl-2 border border-2 focus:border-my-blue-4 mr-2 py-1 rounded-md w-full focus:outline-none`}
                      onChange={(e) => setInputPasswordValue3(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="gap-4 mx-4 flex justify-end">
                <button
                  className={`bg-my-blue-4 px-4 py-1 mt-2 rounded-xl cursor-pointer transition-all duration-300
                  text-xl w-42 text-center hover:bg-my-blue-1 hover:text-white text-gray-900 whitespace-nowrap`}
                  onClick={() => passwordChangeButton("cancel")}
                >
                  취소
                </button>
                <button
                  onClick={() => passwordChangeButton("save")}
                  disabled={!isPasswordCorrect || !inputPasswordValue1}
                  className={`px-4 py-1 mt-2 rounded-xl cursor-pointer transition-all duration-300
                text-xl w-42 text-center whitespace-nowrap
                ${
                  isPasswordCorrect && inputPasswordValue1
                    ? "bg-my-blue-1 text-white hover:bg-hmy-blue-1"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                >
                  저장
                </button>
              </div>
            </>
          </motion.div>
        </div>
      );
    }

    // 수정화면
    return (
      <motion.div
        key="view"
        className="flex-1 py-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
      >
        <div className="flex flex-col h-full justify-between py-2 gap-8 lg:gap-0 ml-8 lg:ml-16">
          {/* 이름 입력 필드 */}
          <div className={`flex items-center pr-3 w-full justify-between`}>
            <div className="flex items-center gap-12 text-xl border-4 hover:border-my-blue-4 focus-within:border-my-blue-4 w-full mr-8 pr-3 rounded-xl text-gray-900 transition-all duration-300">
              <span className="text-center w-32 px-4 py-2 cursor-pointer">
                name
              </span>
              <input
                type="text"
                name="name"
                // placeholder={userInfo.name}
                value={inputNameValue}
                className="w-full focus:outline-none"
                onChange={handleChange}
              />
            </div>
            {/* 이름 check 버튼 */}
            <button
              className={`bg-gray-300 px-4 py-2 rounded-xl transition-all duration-300
            text-xl w-32 text-center text-white whitespace-nowrap ${
              inputNameValue && !isNameVerified
                ? "bg-my-blue-4 hover:bg-hmy-blue-4 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
              onClick={
                inputNameValue && !isNameVerified ? handleCheckName : undefined
              }
              disabled={!inputNameValue || isNameVerified}
            >
              check
            </button>
          </div>

          {/* 닉네임 입력 필드 */}
          <div className={`flex items-center pr-3 w-full justify-between`}>
            <div className="flex items-center gap-12 text-xl border-4 hover:border-my-blue-4 focus-within:border-my-blue-4 w-full mr-8 pr-3 rounded-xl text-gray-900 transition-all duration-300">
              <span className="text-center w-32 px-4 py-2 cursor-pointer">
                nickname
              </span>
              <input
                type="text"
                name="nickname"
                // placeholder={userInfo.nickname}
                value={inputNicknameValue}
                className="w-full focus:outline-none"
                onChange={handleChange}
              />
            </div>
            {/* 닉네임 중복 확인 버튼 */}
            <button
              className={`bg-gray-300 px-4 py-2 rounded-xl transition-all duration-300
            text-xl w-32 text-center text-white whitespace-nowrap ${
              inputNicknameValue && !isNicknameVerified
                ? "bg-my-blue-4 hover:bg-hmy-blue-4 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
              onClick={
                inputNicknameValue && !isNicknameVerified
                  ? handleCheckNickname
                  : undefined
              }
              disabled={!inputNicknameValue || isNicknameVerified}
            >
              중복 확인
            </button>
          </div>

          {/* 이메일 */}
          <div
            className={`${tagBodyStyles} bg-gray-300 rounded-xl mr-3 hover:bg-gray-400 duration-300 cursor-pointer`}
          >
            <span
              className={`px-4 py-2 rounded-xl transition-all duration-300
              text-xl w-32 text-center text-gray-900`}
            >
              email
            </span>
            <span className={`${tagContentStyles}`}>{userInfo.email}</span>
          </div>
          {/* 비번교체 */}
          <div className={`${tagBodyStyles} mr-3 justify-between`}>
            <div className="flex space-x-2">
              <div
                className={`bg-gray-200 px-4 py-1 rounded-xl cursor-pointer transition-all duration-300
                      text-xl w-42 text-center hover:bg-my-blue-1 hover:text-white text-gray-900 whitespace-nowrap`}
                onClick={() => setIsPasswordMode(true)}
              >
                password change
              </div>
              <div
                className={`bg-gray-200 px-4 py-1 rounded-xl cursor-pointer transition-all duration-300
                      text-xl w-42 text-center hover:bg-my-blue-1 hover:text-white text-gray-900 whitespace-nowrap`}
                // onClick={()=> setIsDeletedMode(true)}
                // 회원탈퇴
              >
                delete ID
              </div>
            </div>
            <button
              className={`bg-gray-200 px-4 py-1 rounded-xl transition-all duration-300
                text-xl w-42 text-center whitespace-nowrap ${
                  isNicknameVerified && !wasNicknameChanged && isNameVerified
                    ? "bg-my-blue-1 hover:bg-hmy-blue-1 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              onClick={handleSaveProfile}
              disabled={
                !(isNicknameVerified && !wasNicknameChanged && isNameVerified)
              }
            >
              SAVE
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <div
        className={`flex flex-col lg:flex-row rounded-3xl border border-2 border-gray-300 p-1 ${totalBackGroundColor}`}
      >
        {/* 왼쪽 이미지 */}
        <div className="relative h-72 rounded-3xl overflow-hidden w-full lg:w-72 aspect-square flex-shrink-0 duration-500">
          {/* 기본화면 이미지 */}
          <img
            src={`${
              userInfo.profilePictureUrl
                ? userInfo.profilePictureUrl
                : defaultUserImageOrange
            }`}
            alt="Profile"
            className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110`}
          />
          {/* 수정화면 이미지 */}
          {isEditMode && !isPasswordMode && (
            <>
              {/* 뒷배경 흐리게 */}
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 hover:bg-black/40 duration-300"
                onClick={handleImageClick}
              >
                {/* 카메라 아이콘 */}
                <FaCamera
                  size={48}
                  className="text-gray-100 hover:text-gray-300 transition-colors duration-300"
                />
              </div>
              {/* 사진업로드 */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </>
          )}
        </div>
        {/* 오른쪽 개인정보들 */}
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </div>
    </>
  );
}
