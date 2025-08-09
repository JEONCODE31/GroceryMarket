import React from 'react';
import ShoppingCartHeader from '../ShoppingCart/ShoppingCartHeader';
import ShoppingCartFooter from '../ShoppingCart/ShoppingCartFooter';
import ShoppingCartBody from '../ShoppingCart/ShoppingCartBody';

const ShoppingCartPage = () => {
  return (
    <div>
    <ShoppingCartBody/>
    <ShoppingCartFooter/>
      {/* 기타 ShoppingCartPage 내용 */}
    </div>
  );
};

export default ShoppingCartPage;


