package jb.studio.ground.grocerymarket.controller;

import jb.studio.ground.grocerymarket.domain.entity.Category; // Category 임포트 추가
import jb.studio.ground.grocerymarket.domain.entity.Product;
import jb.studio.ground.grocerymarket.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products") // 기본 경로 설정
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // 새로운 API 엔드포인트: 특정 카테고리 및 하위 카테고리 상품 조회 (페이지네이션)
    // 예시 URL: /api/products/by-category?categoryId=1&page=1&size=12
    @GetMapping("/by-category")
    public ResponseEntity<Map<String, Object>> getProductsByCategory(
            @RequestParam("categoryId") Long categoryId, // Long 타입으로 변경 반영
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size // 기본값 12개로 설정
    ) {
        List<Product> products = productService.getProductsByCategoryId(categoryId, page, size);
        int totalItems = productService.countProductsByCategoryId(categoryId);
        int totalPages = (int) Math.ceil((double) totalItems / size);

        Map<String, Object> response = Map.of(
                "products", products,
                "currentPage", page,
                "totalPages", totalPages,
                "totalItems", totalItems
        );
        return ResponseEntity.ok(response);
    }

    // 모든 카테고리 정보를 제공하는 API (카테고리 탭/메뉴 생성을 위해)
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        // ProductService의 allCategories 필드는 @PostConstruct로 로드된 데이터를 가지고 있음
        return ResponseEntity.ok(productService.allCategories);
    }
}