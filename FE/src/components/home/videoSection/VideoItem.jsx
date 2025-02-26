export default function VideoItem({ title, content, videogif, bgcolor, location }) {
  // w-1/2 : 너비의 절반사용 w-3/5 : 너비의 60%사용용
  // location === 'left' ? 'md:rounded-l-2xl' : 'md:rounded-r-2xl'
  // 왼쪽이라면 왼쪽에 라운드주기 단, md보다 작아지면 라운드제거거
  const videoSection = (
    <div className="w-1/2 h-full overflow-hidden transition-all duration-1000 hover:w-3/5">
      <img 
        src={videogif} 
        alt={title}
        className={`w-full h-full object-cover   ${location === 'left' ? 'md:rounded-l-2xl' : 'md:rounded-r-2xl'}`}
      />
    </div>
  );

  const textSection = (
    <div className={`w-1/2 p-8 ${bgcolor}  h-full overflow-hidden transition-all duration-1000 hover:w-3/5 
                    ${location === 'right' ? 'md:rounded-l-2xl' : 'md:rounded-r-2xl'}`}>
      <h2 className="text-[36px] font-main-title font-bold mb-2  ">{title}</h2>
      <p className="text-gray-700  text-md  tracking-wider whitespace-pre-line leading-tight font-main-title font-semibold">{content}</p>
    </div>
  );
  // select-none : 텍스트 드래그 방지
  // transition-all duration-300 hover:scale-105  : 모든요소적용 0.3초동안 1.05배커짐
  // flex-col md:flex-row : md이상일때는 가로정렬, 화면줄이면 세로정렬
  return (
    <div className="flex flex-col md:flex-row items-center w-full max-w-7xl mx-auto 
                    p-4 h-80  duration-500 hover:scale-105 
                    cursor-default select-none">
      {/* location값에따라 영상위치 변경 */}
      {location === 'left' ? (
        <>
          {videoSection}
          {textSection}
        </>
      ) : (
        <>
          {textSection}
          {videoSection}
        </>
      )}
    </div>
  );
};
