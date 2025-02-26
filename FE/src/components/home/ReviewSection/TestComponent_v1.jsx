import { useEffect, useRef, useState } from 'react';

export default function TestComponent() {
  const [backgroundColor, setBackgroundColor] = useState('white');
  const componentRef = useRef(null);
  const c1 = [0,52,88]
  const c2 = [15,15,20]

  useEffect(() => {
    const handleScroll = () => {
      const componentTop = componentRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (componentTop < windowHeight) {
        const scrollPercentage = Math.min((windowHeight - componentTop) / windowHeight, 1);
        const newBackgroundColor = `radial-gradient(ellipse at center, 
              rgb(${255- scrollPercentage * (255 - c1[0])}, 
              ${255- scrollPercentage * (255 - c1[1])}, 
              ${255- scrollPercentage * (255 - c1[2])}) 0%, 
              rgba(${255 - scrollPercentage * (255 - c2[0])}, 
              ${255 - scrollPercentage * (255 - c2[1])}, 
              ${255 - scrollPercentage * (255 - c2[2])}, 
              ${scrollPercentage}) 100%)`;
        setBackgroundColor(newBackgroundColor);
      } else {
        setBackgroundColor('white');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={componentRef}
      className="h-screen"
      style={{ background: backgroundColor }}
    >
      <h1>Test Component</h1>
    </div>
  );
}