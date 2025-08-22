package jb.studio.ground.grocerymarket.controller;

import jb.studio.ground.grocerymarket.domain.entity.Product;
import jb.studio.ground.grocerymarket.domain.entity.User;
import jb.studio.ground.grocerymarket.service.ProductRegisterService;
import jb.studio.ground.grocerymarket.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductRegisterService productRegisterService;
    private final UserService userService;

    /**
     * 상품 재고 및 회원 정보를 한 번에 조회하는 단일 엔드포인트
     * 이 API는 프론트엔드의 관리자 대시보드 페이지에 필요한 모든 데이터를 제공합니다.
     * @return 상품 목록과 회원 목록을 포함하는 Map 형태의 응답
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getAdminDashboardData() {
        List<Product> products = productRegisterService.getAllProducts();
        List<User> users = userService.getAllUsers();

        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("products", products);
        dashboardData.put("users", users);

        return ResponseEntity.ok(dashboardData);
    }

    /**
     * 특정 상품의 재고 수량을 업데이트하는 엔드포인트
     * @param productId 재고를 변경할 상품의 ID
     * @param stockQuantity 새로 설정할 재고 수량
     * @return 성공 또는 실패 메시지
     */
    @PutMapping("/products/{productId}/stock")
    public ResponseEntity<String> updateProductStock(@PathVariable("productId") Integer productId, @RequestParam("stockQuantity") Integer stockQuantity) {
        try {
            productRegisterService.updateProductStock(productId, stockQuantity);
            return new ResponseEntity<>("Product stock updated successfully.", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating product stock: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 모든 회원 목록을 조회하는 엔드포인트
     * @return 모든 회원 객체 목록
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}