// src/pages/ProductRegisterPage.tsx

import React from 'react';
// ✨ ProductRegisterBody.tsx와 ProductRegisterFooter.tsx가
// ✨ 'src/ProductRegister/' 폴더 안에 있으므로, 경로를 다음과 같이 수정해야 합니다.
// ✨ (src/pages/ 에서 상위 폴더인 src/ 로 이동 후, ProductRegister 폴더로 들어갑니다)
import ProductRegisterBody from '../ProductRegisterPage/ProductRegisterBody';   // ✨ 'ProductRegisterPage' -> 'ProductRegister' 로 수정!
import ProductRegisterFooter from '../ProductRegisterPage/ProductRegisterFooter'; // ✨ 'ProductRegisterPage' -> 'ProductRegister' 로 수정!

const ProductRegisterPage: React.FC = () => {
  return (
    <div>
      {/* MainHeader는 App.tsx에서 전역적으로 렌더링되므로 
          여기서 ProductRegisterHeader를 직접 포함하지 않습니다.
          ProductRegisterPage는 App.tsx의 MainHeader 아래에 위치할 것입니다.
      */}
      <ProductRegisterBody />
      <ProductRegisterFooter />
    </div>
  );
};

export default ProductRegisterPage;