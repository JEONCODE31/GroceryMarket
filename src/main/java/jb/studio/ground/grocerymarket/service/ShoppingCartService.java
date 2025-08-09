package jb.studio.ground.grocerymarket.service;

import jb.studio.ground.grocerymarket.domain.entity.CartItem;
import jb.studio.ground.grocerymarket.domain.entity.Product;
import jb.studio.ground.grocerymarket.dto.auth.cart.AddToCartRequest;
import jb.studio.ground.grocerymarket.dto.auth.cart.CartItemDetailDto;
import jb.studio.ground.grocerymarket.mapper.ProductMapper;
import jb.studio.ground.grocerymarket.mapper.ShoppingCartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShoppingCartService {

    private final ShoppingCartMapper shoppingCartMapper;
    private final ProductMapper productMapper;

    public List<CartItemDetailDto> getDetailedCartItems(Integer userId) {
        return shoppingCartMapper.findCartItemsWithDetailsByUserId(userId);
    }

    public void removeProductFromCart(Integer userId, Integer productId) {
        shoppingCartMapper.deleteCartItem(userId, productId);
    }

    private CartItem convertToEntity(Integer userId, AddToCartRequest request) {
        CartItem cartItem = new CartItem();
        cartItem.setUserId(userId);
        cartItem.setProductId(request.getProductId().intValue());
        cartItem.setQuantity(request.getQuantity());
        return cartItem;
    }

    public void addProductToCart(Integer userId, AddToCartRequest request) {
        // ProductMapper의 findProductById 메서드가 Integer를 받도록 수정 필요
        // 현재는 DTO의 Long을 Integer로 변환하여 사용
        Integer productId = request.getProductId().intValue();
        Product product = productMapper.findProductById(productId.intValue()); // ProductMapper 수정 전 임시로 longValue() 사용
        if (product == null) {
            throw new IllegalArgumentException("존재하지 않는 상품입니다.");
        }

        CartItem existingCartItem = shoppingCartMapper.findCartItemByUserIdAndProductId(userId, productId);

        if (existingCartItem != null) {
            int newQuantity = existingCartItem.getQuantity() + request.getQuantity();
            existingCartItem.setQuantity(newQuantity);
            shoppingCartMapper.updateCartItemQuantity(existingCartItem);
        } else {
            CartItem newCartItem = convertToEntity(userId, request);
            shoppingCartMapper.insertOrUpdateCartItem(newCartItem);
        }
    }
}