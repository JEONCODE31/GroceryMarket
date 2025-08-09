package jb.studio.ground.grocerymarket.mapper;

import jb.studio.ground.grocerymarket.domain.entity.CartItem;
import jb.studio.ground.grocerymarket.dto.auth.cart.CartItemDetailDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ShoppingCartMapper {

    // 1. 장바구니에 추가 또는 갱신 (ON DUPLICATE KEY UPDATE)
    void insertOrUpdateCartItem(@Param("item") CartItem item);

    // 2. 특정 상품이 장바구니에 이미 있는지 확인
    // userId와 productId를 Integer 타입으로 변경
    CartItem findCartItemByUserIdAndProductId(@Param("userId") Integer userId,
                                              @Param("productId") Integer productId);

    // 3. 수량만 업데이트
    void updateCartItemQuantity(CartItem item);

    // 4. 장바구니 목록 (상품 정보 포함 상세 DTO)
    // userId를 Integer 타입으로 변경
    List<CartItemDetailDto> findCartItemsWithDetailsByUserId(@Param("userId") Integer userId);

    // 5. 특정 상품 삭제
    // userId와 productId를 Integer 타입으로 변경
    void deleteCartItem(@Param("userId") Integer userId, @Param("productId") Integer productId);
}