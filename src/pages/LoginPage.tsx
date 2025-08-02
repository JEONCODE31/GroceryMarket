import React from 'react';
import LoginHeader from '../Login/LoginHeader';
import LoginPageBody from '../Login/LoginPageBody';
import LoginFooter from '../Login/LoginFooter';

const LoginPage = () => {
  return (
    <div>
      <LoginHeader />
      <LoginPageBody/>
      <LoginFooter/>
      {/* 기타 LoginPage 내용 */}
    </div>
  );
};

export default LoginPage; 