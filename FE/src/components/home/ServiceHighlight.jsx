import { useNavigate } from 'react-router-dom';

const ServiceHighlight = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: '챌린지',
      description: '태그 분석을 통한 맞춤형 챌린지',
      color: '#3F628A',
      path: '/Challenge/list'
    },
    {
      title: '대시보드',
      description: '내 공부 시간을 한눈에',
      color: '#003458',
      path: '/User/DashBoardPage'
    },
    {
      title: '커뮤니티',
      description: '동료 학습자와 소통',
      color: '#88A9D5',
      path: '/Community/free'
    }
  ];

  return (
    <div className="py-16  flex justify-center">
      <div className="flex justify-between max-w-[1380px]  w-full rounded-xl overflow-hidden">
        {services.map((service, index) => (
          <div 
            key={index} 
            className={`w-1/3 p-6 text-center hover:shadow-lg transition cursor-pointer
              ${index === 0 ? 'rounded-l-xl' : ''} 
              ${index === services.length - 1 ? 'rounded-r-xl' : ''}`}
            style={{ backgroundColor: service.color, color: 'white' }}
            onClick={() => navigate(service.path)}
          >
            <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceHighlight;
