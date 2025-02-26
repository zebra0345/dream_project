// src/components/common/SideNavbar.jsx
import { motion,useScroll   } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaFolder, FaAngleDoubleLeft , FaAngleDoubleRight } from "react-icons/fa";
import { BsClipboard2CheckFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { useRecoilState } from 'recoil';
import { isHideSideState } from '../../recoil/atoms/SidebarState';
import { BsStars } from "react-icons/bs";

// 공통 스타일 상수화
const commonStyles = "fixed left-0 cursor-grab z-50 bg-my-blue-1 rounded-tr-xl rounded-br-xl   hover:bg-hmy-blue-1 transition-colors duration-300 ease-in";
const buttonStyles = "w-full text-3xl hover:bg-my-blue-1 py-4 flex justify-center items-center text-opacity-70 hover:text-opacity-90 transition-colors duration-300 ease-in";



// 버튼 컴포넌트
const NavButton = ({ icon, additionalStyles = "", to = null }) => (
  to ? (
    <Link to={to} className={`${buttonStyles} ${additionalStyles}`}>
      {icon}
    </Link>
  ) : (
    <button className={`${buttonStyles} ${additionalStyles}`}>
      {icon}
    </button>
  )
);
const NavButtonStar = ({ icon, additionalStyles = "", to = null }) => (
  to ? (
    <Link to={to} className={`w-full text-3xl hover:bg-my-blue-1 py-4 flex justify-center items-center  hover:text-opacity-90 transition-colors duration-300 ease-in ${additionalStyles}`}>
      {icon}
    </Link>
  ) : (
    <button className={` w-full text-3xl hover:bg-my-blue-1 py-4 flex justify-center items-center text-my-yellow  hover:text-opacity-90 transition-colors duration-300 ease-in${additionalStyles}`}>
      {icon}
    </button>
  )
);

export default function SideNavbar() {
  const [isSetup , setIsSetup] = useState(true);
  const [isSmall, setIsSmall] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtention, setIsExtention] = useState("top-1/2");
  const [isHideSide, setIsHideSide] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const [isHideSideForRecoil, setIsHideSideForRecoil] = useRecoilState(isHideSideState);

  useEffect(() => {
    // isSetup 값이 변경될 때마다 실행
    setIsHideSideForRecoil(!isSetup); // isSetup이 false면 true로, true면 false로 설정
  }, [isSetup]);
  useEffect(() => {
    // isSetup 값이 변경될 때마다 실행
    setIsHideSideForRecoil(isHideSide); // isSetup이 false면 true로, true면 false로 설정
  }, [isHideSide]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(true);
      setTimeout(() => setIsScrolled(false), 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    console.log('isSetup:', isSetup , 'isSmall:', isSmall);
  }, [isSetup, isSmall]);

  return (
    <>
      <motion.div id="innerSideNavbar" className="fixed left-0 top-1/2 z-40 "
        animate={{ x: !isHideSide ? -100 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <button className='rounded-tr-xl py-10 px-1 rounded-br-xl bg-my-blue-1 text-white text-xs'
        onClick={() => setIsHideSide(false)}>
          <FaAngleDoubleRight/>
        </button>
      </motion.div>
      <motion.nav 
        id="outerSideNavbar"
        initial={{ y: '-50%' }}
        drag
        dragMomentum={false}
        dragElastic={0.3}
        dragConstraints={{ left: 0, right: window.innerWidth - 96 }}
        dragTransition={{
          power: 0.2,
          timeConstant: 200,  // 관성이 유지되는 시간
          modifyTarget: t => Math.round(t / 50) * 50  // 그리드에 스냅
        }}
        onDragStart={() => {
          setIsDragging(true);
          setIsSetup(false);
          setIsSmall(true);
        }}
        onDragEnd={(event, info) => {
          setTimeout(() => {
            setIsDragging(false);
          }, 0);
          
          if (info.point.x < 20 && !isSetup && isSmall) {
            setIsSetup(true);
            setIsSmall(false);
            setIsExtention('top-1/2')
          }
        }}

        animate={{
          width: isSmall ? '3rem' : '4rem',
          height: isSmall ? '3rem' : '21rem',
          x: isHideSide ? -100 : 0,
          y: isSetup && isScrolled ? '-48%' : '-50%',
          // transformOrigin: 'bottom'
          // y: isSetup ? '-50%' : 0
          // y : '-50%'
          // originY : 1
          // transformOrigin : "top right"
        }}
        transition={{ 
          width: { duration: 0.5, delay: 0.1 },
          height: { duration: 0.5, delay: 0.1 },
          x: { duration: 0.5, delay: 0.1 },
          y: { duration: 0.3, delay: 0 } 
        }}
        onClick={(e) => {
          if (isDragging) return;
          if (!isSetup) {
            setIsSmall(false);

            const centerY = window.innerHeight / 2;
            // console.log(e.clientY < centerY ? '위쪽' : '아래쪽');
            console.log(scrollY);
            
            setIsExtention(e.clientY < centerY);
          }
        }}
        onMouseLeave={() => {
          if (!isSetup) {
            setIsSmall(true);
          }
        }}
        className={`${commonStyles} ${isSetup ? '' : 'rounded-xl '} ${isExtention ? "top-1/2" : "bottom-1/2"} ` }
      >
        <div className={`${isSmall ? 
          'w-full py-2 flex justify-center items-center text-gray-400 text-3xl hover:rounded-xl hover:text-my-yellow transition-all duration-300' : 'hidden'}`}>
          <FaStar />
        </div>
        <div className={`${isSmall ? 'hidden' : 'h-full flex flex-col items-center '}`}>
          <NavButtonStar 
            icon={<FaStar />} 
            additionalStyles={`text-my-yellow rounded-tr-xl hover:rounded-tl-xl cursor-grab border-b-2 ` }
          />
          <NavButton icon={<BsStars />} additionalStyles='text-white border-b-2' to="/challenge/list"/>
          <NavButton icon={<BsClipboard2CheckFill />} additionalStyles='text-white border-b-2' to="/dashboard"/>
          <NavButton icon={<IoChatbubbleEllipsesSharp />} additionalStyles='text-white border-b-2' to="/community/free"/>



          <div className='hover:bg-my-blue-1 w-full rounded-br-xl h-full flex flex-col items-center hover:rounded-bl-xl'>
            <NavButton icon={<CgProfile />} additionalStyles="border-b-0 text-white" to="/mypage"/>
            <button className='text-white'
            onClick={() => setIsHideSide(true)}>
              <FaAngleDoubleLeft />
            </button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}