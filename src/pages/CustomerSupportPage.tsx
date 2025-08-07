import React from 'react';
import CustomerSupportHeader from '../CustomerSupport/CustomerSupportHeader';
import CustomerSupportFooter from '../CustomerSupport/CustomerSupportFooter';
import CustomerSupportChat from '../CustomerSupport/CustomerSupportChat';
import CustomerBody from '../CustomerSupport/CustomerSupportBody';

const CustomerSupportPage = () => {
  return (
    <div>
      {/* 기타 CustomerSupportPage 내용 */}
      <CustomerBody/>
      <CustomerSupportFooter />
      <CustomerSupportChat />
    </div>
  );
};

export default CustomerSupportPage;
