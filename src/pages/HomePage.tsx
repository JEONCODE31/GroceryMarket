// src/HomePage/HomePage.tsx (수정 제안 - App.tsx 중앙 관리 방식과 일치)

import React from 'react'; // ✨ useState, useEffect, useNavigate, jwtDecode 등 제거

// MainHeader는 App.tsx에서 전역으로 렌더링되므로 여기서 임포트하거나 사용할 필요 없음
import MainBody from '../HomePage/MainBody';
import MainFooter from '../HomePage/MainFooter';

// ✨ App.tsx로부터 받을 props 타입을 정의합니다.
interface HomePageProps {
  isLoggedIn: boolean;
  username: string | null;
  // isAdmin은 HomePage 자체에서 직접 사용되지 않고 MainHeader에서 사용되므로 여기서는 필요 없을 수 있습니다.
  // MainBody에서 isLoggedIn/username만 필요한 경우 HomePageProps에서 isAdmin을 제거해도 됩니다.
}

// ✨ App.tsx로부터 props를 받도록 컴포넌트 선언을 수정합니다.
const HomePage: React.FC<HomePageProps> = ({ isLoggedIn, username }) => {
  // 이제 HomePage는 자체적으로 로그인 상태나 토큰을 관리하지 않습니다.
  // 모든 정보는 App.tsx로부터 props로 받아서 MainBody에 전달하거나 필요에 따라 사용합니다.
  // 토큰 디코딩, 상태 초기화, navigate 등의 로직은 모두 App.tsx가 담당합니다.

  return (
    <div>
      {/* ✨ MainHeader는 App.tsx에서 직접 렌더링되므로, HomePage 내에서는 렌더링하지 않습니다. */}
      {/* <MainHeader isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} isAdmin={isAdmin} /> */}

      {/* MainBody와 MainFooter는 여전히 여기서 렌더링하고, 필요한 props를 전달합니다. */}
      <MainBody isLoggedIn={isLoggedIn} username={username} />
      <MainFooter />
    </div>
  );
};

export default HomePage;