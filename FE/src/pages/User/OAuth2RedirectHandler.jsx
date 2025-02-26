import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api/axios';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { provider } = useParams();

  useEffect(() => {
    console.log("찾아왔어.");
    
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // provider별로 다른 처리가 필요한 경우를 대비해 백엔드로 provider 정보도 함께 전달
      axios.post(`${API_BASE_URL}/api/auth/${provider}/callback`, { code })
        .then(response => {
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.removeItem('socialLoginPending');
          navigate('/');
        })
        .catch(error => {
          console.error('OAuth callback failed:', error);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [navigate, provider]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">로그인 처리 중...</h2>
        <p className="text-gray-600">{provider.toUpperCase()} 계정으로 로그인하고 있습니다.</p>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;