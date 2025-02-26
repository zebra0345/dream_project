// 이메일 유효성 검사
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// 비밀번호 유효성 검사(영문, 숫자, 특수문자 조합 8~16자)
export const validatePassword = (password, email = "") => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
  const containsKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
  const emailPrefix = email ? email.split("@")[0] : ""; // 이메일의 @앞 부분
  const isEmailPart = emailPrefix && password.includes(emailPrefix); // 이메일 vs 비밀번호

  if (!passwordRegex.test(password)) {
    return "비밀번호는 영문, 숫자, 특수문자를 포함해 8~16자로 작성해주세요";
  }
  if (containsKorean.test(password)) {
    return "비밀번호에 한글은 포함될 수 없습니다";
  }
  if (isEmailPart) {
    return "비밀번호는 이메일과 동일하게 설정할 수 없습니다";
  }
  return "";
};

// 이름 유효성 검사
export const validateName = (name) => {
  const fullKoreanRegex = /^[가-힣]+$/; // 완전한 한글로만 구성된 경우
  const fullEnglishRegex = /^[A-Za-z]+$/; // 영어로만 구성된 경우
  if (!name.trim()) {
    return "이름을 입력해주세요.";
  }
  // 한글인 경우
  if (fullKoreanRegex.test(name)) {
    if (name.length < 2) {
      return "이름은 최소 2글자 이상이어야 합니다.";
    }
  }
  // 영어인 경우
  else if (fullEnglishRegex.test(name)) {
    if (name.length < 2) {
      return "이름은 최소 2글자 이상이어야 합니다.";
    }
  }
  // 한글이나 영어가 아닌 경우
  else {
    return "이름은 완전한 한글 또는 영어로 입력해야 합니다.";
  }
  return "";
};

// 닉네임 유효성 검사(영어, 한글만 포함 2~12자)
export const validateNickname = (nickname) => {
  const nicknameRegex = /^[A-Za-z가-힣]{2,12}$/;
  if (!nicknameRegex.test(nickname)) {
    return "닉네임은 영어 또는 한글만 포함하여, 2~12자로 작성해주세요.";
  }
  return "";
};
