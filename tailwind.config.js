/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}", // ✅ app 라우터 쓰면 필수
    "./pages/**/*.{ts,tsx}", // ✅ pages 라우터 쓰면 필수
    "./components/**/*.{ts,tsx}", // ✅ shadcn 컴포넌트
    "./src/**/*.{ts,tsx}", // ✅ src 폴더 안 쓰더라도 넣자
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")], // shadcn 쓰면 보통 이거 포함됨
};
