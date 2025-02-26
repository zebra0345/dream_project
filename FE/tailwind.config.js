/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", //src 모든파일에 tailwind 적용해줌
  ],
  darkMode: 'class',  // 다크모드 활성화 방식
  theme: {
    extend: {
      colors: {
        'my-blue': {
          1: '#003458',
          2: '#3F628A',
          3: '#DBF2FF',
          4: '#88A9D5',
          5: '#E8F0FE',
        },
        'hmy-blue': {
          1: '#002B48',
          2: '#304B6A',
          3: '#B9CFDA',
          4: '#728EB3',
        },
        'my-yellow': '#F9F871',
        'hmy-yellow': '#E0DF65',
        'my-red' : '#EB3223',
        'hmy-red' : '#C62A1D',
      },
      fontFamily: {
        'user-input': ['Noto Sans KR', 'sans-serif'],
        'main-title': ['kumar', 'sans-serif'],
      },

      animation: {
        'sparkle': 'sparkle 3s ease-in-out infinite',
        'badge-glow': 'badge-glow 3s ease-in-out infinite',
      },
      keyframes: {
        'sparkle': {
          '0%, 100%': {
            'text-shadow': '0 0 4px rgba(249, 248, 113, 0.3), 0 0 8px rgba(249, 248, 113, 0.2)',
            'opacity': '0.95'
          },
          '50%': {
            'text-shadow': '0 0 8px rgba(255, 255, 180, 0.6), 0 0 20px rgba(255, 255, 180, 0.4), 0 0 30px rgba(255, 255, 180, 0.2)',
            'opacity': '1'
          }
        },
        'badge-glow': {
          '0%, 100%': {
            'box-shadow': '0 0 4px rgba(219, 242, 255, 0.5), 0 0 8px rgba(63, 98, 138, 0.3)', // my-blue-3, my-blue-2
            'opacity': '0.95'
          },
          '50%': {
            'box-shadow': '0 0 8px rgba(219, 242, 255, 0.7), 0 0 15px rgba(63, 98, 138, 0.5), 0 0 20px rgba(0, 52, 88, 0.3)', // my-blue-3, my-blue-2, my-blue-1
            'opacity': '1'
          }
        },
      },
    },
  },
  plugins: [],
}