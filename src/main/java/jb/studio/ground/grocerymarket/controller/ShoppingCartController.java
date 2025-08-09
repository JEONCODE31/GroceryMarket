package jb.studio.ground.grocerymarket.controller;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import jakarta.validation.Valid;
import jb.studio.ground.grocerymarket.dto.auth.cart.AddToCartRequest;
import jb.studio.ground.grocerymarket.dto.auth.cart.CartItemDetailDto;
import jb.studio.ground.grocerymarket.security.CustomUserDetails;
import jb.studio.ground.grocerymarket.service.ShoppingCartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;

    @Autowired
    public ShoppingCartController(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    // userId를 Integer 타입으로 변경
    private Integer getUserIdFromAuthentication(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            // CustomUserDetails의 getUserId()가 Integer를 반환하도록 수정 필요
            return ((CustomUserDetails) principal).getUserId().intValue();
        }
        return null;
    }

    @PostMapping
    public ResponseEntity<Void> addItemToCart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid AddToCartRequest request
    ) {
        // userId를 Integer 타입으로 변경
        Integer userId = userDetails.getUserId().intValue(); // CustomUserDetails의 userId를 intValue()로 변환
        shoppingCartService.addProductToCart(userId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<CartItemDetailDto>> getCartItems(Authentication authentication) {
        Integer userId = getUserIdFromAuthentication(authentication);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<CartItemDetailDto> detailedCartItems = shoppingCartService.getDetailedCartItems(userId);
        return ResponseEntity.ok(detailedCartItems);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeItemFromCart(@PathVariable Integer productId, Authentication authentication) {
        Integer userId = getUserIdFromAuthentication(authentication);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        shoppingCartService.removeProductFromCart(userId, productId);
        return ResponseEntity.ok().build();
    }
}