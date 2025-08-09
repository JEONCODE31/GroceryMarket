import React from 'react';
import styles from '../../styles/ShoppingCart/ShoppingCartFooter.module.css';

// 부모로부터 totalAmount와 shippingFee를 props로 받기 위한 인터페이스
interface ShoppingCartFooterProps {
    totalAmount: number;
    shippingFee: number;
}

const ShoppingCartFooter: React.FC<ShoppingCartFooterProps> = ({ totalAmount, shippingFee }) => {
    return (
        <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <p className="flex justify-between items-center text-lg md:text-xl font-semibold text-gray-700 mb-3">
                <span>총 상품금액:</span>
                <span>{totalAmount.toLocaleString()}원</span>
            </p>
            <p className="flex justify-between items-center text-lg md:text-xl font-semibold text-gray-700 mb-6">
                <span>배송비:</span>
                <span>{shippingFee.toLocaleString()}원</span>
            </p>
            <div className="h-px bg-gray-200 mb-6"></div>
            <p className="flex justify-between items-center font-bold text-xl md:text-2xl text-red-500">
                <span>총 결제금액:</span>
                <span>{(totalAmount + shippingFee).toLocaleString()}원</span>
            </p>

            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6 mt-8">
                <button className="bg-red-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-red-600 transition-colors duration-300">
                    주문하기
                </button>
                <button className="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-300 transition-colors duration-300">
                    계속 쇼핑하기
                </button>
            </div>
        </div>
    );
};

export default ShoppingCartFooter;
