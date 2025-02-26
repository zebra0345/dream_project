import api from './axios';

const getUserApi = {
  // 회원정보 조회
  getUserInfo: () => api.post('/user-info')
  .then(response => {
    console.log('회원정보조회');
    return response;
  })
  .catch(error => {
    console.error('에러 발생:', error);
    throw error;
  }),

  uploadProfileImage: (file, userInfo) => {
    const formData = new FormData();
    
    const profileData = {
      name: userInfo.name,
      nickname: userInfo.nickname,
      // password: 'skarl0240!' // 비밀번호 이제 안보냄
    };
    
    console.log('전송할 profileData:', profileData);

    const profileDataBlob = new Blob([JSON.stringify(profileData)], {
      type: 'application/json'
    });


    formData.append('profileData', profileDataBlob);
    formData.append('profilePicture', file);  // 직접 file 객체 사용

        console.log('Request URL:', '/update-profile');
        console.log('Profile Data:', profileData);
        console.log('이거 url?: ' , file);
        
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key} 내용:`, value);
        }
    const accessToken = localStorage.getItem("accessToken");
    return api.put('/update-profile', formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    )
    .then(response => {
      console.log('이미지 변경 성공:', response.data);
    //   console.log(api.post('/profile-picture' 
    //     , {
    //     headers: {
    //       'Authorization': `Bearer ${accessToken}`,
    //     }
    //   }
    // ))
      return response;
    })
    .catch(error => {
      console.error('이미지 변경 실패:', error);
      throw error;
    });
  },

  uploadProfileInfo: (inputNameValue, inputNicknameValue ) => {
    const formData = new FormData();
    
    const profileData = {
      name: inputNameValue,
      nickname: inputNicknameValue,
    };
    
    console.log('전송할 profileData:', profileData);

    const profileDataBlob = new Blob([JSON.stringify(profileData)], {
      type: 'application/json'
    });
    formData.append('profileData', profileDataBlob);
    // formData.append('profilePicture', file);  // 직접 file 객체 사용

        // console.log('Request URL:', '/update-profile');
        // console.log('Profile Data:', profileData);
        // console.log('이거 url?: ' , file);
        
        // console.log('FormData contents:');
        // for (let [key, value] of formData.entries()) {
        //   console.log(`${key} 내용:`, value);
        // }
    const accessToken = localStorage.getItem("accessToken");
    return api.put('/update-profile', formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    )
    .then(response => {
      console.log('정보 변경 성공:', response.data);
      return response;
    })
    .catch(error => {
      console.error('정보 변경 실패:', error);
      throw error;
    });
  },
};

export default getUserApi;